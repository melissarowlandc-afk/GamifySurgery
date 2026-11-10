# Retained facility pan/zoom — 2026-11-08

## Goal and constraints

Retain facility display objects while desktop/phone pan and zoom use a camera
transform. No full world rebuild during a gesture; one settled crisp zoom redraw
is allowed. Preserve picking/Build/labels/actors, camera preferences/limits,
desktop splitter shade, phone frame/memory policies and resting image quality.
No RenderTexture memory expansion. No domain, clinical, cloud/session, UI density,
commit/push/deploy/install/agent/browser work. Shared tree: preserve all other
lanes; re-read files before patches. Native installed tools only, no network/Git.

## Baseline and ownership

Read AGENTS, current handoff, splitter report and source. Captured 149 rendering/
test sources under `.local-dev/map-pan-zoom-20261108/entry` with raw SHA256.
Owned: FacilityScene/Canvas, a new camera projection helper, facility signature
camera invalidation, associated tests, splitter e2e observations and a new
map-pan-zoom-performance e2e. Do not touch active save/cloud or clinical files.

## Milestones

- [x] Read instructions and capture current rendering baseline without Git.
- [x] Measure actual scene pan/zoom steps and display-object churn on public
  Level4/5 fixtures in an instrumented headless renderer before implementation.
- [x] Retain world objects and apply immediate camera transforms; split screen
  projection from retained draw coordinates, preserve input/UI mapping and shade.
- [x] Add gesture/settlement, picking/overlay, persistence and native camera math
  tests; add manager browser frame-time/artifact spec without running a browser.
- [x] Run focused and full player `npm.cmd test -- --pool=threads`, root
  `npm.cmd run typecheck`, player build and e2e typecheck. Attribute failures.
- [x] Matched after measurements, source/diff scope audit, research report and
  additive current handoff. Physical/browser smoothness acceptance stays manager.

## Design and findings

Current static-world signature includes camera pan/zoom. applyCamera also forces
refreshLayout; that rebuilds the whole world and destroys/recreates room text.
Desktop shade has a retained sizing/high-water reference; its desired screen
projection must remain authoritative. Plan: render in retained coordinates, map
that frame to the desired projection through Phaser's existing camera, inverse
map input and forward map DOM anchors. After zoom settles rebase once at the
integer target tile scale; panning alone never rebases. Existing asset filtering
and dynamic actor update remain. Use installed Phaser camera source/tests to
verify math; no render-target allocation.

Measured before implementation, then reran the same final harness with a Vite
read-only substitution of captured FacilityScene/signature sources. Each input
step includes applyCamera plus refreshLayout. Both fixtures, desktop/phone,
retain zero world rebuilds or display-object creation/destruction during 24-step
pan/zoom gestures. Settlement does one existing-world crisp redraw, with no new
render target. Native Phaser matrix/inverse checked over 300 deterministic cases.
Fifteen new tests cover real fixture gestures, resting geometry/labels, picking,
DOM pins/menu, doors/chairs/characters, Build ghost, seat glide, campaign switch,
zoom limits, preference restoration and rapid React camera echoes.

Initial focused run found QA camera stubs and absent hint-display test setups;
fixed optional QA rounding and preserved lazy hint coordinate evaluation. All
30 correction/retained-camera tests pass. Root seven-workspace typecheck and
player build pass. Whole-e2e typecheck has 140 diagnostics, identical by full
file/line/code/message headers to a stash-free public-source control with the
captured renderer (no Git); the full normalized diagnostic output also matches.
New map + unchanged shade + updated floor/Level 5 proofs typecheck cleanly.
Full player: 390 passed / 4 failed files (394); 3950 passed / 4 failed tests
(3954), 569.28s. The captured renderer reproduces all four failures (23 pass /
4 fail in 27 tests, 19.95s). No browser run, session/cloud/domain/clinical edit
or rebind. Offline Playwright discovery finds four new desktop/phone cases.

Final matched L5 desktop mean pan/zoom: 19.436/18.599ms -> 0.036/0.038ms
renderer preparation. Including local view projection: 28.986/27.496ms ->
8.647/8.222ms. Phone preparation/projection: 29.692/29.079ms -> 8.299/7.630ms.
Zero full redraws/objects during all measured gestures; one 19–27ms quiet zoom
redraw. Game-state JSON stays byte-exact. Raw actor viewport proofs were updated
to screen projection; splitter layout semantics and its source/test unchanged.

Completed: research report, scoped source hashes/patch and additive handoff.
Next action belongs to manager: review the actual scoped changes and run the
documented browser frame/pixel/touch/Build/shade acceptance set. No other task
or additional implementation milestone is started in this thread.

