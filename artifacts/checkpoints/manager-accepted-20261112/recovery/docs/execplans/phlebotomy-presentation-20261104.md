# Phlebotomy chair and actor presentation — 2026-11-04

## Goal and constraints

Resolve the owner's live-room report that the blood-draw chair looks too large
and the patient sits on top of the phlebotomist. This is a bounded presentation
task assigned by the manager. Inspect both supported room orientations (0/270),
all supported camera scales, the actual fixture crop, seat contacts, actor scale
and painter depth. Preserve gameplay/navigation, other rooms, concurrent work,
the pending 244 seated corrections and the staged 19-identity redraw package.
No Git, installs, network, image generation or worker browser launch.

## Repository state and ownership

The tree is shared and contains newer save/cloud and furniture-layer changes.
Read AGENTS.md and the current handoff before editing. Do not overwrite those
changes. Current-file copies and hashes will be recorded under
`.local-dev/phlebotomy-presentation-20261104/baseline/`; use those instead of Git.
Owned lane: phlebotomy-only art/presentation data and tests, narrow resolver/scene
integration, `tools/art/character-phlebotomy-*`, dev-only QA and this plan. No
game-domain/queue/routing, clinical, save/cloud, entry or loading changes.

## Milestones and acceptance

- [x] Record the baseline and identify the concrete chair/actor overlap cause,
  including the independent effect of pending seated corrections.
- [x] Apply a phlebotomy-only fixture/anchor/depth correction. Keep native art,
  actor proportions, room shell, furniture other than the draw-chair/stool
  placement, and gameplay unchanged. Prove both orientations and zoom range.
- [x] Provide deterministic actual-FacilityScene before/after QA and an exact
  manager-run Playwright command; browser capture remains manager acceptance.
- [x] Add focused invariants and actual scene integration regressions, update
  previous placement snapshots deliberately, run focused/full player tests with
  threads/preload and all seven workspace typechecks.
- [x] Review scoped changes against baseline, verify protected pending art and
  corrections unchanged, write a separate shipping manifest and handoff.

## Initial observations

The active GS-015 phlebotomy chair/stool atlas contains no baked people. Both
approved supports currently request seated poses. South supports share x=1.5;
east seats are x=1.354 and x=1.701 at almost the same y, only ~18px apart at
tile=52. The pending seated factors alone do not alter those contacts or chair
size. These are observations to validate against the source cushion and real
render path, not yet final correction values.

## Validation

Use the existing net-use preload and CI timeout configuration:

