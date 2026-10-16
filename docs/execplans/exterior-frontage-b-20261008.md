# Exterior frontage Option B — 2026-10-08

## Goal and binding decisions

Implement the manager-authorized planted clinic frontage. Owner chose Option B
on 2026-10-08. M0: warm-gray stone raised beds, dark soil, restrained white/pink
bloom groups; a flush warm-stone entry inset outside the existing opening;
retain the interior mat and corrected threshold layering; no canopy or sign.
Use fewer, stronger flower groups while preserving a planted full site.

Geometry stays unchanged: zero setback, one-tile sidewalk, 0.12-tile curb and a
continuous pedestrian lane. No room repaint, new trees, clinical content,
routes, hit targets, camera, saves, dependencies, Git or external messages.

## Repository state, ownership and constraints

This is a bounded Sol worker for the sole Claude Code manager. Other workers
share the working tree (peri-op, radiologist reading, UI spacing). FacilityScene
is shared: reread its current contents before every patch; edit only exterior
imports/loading, surface, landscaping and entrance-bed seams. Preserve unrelated
edits. Baselines and validation transcripts go in .local-dev/exterior-frontage/;
no repository-wide cleanliness or acceptance claim. All text is UTF-8, no BOM.

Read AGENTS.md, current handoff, proposal sections 1–4, B direction mockup and
the cited helpers/tests. Concepts are direction only, never runtime art.
Native filesystem/tools precede UI. Built-in image generation only; record
exact prompts, originals, exports, alpha bounds and SHA-256 provenance.
No subagents; the manager retains architecture, browser QA and acceptance.

Owned lanes:

- M1: tools/exterior-frontage-v1/** and public/art/environment/frontage-v2/**.
- M2: small pure exteriorFrontage helper/test, manifest descriptors and exact
  FacilityScene exterior seams; existing tile phase helper only if necessary.
- M3: exteriorLandscape and frontDeskPresentation with their tests; exact
  landscape renderer seams; a background-only contact depth helper if needed.
- M4: focused tests and tests/e2e/exterior-frontage.spec.ts; this plan and an
  additive scoped entry in docs/handoffs/CURRENT_THREAD_HANDOFF.md.

## Milestones and acceptance

1. **M1, beds before remaining kit.** Generate west/east 512×160 beds, contact
   (256,160), uniformly displayed at 1.55T×0.484375T and sidewalkTop+0.50T.
   Inspect rim/soil/face at T=24 and computed 110%/70% tile sizes before painting
   two 256×128 lawn overlays, three 64×32 grass clusters, 128×128 joint-free
   paving, two 256×16 curb strips, and 128×64 flush inset. Preserve full alpha.
2. **M2, surfaces.** World-stable lawn patches/material; one world-anchored
   staggered joint authority; soft 0.12T curb; inset below actors. Existing room
   floor and mat untouched. Validate focused surface/geometry/depth checks.
3. **M3, planting.** Preserve all source proportions, stable site group keys,
   full-site coverage and per-contact sorting inside the landscape band.
   Cull full rendered/shadow bounds, eliminating 22/14px minimum inflation.
   Integrate flowers inside bed soil; keep lower sidewalk/entry clear.
4. **M4, validation and handoff.** Focused tests, full player suite, root
   typecheck/build; e2e discovery/source check. Manager runs actual browser QA.

## Validation

Run the proposal's focused player command with --pool=threads and add the
exteriorFrontage tests. Attempt full player default config; if unsupported,
use --pool=threads and record any command-local sandbox workaround. Then
npm.cmd run typecheck and npm.cmd run build. Never weaken production checks.
Classify unrelated concurrent failures from actual output.

Manager browser matrix: 110%, 100%, 70%, 50%, minimum 10% at browser zoom 100%
and OS scaling 100%; record actual T, devicePixelRatio and location.origin.
Capture overview/entry, pan north/horizontally/return, build/undo rooms and
hallways through groups, reload, Build dimming/hit targets, mature clinics and
narrow viewports. Run both-side arrivals/exits for ambient pedestrians,
patients, founder, employees and applicable service/companions. Feet stay in
front of beds and threshold; central aperture and lower sidewalk remain clear.

Owner pathway remains START_GAME.cmd → http://127.0.0.1:4173 in the same
persistent profile. Manager synthetic QA 5183 has separate storage; worker
starts no server and accesses no owner storage. A validated checkpoint remains
local; manager reminds owner to say **push to GitHub** after acceptance.

## Progress and next action

- Intake: binding decisions and lanes recorded; current source seams inspected.
- M1 complete locally: 11 independent built-in image generation calls, exact
  prompts and untouched originals saved; 11 versioned PNG exports and hashes.
  West/east bed proof inspected before generating the remainder, at T=24,
  computed T=41 (110%) and T=27 (70%) for a declared 920×325 / 64×40 offline
  fixture. Rim, darker planting/soil band and front face remain separate.
  Live tile sizes depend on viewport/site; this proof is not browser acceptance.
- Resume audit: all nine captured source/test files still match intake bytes.
  No runtime edits existed at resume; art source/export work was preserved.
- Curb export uses the continuous opaque central band; faint generated alpha
  debris outside that band is retained in originals, excluded from the crop.
  No painting, concept extraction or tree/room edits occurred.
- M2 complete: world-seeded broad lawn patches and proportional flecks;
  joint-free paving under one 1.2-tile/two-row half-stagger joint system;
  uniformly scaled/cropped 0.12-tile curb with cap phase anchored to its own
  band; flush 1×0.5-tile inset above joints and below sortable actors.
  Six focused files / 32 tests PASS; player typecheck PASS.
- M3 complete: stable unequal tree/understory/bloom/grass groups throughout the
  site; native proportions and subpixel scaling; complete source/shadow bounds
  plus half-pixel raster allowance; projected room, hallway, entrance and full
  sidewalk exclusions; contact sorting confined to the background band.
  Paired integrated beds replace independent bloom accents and stay above
  sidewalkTop+0.015625T / below +0.50T. Twelve focused files / 74 tests PASS;
  player typecheck PASS. Existing tree-gap cleanup remains intact.
- Concurrent backless rolling-stool imports, derivative helper and room render
  changes appeared in FacilityScene during M3; preserved and excluded from the
  frontage diff. No changes to those seams were made by this worker.
- Default-config tests fail before discovery: Vite Windows realpath subprocess
  spawn EPERM. Ignored native .mjs config uses the same React/private-module
  plugins, --configLoader=native --pool=threads --maxWorkers=4. Production
  config/dependencies are unchanged; manager default-environment rerun pending.
- Final low-zoom correction: Phaser Canvas TileSprite truncates fractional
  buffer dimensions. Curb buffers now round up to whole pixels, display at the
  exact fractional world size, and compensate material scaling uniformly.
  This retains the 0.12T curb even below one rendered pixel. A focused regression
  covers T=1,7,20,24,27,37,41,100; no minimum-size inflation was reintroduced.
- M4 worker work complete: new browser spec has three scenarios across four
  configured projects (12 discovered tests). It captures five zooms and live
  bounds, checks pan/material phase, Build dimming, reload and synthetic
  room/hallway culling. It waits for actual dimming and restores the same zoom
  before comparing reload keys. Browser execution/visual acceptance is pending
  with the manager; no browser or server was started by this worker.
- Final focused: 12 files / 75 tests PASS. Root typecheck: seven workspaces
  PASS. Native player production build PASS (591 modules). Required root build
  stopped at the unchanged boundary check: spawnSync git EPERM.
- Final FULL player: 135 files / 1091 tests PASS, 3 files/tests FAIL, 138 files /
  1094 tests total. Besides the known thyroid pending-label failure, two
  concurrent peri-op assertions fail (idle movement and completed coffee trips).
  Both reproduce in an isolated one-thread run. These session/domain files are
  outside this lane and were preserved; the manager must reconcile them.
- Art audit PASS: all 33 original/prompt/export SHA-256 hashes, 11 native PNG
  sizes and measured alpha bounds match provenance. Owned text is UTF-8/no BOM.
- Actual intake-to-current source comparison reviewed without Git. Frontage
  edits are confined to owned seams; the concurrent backless stool delta is
  retained in the shared scene and is not part of this worker's implementation.
- Next: manager reviews the scoped source/art changes, reruns default-environment
  validation, performs the browser matrix below and owns acceptance/checkpoint.

## Handoff

Implementation lane released for manager review. M1-M3 and worker-side M4 are
complete. No product decision is pending. Browser acceptance and reconciliation
of concurrent session failures remain with the manager.

### Owned files

- apps/player/src/facility/FacilityScene.ts: exact frontage imports/preload,
  turf/paving/curb/inset, native plant scaling, full envelope exclusions,
  background contact sorting and paired bed rendering only. Shared file also
  contains another worker's backless-stool edits; do not stage it blindly.
- apps/player/src/facility/exteriorFrontage.ts and exteriorFrontage.test.ts:
  pure world surfaces, stable lawn patch keys, single joint system, curb runs,
  inset geometry and integer-buffer/fractional-display compensation (new).
- apps/player/src/facility/exteriorLandscape.ts and exteriorLandscape.test.ts:
  native ratios, stable full-site groups, complete rendered/shadow envelopes,
  projected construction exclusions and contact order.
- apps/player/src/facility/frontDeskPresentation.ts and
  frontDeskPresentation.test.ts: west/east integrated bed bindings and bounds;
  retired detached flower accents.
- apps/player/src/facility/environmentTilePhase.ts and
  environmentTilePhase.test.ts: optional scale floor for tiny frontage materials;
  existing room-material default unchanged.
- apps/player/src/facility/renderDepth.ts and renderDepth.test.ts:
  monotonic landscape-only depth band; actor/fixture contract unchanged.
- apps/player/src/art/bitmapAssetManifest.ts and frontageBitmapAssets.test.ts:
  11 standalone descriptors and native PNG/base-path/contact validation. Existing
  bitmapAssetManifest.test.ts was read/tested and remains byte-exact to intake.
- tests/e2e/exterior-frontage.spec.ts (new).
- tools/exterior-frontage-v1/** and
  apps/player/public/art/environment/frontage-v2/** (inventory below).
- This ExecPlan and the additive frontage entry in
  docs/handoffs/CURRENT_THREAD_HANDOFF.md.

### Art inventory

All runtime files below are PNGs under
apps/player/public/art/environment/frontage-v2/. Source PNGs and exact submitted
prompts share their basenames under tools/exterior-frontage-v1/originals/ and
prompts/. [Provenance](../../tools/exterior-frontage-v1/provenance.json) records
each original size, crop/export operation, alpha bounds, and all SHA-256 hashes.
The built-in generator was used for 11 independent originals; no purchases,
API calls, concept extraction or room/tree repainting. Cropping and uniform
resampling are reproducible with export_art.py; no artwork is painted by it.

| Runtime basename | Native size | Native anchor | World display/contact |
| --- | --- | --- | --- |
| bed-west-v2 / bed-east-v2 | 512×160 each | (256,160) | 1.55T×0.484375T; contact sidewalkTop+0.50T |
| lawn-sage-v2 / lawn-olive-v2 | 256×128 each | (128,64) | 3.4–5.8T wide; 0.20–0.38 opacity |
| grass-low-v2 / grass-clover-v2 / grass-upright-v2 | 64×32 each | (32,28) | 0.3–0.6T wide; native uniform scale |
| paving-v2 | 128×128 | (0,0) | Joint-free world material at T/128 scale |
| curb-a-v2 / curb-b-v2 | 256×16 each | (0,0) | 0.12T high; 1.92T runs, final run cropped |
| entry-inset-v2 | 128×64 | (0,0) | Flush 1T×0.5T; World+31, below actors |

Reused tree frames remain 321×345, 286×342, 266×337 and 271×307, with their
existing bottom-center anchors. Mature widths are 1.2–1.7T; frame-derived
heights and smaller companions retain those exact ratios. Existing shrubs and
flowers use their measured frame dimensions/anchors as well.

[Bed reduction proof](../../tools/exterior-frontage-v1/proof/bed-reduction.png)
and [complete kit proof](../../tools/exterior-frontage-v1/proof/kit-contact-sheet.png)
were inspected. The pilot used actual reduced pixels at T=24,41,27 before
generating the remainder. The declared offline fixture also renders T=37,20,7;
it is not live browser acceptance. Source curb A's faint outer alpha debris is
excluded by the opaque-band crop; the untouched original is retained.

### Exact validation commands and output

Transcripts and comparison receipts are in .local-dev/exterior-frontage/.
Default-config attempt:

    npm.cmd run test --workspace @gamify-surgery/player

Exit 1 before test discovery: `[plugin externalize-deps] Error: spawn EPERM`
from Vite's Windows optimizeSafeRealPathSync subprocess.
Log: full-player-default-config.log.

The ignored player-vitest.config.mjs uses the same React and
forbid-private-clinical-modules plugins as the production Vite config. Native
config loading avoids the sandbox subprocess; no shipped config or dependency
was changed. Final focused command:

    npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/exterior-frontage/player-vitest.config.mjs --configLoader=native --pool=threads --maxWorkers=4 src/facility/exteriorLandscape.test.ts src/facility/exteriorFrontage.test.ts src/facility/worldExteriorLayout.test.ts src/facility/exteriorActorPresentation.test.ts src/facility/frontDeskPresentation.test.ts src/facility/renderDepth.test.ts src/facility/environmentTilePhase.test.ts src/facility/doorPresentation.test.ts src/facility/roomTouchups.test.ts src/art/bitmapAssetManifest.test.ts src/art/frontageBitmapAssets.test.ts src/art/treeGapCleanup.test.ts

    Test Files  12 passed (12)
         Tests  75 passed (75)
      Start at  12:12:25
      Duration  2.79s (transform 2.45s, setup 0ms, import 3.53s, tests 136ms, environment 1ms)

Exit 0; log m4-focused.log. M2 previously passed 32 tests and M3 74.

    npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/exterior-frontage/player-vitest.config.mjs --configLoader=native --pool=threads --maxWorkers=4

    Test Files  3 failed | 135 passed (138)
         Tests  3 failed | 1091 passed (1094)
      Start at  12:13:13
      Duration  25.30s (transform 9.47s, setup 0ms, import 47.83s, tests 37.58s, environment 10ms)

Exit 1; log m4-full-player-threads.log. Failures outside frontage ownership:

- surgeryCenterServicePreviews.test.ts:85: pendingLabel lacks
  "Off-site thyroid fine-needle aspiration". Already recorded in other handoffs.
- periopNurseOwnerFeedback.test.ts:77: Level-3 rendered.moving is true, expected
  false after the final idle period.
- periopNurseRealVisit.test.ts:87: completed coffee-trip actor count is 1,
  expected 2. This test file appeared during the final validation interval.

The earlier full run passed 1091/1092 tests across 137 files, with only the
thyroid failure (full-player-threads.log). Latest result above supersedes it.
Read-only diagnostic rerun, without changing the other workers' tests:

    npm.cmd run test --workspace @gamify-surgery/player -- --config ../../.local-dev/exterior-frontage/player-vitest.config.mjs --configLoader=native --pool=threads --maxWorkers=1 src/session/periopNurseOwnerFeedback.test.ts src/session/periopNurseRealVisit.test.ts src/session/surgeryCenterServicePreviews.test.ts

    Test Files  3 failed (3)
         Tests  3 failed | 14 passed (17)
      Duration  15.15s (transform 1.82s, setup 0ms, import 3.40s, tests 11.42s, environment 0ms)

Exit 1; concurrent-session-check.log. These failures reproduce serially and
concern simulation/presentation activity, not exterior geometry/art; manager
reconciliation remains required. Do not describe the full suite as passing.

    npm.cmd run typecheck

Exit 0: all seven workspace scripts passed (m4-root-typecheck.log).

    npm.cmd run build

Exit 1 at unchanged verify-app-boundaries.mjs:183:
`Application boundary verification failed: Could not inspect tracked paths:
spawnSync git EPERM`. Log root-build.log. No direct Git command, boundary-check
weakening or repository-wide success claim was made.

    npm.cmd run build --workspace @gamify-surgery/player -- --config ../../.local-dev/exterior-frontage/player-vitest.config.mjs --configLoader=native --outDir ../../.local-dev/exterior-frontage/build

Exit 0: Vite v8.1.5, `591 modules transformed`, `built in 5.44s`.
Log m4-player-build-native.log. Same private-module plugin retained; output is
task-owned scratch rather than another worker's dist. Existing chunk-size,
module-type and outside-root output-directory warnings remain.

    node scripts/verify-launcher-contract.mjs

Exit 0: `Verified launcher health contract gamify-surgery-player protocol 1.`
Log launcher-contract.log. Owner opening pathway is unchanged.

    node ./node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/e2e/exterior-frontage.spec.ts
    node ./node_modules/@playwright/test/cli.js test tests/e2e/exterior-frontage.spec.ts --list

Both exit 0 after the final browser-spec synchronization edit. Strict check
prints no errors; discovery prints `Total: 12 tests in 1 file` (three scenarios
in desktop, compact-desktop, laptop and phone). Logs m4-e2e-types.log and
m4-e2e-discovery.log. Discovery does not launch a browser or prove browser pass.

Final asset/source audit: all 33 original/prompt/export hashes match provenance,
all 11 sizes/RGBA alpha bounds match, and 29 owned text files decode as UTF-8
without BOM. Receipt asset-source-audit.json; intake comparison
working-tree-review.diff and FacilityScene-review.diff. Scene diff includes
the explicitly excluded concurrent backless-stool changes. These are snapshots
of the shared tree, not a repository-wide cleanliness claim.

### Manager browser QA matrix

Use isolated synthetic saves, OS scaling 100%, browser zoom 100%; record
location.origin, actual tileSize, DPR and visual viewport scale for each shot.
The listed T examples are only the declared 920×325 / 64×40 offline proof.

| Game zoom | Offline proof T | Required live capture/acceptance |
| --- | --- | --- |
| 110% | 41 | Overview + entry; soil/rim/stone face, all plant bounds and source ratios; feet beside both beds and through the opening |
| 100% | 37 | Same captures; continuous one-tile walk, flush inset, single staggered joint system, soft 0.12T curb |
| 70% | 27 | Same captures; entry and bed masses remain readable; room/hallway exclusion agrees with rendered envelopes |
| 50% | 20 | Same captures; grouped full-site planting, no detached flower dots or enlarged sprites; clear lower lane |
| Minimum 10% | 7 | Same captures; planting/beds scale with the site, fractional curb stays in its band, overview retains clear circulation |

At each level pan north/horizontally/return, build and undo a real room and
hallway through a group, and reload. Unaffected keys/contacts/material phase
must remain stable; complete intersecting art/shadows disappear and return.
The spec's construction case mutates only the renderer view model and does not
save construction: it supplements, rather than replaces, real Build/Undo QA.

Run ambient pedestrians, patients, founder, employees and applicable service/
companion arrivals and exits from both sidewalk sides. Inspect moving feet
beside west/east beds and threshold; confirm actor depth, mat/door layers,
opening/lower-lane clearance, Build dimming, click targets/locators, mature
expanded clinics and narrow viewports. Preserve existing smoothing settings.

With a manager-owned healthy server at a confirmed unused QA port (5183 if
available), in its task-specific PowerShell process:

    $env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
    $env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5183'
    node ./node_modules/@playwright/test/cli.js test tests/e2e/exterior-frontage.spec.ts tests/e2e/floor-pattern-pan-stability.spec.ts tests/e2e/front-desk-visual.spec.ts tests/e2e/room-touchups.spec.ts --project=desktop-chrome --workers=1

Repeat the new spec with compact-desktop-chrome, laptop-chrome and phone-chrome.
The spec writes overview/entry/Build screenshots under artifacts/screenshots/
and attaches frontage-zoom-matrix.json with actual renderer values.

Owner play remains START_GAME.cmd -> exact http://127.0.0.1:4173 in the usual
persistent profile. QA 5183 and remote Pages have separate saves. No owner
storage, route, hit-target, camera contract, save format or clinical content was
changed. No Git/install/push/deployment; this checkpoint is local only.
Manager owns acceptance and the scoped **"push to GitHub"** backup reminder.

## Manager-review refinement: fuller bed planting (2026-10-08)

Manager accepted the natural-ratio groups, lawn, paving/curb and stone beds in
fresh QA 5183, but requested fuller planting before owner review. Two built-in
imagegen edits now bind bed-west-v3 / bed-east-v3: dense unequal foliage mounds,
larger white/pink clusters and a thin soil margin, with rim/front face clear.
Native size 512×160, anchor (256,160), 1.55T×0.484375T and contact +0.50T are
unchanged. No FacilityScene edit; both complete props remain in the rear half.
Reviewed v2 PNGs, all nine accepted surface/grass assets and original prompts/
provenance remain untouched. New originals/prompts/hashes and native/reduced
comparisons: [refinement kit](../../tools/exterior-frontage-v1/refinement-20261008/README.md).
Proof inspected at T=24,52,41,37,27,20,7; at computed 70% T=27, the mounded
green silhouette and white/pink groups remain distinct from rim/stone.

Owned changes: bitmapAssetManifest.ts and frontDeskPresentation.ts bed IDs;
their two focused tests; exterior-frontage.spec.ts v3 texture/beacon assertions;
two v3 runtime PNGs; refinement source kit, base README and additive handoff.
Existing source geometry, scene, routes, actors, saves and other art preserved.

Validation: the same twelve-file focused command above, native config,
--pool=threads --maxWorkers=4: `12 passed (12)` / `75 passed (75)`, 2.61s, exit 0.
`npm.cmd run typecheck`: all seven workspaces PASS, exit 0. Player build with
the same native config, --outDir ../../.local-dev/exterior-frontage/refinement-build:
`591 modules transformed`, `built in 3.61s`, exit 0. Browser-spec strict TS PASS;
12 tests discovered. Logs: .local-dev/exterior-frontage/refinement-*.log.
Current source/art/BOM receipt: refinement-source-audit.json in that folder;
FacilityScene remains byte-exact to this refinement's intake.

Flush inset: source contract unchanged (1T×0.5T, World+31 above joints/below
actors); browser spec now asserts no tutorial beacon in its real guidance-off
fixture. Live visual confirmation at 110% remains blocked in this worker:
native Chrome `browserType.launch: spawn EPERM`; Node/in-app helpers fail
`windows sandbox ... setup refresh had errors`; CDP 9222 is unavailable.
Server 5183 is healthy (HTTP 200). Do not report this visual check as passed.
Manager can run `node .local-dev/exterior-frontage/refinement-inset-qa.mjs`
against healthy QA 5183: fresh isolated campaign, actual guidance checkbox off,
110/70/140% entry/overview captures and zero-beacon/inset bounds metadata under
docs/design/exterior-frontage/qa-20261008/refinement/. Alternatively rerun the
frontage e2e spec above. Neither route touches owner 4173 storage.

Refinement ready for manager review; final live inset and fullness acceptance
remain pending. UTF-8/no BOM, local only; no Git/install/push/deployment.

## Owner refinement: one frozen site-wide landscape (2026-10-08)

Owner found the grass/tree area repetitive at wide zoom. Replace both the
5.2-by-4.4 garden-cell seed and 5.6-by-4.4 lawn-patch seed with a single frozen
site layout. Keep the accepted v3 frontage beds, paving, curb, flush inset and
all sprite originals byte-exact. No campaign/simulation randomness, save, camera,
route, hit-target, room or clinical changes. No Git or dependency installation.

Lanes: new offline generator/proof tools and one source JSON data file;
exteriorLandscape/exteriorFrontage and focused tests; minimal continuous-turf
seam only in shared FacilityScene; updated browser-spec plant selectors if
needed; this plan and additive handoff. Reread the scene before its exact patch.

Milestones: (L1) generate a variable-density Poisson-disc field with irregular
groves and meadows, then freeze contacts, species, widths and lawn overlays as
data; (L2) import that data without runtime seeding, retain native sprite ratios,
complete-envelope exclusions and contact sorting; (L3) inspect whole-site PNG
proofs at 30%/70% equivalents and verify determinism, density/coverage and
placement-density autocorrelation; (L4) focused player tests, typecheck, player
production build and manager handoff. Existing live-browser limitations apply;
manager owns browser acceptance at every zoom including minimum.

Intake: source baselines and accepted-art hashes saved under
.local-dev/exterior-frontage/landscape-v2-baseline/. Active balance site is
72x32 (starter Front Desk at 33,28); previous proofs used a declared 64x40
fixture. The new frozen field will cover 96x64 once, also covering legacy and
camera-expansion fixtures by cropping the same coordinates without reseeding.
Whole-site proofs will use the active 72x32 site and clearly declare pixel scale.
Next: build the offline layout and compare its full-site structure.

### L1-L4 worker completion and handoff

- L1: tools/exterior-landscape-v2/generate_layout.py, seed 2026100802, writes
  apps/player/src/facility/data/exterior-landscape-v2.json once offline. One
  continuous 96x64 variable-density Poisson-disc field, 25 unequal groves, five
  irregular meadows, independent flower pockets, 1320 plants / 95 lawn overlays.
  Active 72x32 crop: 479 complete plants / 30 rotated patches before construction.
  All four tree silhouettes, three shrubs, white/pink and rare northern yellow
  blooms, three grass frames; independently mixed sizes and contacts.
  No cell motif, campaign RNG, camera dependence or runtime generation.
- Frozen SHA-256:
  c939be12bfe7a089b50b80d3c6bec46587db856e8bf6ac39ed45c0710e22a824.
  Generator --check reproduces bytes exactly. Data is in repository source;
  no Git operation was performed under this worker's No Git brief.
- L2: exteriorLandscape/exteriorFrontage import that single data file and crop
  full bounds without moving contacts. Native proportions, stable keys, source/
  shadow/clearance/raster exclusions, projected construction bounds and contact
  sorting remain intact. Shared FacilityScene only removes the grid fleck loop
  and applies each frozen lawn patch's rotation/flips in continuous turf.
  All bytes outside that method match intake; all 14 accepted runtime PNG hashes
  (13 frontage files plus landscaping atlas) match intake. Existing beds, paving,
  curb, inset, rooms, actors, routes, camera and save formats are preserved.
- L3: inspected whole-site 30% (T=15), 70% (T=28) and minimum 10% (T=9) proofs,
  plus identical-fixture previous-layout comparisons. Unequal crowns/groves and
  open meadows replace garden rows; broad lawn patches have varied scales,
  angles and flips. Proofs are offline composition, not browser acceptance:
  docs/design/exterior-frontage/qa-20261008/landscape-v2/.
  Each declares active 72x32, 920x325 tile-size fixture, DPR 1 and an expanded
  whole-site sheet. Front Desk is a labelled QA footprint marker; no room art.
- Density audit: active site 0.207899 plants/tile, 7-26 per 8x8 analysis sector,
  variation coefficient 0.339741. Maximum positive 0.5-tile-bin axis correlation
  over 3-16 tile shifts: plants 0.021222 vs previous 0.133454; lawn 0.057696 vs
  previous 0.164171. Unit ceiling 0.09 with a repeating-grid sensitivity control
  >0.25. Analysis bins never generate positions. Full 96x64 coverage: 4-27 plants
  per sector. JSON audit and PNG dimension/hash receipt accompany the proofs.
- Tests: frozen contacts, 13 plant frames, size mix, density/coverage, varied
  groves, axis autocorrelation + grid control, redraw/module reload/no RNG,
  expansion/cropping, source ratios at T=1,7,15,20,24,27,28,37,41,100, complete
  low-zoom exclusions and only-intersecting removal; lawn rotation bounds and
  variation. Browser spec now uses new stable plant keys, actual getBounds for
  rotated patches, preserves transforms through pan and intersects the actual
  crown when testing construction against a small sapling.

Owned files this refinement: data/exterior-landscape-v2.json;
exteriorLandscape.ts/.test.ts; exteriorFrontage.ts/.test.ts; FacilityScene.ts
continuous-turf seam; tests/e2e/exterior-frontage.spec.ts; four Python tools and
README in tools/exterior-landscape-v2/; six comparison/proof PNGs, layout-audit
and preview-receipt JSON under qa-20261008/landscape-v2/; plan/additive handoff.
No new runtime art. Source sizes/anchors, generator/audit/proof commands and
links: [landscape tool README](../../tools/exterior-landscape-v2/README.md).

### Latest validation (supersedes earlier task snapshots)

The focused command in the original handoff above, same native config with
--pool=threads --maxWorkers=4, exit 0:

    Test Files  12 passed (12)
         Tests  77 passed (77)
      Start at  14:38:43
      Duration  2.45s

Log: .local-dev/exterior-frontage/landscape-v2-focused.log. FULL player with
that config/pool and no file arguments, exit 1:

    Test Files  1 failed | 139 passed (140)
         Tests  1 failed | 1111 passed (1112)
      Start at  14:41:16
      Duration  20.71s

The sole failure is the already-recorded thyroid pending-label assertion in
surgeryCenterServicePreviews.test.ts:85, outside this lane. Earlier peri-op
failures are absent in this run. Log: landscape-v2-full-player.log.

    npm.cmd run typecheck

Final exit 0, all seven workspace scripts pass; landscape-v2-typecheck-final.log.
Initial run saw TS2339 at packages/game-domain/tests/procedural-staffing.test.ts
(119,55). That file changed concurrently after the check; final rerun passed.
This worker did not edit domain files. Initial output retained in
landscape-v2-typecheck.log.

    npm.cmd run build --workspace @gamify-surgery/player -- --config ../../.local-dev/exterior-frontage/player-vitest.config.mjs --configLoader=native --outDir ../../.local-dev/exterior-frontage/landscape-v2-build

Exit 0, Vite 8.1.5: 594 modules transformed, built in 4.33s. Existing module-type,
chunk-size and scratch outDir warnings remain. Log: landscape-v2-build.log.
Native config retains the production React/private-module plugins; shipped
config and dependencies are unchanged. Sandbox default-loader/pool limitations
are already documented above; manager owns default-environment reruns.

    node ./node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --types node tests/e2e/exterior-frontage.spec.ts
    node ./node_modules/@playwright/test/cli.js test tests/e2e/exterior-frontage.spec.ts --list

Both exit 0; 12 tests discovered, no browser executed. Logs:
landscape-v2-e2e-types.log / landscape-v2-e2e-discovery.log.

### Manager browser comparison and acceptance

Use fresh isolated QA and record actual T/DPR/origin; all source placements are
shared across campaigns. Native-worker browser launch remains unavailable, so
these checks remain with the manager. The existing browser commands/matrix apply.

| Game zoom | Current proof fixture T | Manager review |
| --- | --- | --- |
| 110% | 41 | Arrival area, native mixed sizes and contact overlap; inset visible with tutorial beacon absent; approved beds unchanged |
| 100% | 37 | Pan the entire site; irregular groves, distinct meadows, no repeated companion motif or patch lattice |
| 70% | 28 | Compare whole-site offline proof while panning; bloom/grass masses and full construction clearances |
| 50% | 21 | Wide landscape composition and varied density, no rows or repeated patch tiles |
| 30% | 15 | Compare same-scale offline proof; irregular species/sizes, lawn swaths and clearings |
| Minimum 10% | 9 | Entire grass site: no periodic rhythm, no fixed-pixel inflation, continuous clear pedestrian lane |

Build/undo real rooms and hallways through crown/shadow edges, confirming only
intersecting plants disappear and all others keep contacts/keys; reload, pan
north/horizontally/return, Build dimming, mature-clinic exclusions, both-side
arrivals/exits and narrow viewports. Run the updated browser spec at four
projects and verify page errors remain zero. Proof is expanded to include the
whole site, not a camera or browser screenshot; live tile sizes vary by viewport.

Worker lane complete; manager owns visual acceptance and unrelated full-suite
failure reconciliation. All owned text is UTF-8 without BOM. Local checkpoint
only: no Git/commit/install/push/deployment or external messages. Owner pathway
is unchanged: START_GAME.cmd -> exact http://127.0.0.1:4173 in the usual profile.
Manager QA 5183 and remote Pages still have separate saves; manager retains the
scoped "push to GitHub" reminder after acceptance.