## Round 2 — manager browser feedback

Manager browser result: 4 passed, 5 failed, 9 skipped at the disposable 5185
test origin. Captured the eleven round-2 input paths and SHA256 without Git in
`.local-dev/map-pan-zoom-20261108/round2/entry`. Preserve the retained-camera
design, splitter shade and active cloud/content work.

- [x] Correct first-paused/resting bitmap sizing; preserve mid-hop freeze,
  per-identity floor registration and existing nearest character sampling.
- [x] Make seat/re-seat fixtures journal-aware, project raw actor/seat bounds
  through the retained camera, and test actual pointer dispatch.
- [x] Wait for opening UI to clear; choose a cover-aware complete gesture path.
- [x] Strengthen non-default camera Build/labels/badges/popups coverage.
- [x] Focused + full player threads, root seven typechecks, player build,
  e2e typecheck; round-2 research/handoff and scope audit.

Evidence: map-click timed out before its first click; its trace is a Level 0
starter clinic rather than the requested 63-room Level 3 fixture (same campaign
ID allowed the durable journal to beat the raw-storage replacement). A failing
performance trace still has the Loading clinic region above the rendered map.
Character trace shows frozen fractional breathing/squash sizes. Fixed 287/320
and linear-filter proof assumptions also predate per-still registration and
nearest character sampling; retain strict integer/aspect assertions and verify
actual source registration/filter instead.

Round-2 complete: 49 focused tests pass, including nine new renderer/input
cases; the captured round-1 scene fails the two new character guards (7 pass /
2 fail). Actual map-click scenario + reducer/view reseats the hallway patient
at command 4 and standing patient at command 10. The legacy Level 1 visual
mutation body is unchanged; its extracted pure builder lets the zoom proof
import before any older document/controller exists.

Full player threads: 391 files/3960 tests pass, same 4 files/4 tests fail
(395/3964;473.83s). Captured pre-camera controls reproduce 4 fail/23 pass in
16.79s. Seven workspace types and player build pass (1053 modules/7.86s).
Seven scoped e2e proofs typecheck; full output still identical at 140 baseline
errors. Discovery:18 cases/5 files. No browser execution or domain/cloud/content
edit. Round-2 report, scoped patches/hashes and additive handoff are complete.
Next action: manager review and the documented 5185 disposable-context browser
rerun; physical pixel/touch acceptance and the one quiet zoom frame remain open.

## Round 3 — desktop frame budget

Manager rerun: character/picking/Build/shade and phone L4/L5 pass. Desktop
drag p95 is 35.4ms (L4) /40.4ms (L5) in Vite development, against 25ms. Captured
140 current sources/documents under round3/entry with SHA256; no round-2
delivered paths had changed. Shared cloud/content lanes stay untouched.

- [x] Measure pointer callback, projection/React, scene update/characters,
  overlays/shade and retained Canvas work before/after on public L4/L5.
- [x] Keep immediate native camera input but publish React/preferences at
  gesture boundaries; preserve cancellation, visibility, pagehide and reload.
- [x] Remove redundant paused presentation work and avoid overlay React/layout
  work; cull only if measured display-list cost warrants it, preserve visuals.
- [x] Provide an opt-in instrumented production build/preview plus equivalent
  production-bundle CPU measurements. Production browser budget remains 25ms;
  no browser execution here or automatic public debug-hook exposure.
- [x] Focused/full player threads, seven types, player build, e2e types;
  scoped patch/hashes, round-3 report and additive handoff.

Round-3 complete. Forty-eight camera samples now cause zero root renders/view
projections, one publication at release. Production-bundle preparation plus
separately measured native Canvas dispatch: L4 9.144->2.164ms /L5
11.479->3.683ms mean; no browser/FPS claim. Offscreen command dispatch drops
79.37%/71.40%, without changing retained draw hashes or game-state JSON. Phone
Build screen/world adapter fixed with two failing captured-source controls.
Production preview/spec stays opt-in; desktop production ceiling remains25ms.

Focused103 tests pass; full player3978 pass/4 known baseline failures
(3982tests,398files,421.59s). Captured controls reproduce4fail/23pass(13.32s).
Seven types, playerbuild(1056modules/4.77s), QAproductionbuild(4.80s), scoped
e2etypes pass. Wholee2etypes140errors/fulloutput identical to prior baseline;
offlineproductiondiscovery4cases. Separate round3 patch/SHAmanifest/report and
additive handoff complete. No domain/cloud/content/shade/density edit, rebind,
browser, Git/agents/network/install/deploy. Next action: manager review and
production browser frame/pixel/touch acceptance. No next milestone started.