```powershell
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/casual-followups-20261028/vite-net-use-preload.cjs'
$env:CI='1'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads <focused files>
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

Exact commands/results and browser instructions are in
`.local-dev/phlebotomy-presentation-20261104/README.md`. Manager uses START_GAME.cmd
and 127.0.0.1:4173; QA has no campaign
or save/session state. Do not claim browser screenshots before the manager runs
the capture script.

## Progress and next action

2026-11-04: inspected current instructions/handoff and preserved named source
baselines without Git. Found separate live people, an east front-edge contact
(539,512) that put the patient against the clinician, and a south stool on the
same x as its patient. Pending seated factors alone do not fix the collision.

Implemented a 15% whole-chair reduction around the source floor contact, a new
east cushion contact (295,435), and phlebotomy-only chair/stool/actor placements.
The clinician is beside the patient's arm in the south view. Native images,
collision/approach metadata, scale factors and all other-room art are untouched.
The south idle sitter needs a .7-tile step from its unchanged arrival tile; one
explicit phlebotomy exception replaces the old .5 bound, without loosening any
other room or changing the 17 idle targets. This is an intentional test update.

Added a separate dev-only actual-FacilityScene page and frozen original records;
before changes fixture/support layout independently of the pending seated
factor switch. Camera uses production sizing for a 32x20 clinic, 728x700 viewport,
zoom .1/.5/.7/1/1.6/2.5 (tile 22/35/42/52/83/130). Active, idle, standing and wide
patient cases cover both orientations. No browser was launched by the worker.

Manager command, after START_GAME.cmd:

```powershell
node tools/art/character-phlebotomy-capture.mjs --channel chrome
node tools/art/character-phlebotomy-capture.mjs --verify
```

Expected: 192 PNGs, full gallery, four native-size camera-1 pairs on one review
sheet, current renderer/art/PNG hashes, actual chair/stool/actor geometry and
cushion/occlusion/height/clearance checks. Browser acceptance remains manager work.
Eight local layout PNGs are explicitly offline diagnostics, not browser captures.

Validation evidence (preload, CI=1, threads, no assertion/timeout changes outside
the explicit phlebotomy presentation expectations):

- Focused **9 files / 106 tests PASS**, 11.67s (`focused-final.log`).
- Final full player **338 files / 3,387 tests PASS**, 434.80s
  (`player-full-final.log`, exact --pool=threads command, default four workers).
- Initial full run: 3,386 pass / one old phlebotomy idle-offset assertion fails;
  the deliberate update above resolves it. The final full run is all green.
- Capture acceptance unit tests **5/5 PASS**, including overlap/seat/depth/size,
  unchanged height pairs and complete/unique 192-case matrix checks.
- Seven workspace typechecks attempted. An intermediate run passed all seven;
  the latest repeat reports two concurrent, untouched
  `src/mobile/build/MobileBuildControls.tsx:31` errors (warning absent from a union
  fallback). The other six pass; no character-lane type errors. Do not edit this
  other lane. Current exact output: `typecheck-final.log`.
- Offline audit PASS: all 314 adults x five eligible phlebotomists, every integer
  tile 22-130, factors off/on, positive horizontal silhouette gap in both views;
  cushion/floor rounding <=1px for tiles 5-130; correct support/mask depths;
  unchanged draw/support results across 180 other-room orientation/tier cases
  and available variants; frozen before data exactly matches original resolver.
- **3,513 protected files unchanged**, including live character PNGs, founder
  presets, pending 244 data/helpers and the staged 19-redraw package. Three room
  atlases match their original proof hashes. No image generation was used.

Production correction needs only `phlebotomyPresentation.ts` and the narrow
`approvedRoomPresentation.ts` adapter hunks. FacilityScene changes expose existing
geometry/protected presentation seams for the QA subclass; the production fix
does not require those QA changes. `shipping-scope.json` and
`production-fix.patch` isolate the exact two-file shipping change. Tests and all
QA/tools remain separately enumerated. No queue/routing, clinical, save/cloud,
entry/loading, Git, install, network, image generation or worker browser action.

Source review: inspected all existing-file changes against task baselines;
only scoped adapter, QA seams and deliberate phlebotomy test updates differ.
No other-room proof/renderer data changed. Packaged separate two-file production
patch, complete 17-file scope/hash manifest, measurements and logs. Updated the
shared handoff with a new block and preserved all earlier blocks.

Worker milestone complete. Next: manager runs captures/reviews the separate
production patch and resolves the concurrent mobile typecheck errors. Browser
acceptance and the pending 244 corrections / 19 redraw decisions remain open.

## Manager capture follow-up — 2026-11-04

Manager's first browser run produced 0/192 because every case hit the capture
guard's `Actor sampling/registration changed` branch. The failure report discarded
all actor geometry. Native package inspection confirms an agent bug: installed
Phaser 4.2.1 `src/textures/const.js` defines LINEAR=0, NEAREST=1; the guard assumed
NEAREST=0. All 337 recorded inputs still matched the failed run, so source hash
drift was not the immediate cause. Exact `% 2` dimension checks are also needlessly
strict about harmless floating-point roundoff.

Follow-up scope: capture script/checks, QA telemetry and tests only; production
chair/anchor data stays intact. Preserve current shared tree and failed evidence
under `capture-followup/baseline/`. No Git, installs, network or worker browser.

- [x] Correct enum/float validation with real installed-library regression tests.
- [x] Replace whole art/facility-file pinning with measured frame/data slices,
  relevant rendering functions and actual phlebotomy fixture inputs.
- [x] Preserve failed PNGs/geometry and report identity-specific diagnostics.
- [x] Run focused Node/player checks, record current typecheck results, review
  scope and provide exact manager rerun commands.

Follow-up complete: 12/12 Node tests PASS (all 192 synthetic cases, genuine
nearest/linear constants, unrelated changes ignored, measured frame/anchor/
scale/pixel/render-function changes rejected); focused player 9 files / 106 tests
PASS (threads/preload/CI=1, 112.44s); all seven workspace typechecks PASS. The
reported MobileBuildControls error is now resolved by concurrent work; this
worker did not edit it. No production code changed, so the original full-player
338 files / 3,387 PASS remains historical validation of that correction.

The QA now loads only 8 measured actor frames and 5 room assets. Protocol 2
reports actual filtering/width telemetry. Fresh input snapshots bracket page
loading and capture, plus offline verification. Shared registries are projected
onto the measured frames; shared rendering source is fingerprinted by relevant
method/room branch, ignoring comments/formatting/unrelated methods. Vite HMR is
mocked only inside the temporary capture context to prevent unrelated reloads.
Every successfully rendered PNG/raw snapshot survives a guard failure.

Production phlebotomy module/resolver and the two character scale JSON files
still match the follow-up baseline. No live assets, staged redraws, pending
seated factors, game-domain, clinical, cloud, mobile or entry files changed.
The six-file QA/tool delta is separately packaged under
`.local-dev/phlebotomy-presentation-20261104/capture-followup/`; original
two-file production patch is untouched. Actual browser acceptance remains open.
Manager uses its existing 127.0.0.1:4173 server and reruns the same capture command
above, followed by `--verify`; old 0/192 evidence is preserved in the follow-up
baseline. No worker browser/network/Git/install action.

## Preserved-capture registration follow-up — 2026-11-04

Manager's second run retained all 192 PNGs/geometry but failed the founder
registration guard. Founder geometry is exactly identical in all 96 pairs.
Native `characterDrawMotion(undefined, pose, seed, clock=0)` reproduces every
fractional dimension: integer base metrics are multiplied by the existing
identity-seeded breathing transform. The guard compared post-motion readback
against pre-motion sizes; this is not a founder/production-layout regression.

Pixel inspection also found 12 stale landscape PNGs (the first before capture
at each orientation/zoom), while 84 founder pixel regions match exactly.
Phaser SceneManager resets status to RUNNING after create; pausing and starting
capture inside create is too early. The QA subclass also triggers the normal
asynchronous environment bootstrap despite its narrow preload. Additionally,
QA changed orientation without projecting width/height, unlike the live model.
These QA defects must be corrected rather than accepting the retained report.

- [x] Validate exact deterministic breathing after validating integer base sizes.
- [x] Start isolated QA after CREATE; prevent unrelated environment bootstrap;
  project the rotated room footprint correctly. No production behavior change.
- [x] Replay retained geometry and PNG checks offline, preserving the failed
  report and distinguishing invalid old PNGs from actor registration failures.
- [x] Build the requested compact native-scale review PNG from valid retained
  before/after idle/off cases, both orientations at zoom 1, with provenance.
- [x] Add regressions, run appropriate Node/player checks and typechecks,
  inspect protected files and hand off exact manager rerun commands.

Baseline and pair evidence: `.local-dev/phlebotomy-presentation-20261104/registration-followup/`.
No Git, installs, network, worker browser or generated/redrawn character assets.

Completed exact motion validation (maximum error 2.85e-14px over 576 figures),
without increasing 1e-6 tolerance. Corrected the guard's exact fixture equality
for native float readback and compensated cushion checks for the same authored
breath transform; .501px contact rounding remains. New pixel checks reject a
changed founder region even if geometry matches. Pair checks now require all
founder fields to remain equal, plus actor width/height/floor registration.

Fixed the missing standing-south preload (four old low-zoom pose failures) and
QA-only projection/bootstrap/lifecycle defects. Scene runtime edit is only the
protected visibility of ensureEnvironmentAtlas; its implementation and the
production phlebotomy module/resolver are unchanged. Pending character data and
redraws remain staged. No queue/routing code changes.

Offline replay (original protocol-2 projection, not acceptance): geometry
188/192 PASS; four old wrong poses fail. PNG hashes 192/192 match; founder
geometry 96/96 identical; founder pixel regions 84/96 match, 12 stale landscape
PNGs correctly fail. Original report stays failed and byte-for-byte unchanged.
`registration-followup/replay.mjs` reproduces the diagnostic and deliberately
exits 1 for that retained invalid evidence. A new protocol-3 browser run is
still manager acceptance, with the same capture then --verify commands above.

Produced and visually inspected `phlebotomy-review.png` (660×616), native-scale
valid retained idle/off cases at zoom 1, both orientations. No resampling;
receipt records all four source PNG hashes/crop and the legacy QA footprint.
The sheet is preserved evidence, not a newly captured corrected-QA scene.

Validation: Node 14/14 PASS; focused player 11 files / 122 tests PASS (39.80s,
CI=1, preload, --pool=threads), including lifecycle/preload/footprint and motion
regressions; all seven workspace typechecks PASS. Existing full-player 338
files / 3,387 PASS is historical production-fix evidence, not rerun for this QA
repair. Ten-file source delta, protected hashes, raw report and logs are under
registration-followup. Manager next: fresh capture/verify; inspect owner sheet.
