# Character proportions — 2026-11-02

## Goal and scope

Manager follow-up (2026-11-02): the sprite-only lineup did not reproduce the
owner's complaint. Reopen this bounded task to audit actual occupied room/service
render paths, distinguish baked people from live actors, provide a real FacilityScene
comparison and manager-run Playwright captures, fix provable scale outliers, and
visually select the ten most noticeable identity-proportion candidates. Preserve
concurrent queue/routing edits. No Git, installs, network or image generation.
Current-state copies are under the audit folder's `occupied-rooms/baseline/`.

- [x] Inventory all active/inactive people in fixture/room/service art, with
  actual draw records, effective source-to-world measurements and file:line.
- [x] Real occupied-room QA next to founder at one world scale; capture script
  for manager before/after runs (not a fitted thumbnail or standalone lineup).
- [x] Correct safe presentation outliers; document inseparable composite art
  with exact native regeneration dimensions instead of damaging furniture.
- [x] Top ten visually noticeable identity differences and contact sheet.
- [x] Occupied-state invariants, focused/full player and seven typechecks.
- [ ] Manager runs real browser captures and accepts visual result.

Early follow-up finding: the X-ray and phlebotomy fixture atlases contain no
people. Those occupants are live normalized actors. The screenshot's apparent
size mismatch must be checked against actual height and breadth/proportions;
do not assume its equipment composite contains people.

## Follow-up results and handoff

Current handoff: `.local-dev/character-proportions-20261102/occupied-rooms/README.md`.
The original phase-one results below remain as history; this follow-up supersedes
the one-final-factor assumption and the broad-suite failure status.

- Audited 33 buildable rooms / 61 orientation-tier-covered states; measured 225
  live actors from 63 actual-renderer QA cases. Room/asset/draw file:line records
  and fixture contact sheets are in the local package. Seven service-example
  WebPs are retained but unused by active room draws/live character resolution.
- X-ray/CT/MRI/ultrasound/phlebotomy/exam/recovery/waiting occupants are live
  actors. Only endoscopy south/east and occupied OR have baked covered patients.
  No independent lying sprite exists; covered anatomical height is unmeasurable.
  Regeneration canvases are 479x943, 953x517 and 215x465; preserve furniture.
- Standing heights were already close, but seated figures spanned roughly
  81–114% of the seated founder median, 75.1875px at tile 52. Added the smallest
  seated/exam-table correction fitting all cardinals at every integer tile
  26–130. Corrected 244 identities (237 adults / seven children), preserved 40
  already-in-band and ten nonhuman. Held 42 (40 adults / two teens) needing
  +10.19–19.89% pose changes for 160x320 seated-cardinal regeneration. No source
  art, furniture, authored contacts or routing changes; every held factor is 1.
- X-ray representative red sweater and green tech are 86.79/86.06px tall vs
  founder.14 at 87.28px, but 27%/22% broader. Height scaling cannot fix that
  style difference. Visual top-ten selection from the original 66 includes both;
  contact sheet shows front/east/seated beside founder at equal world scale.
- New save-free `/character-rooms.html` uses real FacilityScene fixtures, actors
  and chair masks. `node tools/art/character-room-capture.mjs --channel chrome`
  captures 378 before/after PNGs at 70/100/160%; `--verify` checks live bands,
  complete output and source/PNG hashes. Manager runs browsers; no captures
  claimed yet. Before is pre-follow-up standing-only scale, so standing X-ray
  and furniture are intentionally unchanged. Origin remains 127.0.0.1:4173.
- Validation: full player **319 files / 3,275 tests PASS** (236.34s); focused
  **15 files / 135 tests PASS** (final 6.54s); Node **3 tests PASS**; all **seven
  typechecks PASS**; both reproducibility audits and capture syntax PASS.
  Full/focused use existing net-use preload, CI=1, --pool=threads. Exact logs
  are in occupied-rooms/. No unrelated assertion/timeout changes. Current
  shared-tree entry assertions pass; no entry/save work was done in this lane.
- Inspected source changes against follow-up baseline without Git: no approved
  room data/renderer or character registration changes, only pose-scale calls,
  new character data/tests/tools/dev QA. Concurrent waiting-support source is
  preserved. Browser acceptance, 42 seated holds, three covered composites and
  top-ten owner regeneration decisions remain explicitly open.

Next action: manager runs capture/verify, reviews furniture/head/zoom in the
same-origin campaign, and accepts the visual result. Local checkpoint only;
after acceptance remind the owner to say **"push to GitHub"**. No Git, installs,
network or image generation in this follow-up.

Audit all packaged character batches, normalize map presentation around the adult
human founders, and preserve authored seat contacts, floor contacts, depth and
camera scaling. No image generation, dependencies, network, Git changes, clinical
content, movement/queues, saves, entry/loading UI or changes to identity selection.
This is the bounded Codex worker lane assigned by the Claude Code manager.

## Repository state and ownership

The shared tree contains extensive pre-existing changes, including character art,
registries and FacilityScene. Preserve them. Before-edit copies of the relevant
files are in `.local-dev/character-proportions-20261102/baseline/`; compare those
copies instead of Git. The first exploratory command inadvertently included a
read-only `git status`; no subsequent Git commands are authorized or planned.
Worker owns `apps/player/src/art/character*`, character-only presentation/anchor
changes and tests in `apps/player/src/facility/`, `tools/art/character-*`, and this
plan. QA artifacts go under `.local-dev/character-proportions-20261102/`.
Manager runs browsers and accepts the final visual result.

## Requirements and decisions

- Inventory all files under public/art/characters and distinguish active individual
  stills, inactive walk pilot and archived atlases. Audit manifests and presets.
- Reproducible Node audit, no new dependencies. Measure alpha bounds, floor span,
  silhouette-derived head/neck and shoulder estimates with documented limitations;
  report anatomical ambiguity rather than claiming a pixel algorithm knows anatomy.
- Adult reference is the median existing rendered height of human founder.01–20.
  Adult standing cardinals must fit ±5% at normal playtest zooms. Children use
  explicit editorial age groups; nonhuman founders keep their silhouettes.
- Never redraw or anisotropically alter a head/body. Flag large corrections and
  proportions unlike the founders for later regeneration, with source identities.
- Keep a shared identity factor across poses; the occupied-room follow-up adds
  a bounded, shared seated/exam-table factor for independently measured seated
  drift. Preserve authored seat contacts. Hold pose changes above 10% for art review.
- Walking currently reuses standing cardinals with hop/breath motion. Beds/recovery/
  OR may use occupied furniture composites; explicitly audit that limitation.
- Dev-only comparison must expose identical zoom, before/after, all cardinals,
  seats, head-label and depth reference planes; no app-entry edits.

## Milestones and acceptance

1. Audit: inventory, measured per-pose CSV/JSON/table, contact sheets and reproducible
   methodology. Establish numerical reference and identify outliers.
2. Normalize data/presentation: bounded adult/child heights, aligned floor and seat
   contacts, aspect-preserving integer display dimensions, crisp character sampling.
3. Validation: focused scale/baseline/seat/head/zoom tests; full player suite using
   the existing net-use preload and `--pool=threads`; all seven workspace typechecks.
   Provide manager exact before/after screenshot instructions and open visual risks.

## Progress

- [x] Read repository instructions and current handoff; preserve pre-existing files.
- [x] Confirm active renderer uses 336 identities / 2,718 individual stills, a
  downward-only south-derived cap of 246px, and uniform authored 160×320 frames.
- [x] Complete measurements and archived inventory: 18 folders, 2,951 PNGs,
  2,718 active stills, 160 inactive walk frames, 2,590 archived cells/components.
- [x] Implement and verify normalization and QA comparison, without editing art bytes.
- [x] Focused/full player/typecheck validation and manager handoff. Follow-up
  broad run is green; earlier failures are retained below as phase-one history.
- [ ] Manager: run matched before/after browser screenshots, furniture/covered-bed
  and label/zoom checks; review proportions and accept the visual result.

## Phase-one validation commands and historical results

Use PowerShell `npm.cmd`; all Vitest runs used the existing net-use probe preload:
`$env:NODE_OPTIONS = '--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/casual-followups-20261028/vite-net-use-preload.cjs'`.

- `node tools/art/character-proportions.mjs --write-data`: generated reviewed
  runtime data; subsequent plain `node tools/art/character-proportions.mjs` PASS
  verifies reproducibility, registry digest and all 2,718 active PNG hashes.
  `audit.log` records exact counts and reference measurements.
- `node --test --test-isolation=none tools/art/character-proportions.test.mjs`:
  **2/2 PASS** (alpha/fringe/crop/neck/shoulder and lossless PNG round-trip).
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
  src/art/characterBitmapArt.test.ts src/art/characterProportions.test.ts
  src/art/characterStillRegistry.test.ts src/art/characterWalkRegistry.test.ts
  src/facility/characterPresentation.test.ts src/facility/characterPauseArrival.test.ts
  src/facility/characterInspect.test.ts src/facility/characterMotionPresentation.test.ts
  src/facility/characterHopMotion.test.ts src/facility/approvedRoomPresentation.test.ts
  src/facility/approvedSideChairLayers.test.ts src/facility/renderDepth.test.ts
  src/content/founderAppearancePresets.test.ts`: **13 files / 130 tests PASS**.
  Final output: `focused-complete.log`.
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **311 files / 3,259 tests PASS; 6 files / 11 tests FAIL**, 341.78s.
  Nine assertions concern concurrent welcome/account-entry behavior outside
  this lane: App.cloudAccess 2, App.cloudLifecycle 2, mobileEntryIntegration 1,
  WelcomeArtwork 4. Two are simulation timeouts: levelFourIntegration 30s and
  periopNurseOwnerFeedback 5s. Exact output: `player-full.log`. No out-of-lane
  assertions, source or timeout configurations were edited.
- Both timeout files rerun with existing `CI=1` allowances:
  `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
  --maxWorkers=1 src/session/levelFourIntegration.test.ts
  src/session/periopNurseOwnerFeedback.test.ts`: **2 files / 6 tests PASS**, 58.01s.
  Exact output: `simulation-rerun.log`. Nine entry assertions remain for manager
  integration; no broad-suite green claim.
- `npm.cmd run typecheck`: **all seven workspaces PASS**, including final rerun;
  `typecheck-final.log`.
- Exhaustive offline integer-tile check: **144,744 standing-facing checks PASS**,
  every integer tile 20–130. Adult extrema 96.45–104.98% of founder reference;
  all three child bands pass. `integer-tile-invariants.json` records extrema.

Logs and reports are under `.local-dev/character-proportions-20261102/`.

## Discoveries and next action

Actual alpha>=32 silhouettes exposed near-transparent fringe in older metadata:
maximum top error 47px (seated patient), and 36px for the older employee regression
gs022-new-employee-009. The South-only cap shrank some real figures too far.
Measured floor errors are at most 1px. The prior median human founder rendered
height is 85.44375 world pixels at tile 52 (1.643149 tiles); use that reference.

New data stores one factor per identity and bounds/floor per sprite. The old
registry, PNGs, authored seat contacts, founder presets and IDs stay unchanged.
The runtime uses measured floor/body-axis origins, real visible tops for labels,
and NEAREST character sampling while retaining room smoothing. Geometry remains
integer with exact 1:2 frame aspect, and follows the existing world tile/zoom.

Child art bands: 5–7 visual years 70–81%; 9–12 81–90%; 14–17 91–99% of reference.
These are editorial presentation groups and do not change patient selection.
Nonhuman founder silhouettes retain prior factors. Below 20px world tiles, allow
one visible pixel for quantization. Real camera zoom also interpolates full-site
and working tile sizes; the QA page uses fixed tile 52 for controlled comparison.

Sixty-six identities are screened for proportion/large-scale visual review. The
head/shoulder algorithm estimates a neck contour, not anatomy; all values carry
confidence and a marker contact sheet. Older employee20 (14 candidates),
patientPublic20 (15), employeeCoverage (8) and original adult patients (8) show
the strongest batch signals. See `batch-proportion-review.json` and the numbered
`regeneration-review.png`/key. Scaling cannot repair confirmed head/body mismatch.
Three older employees change >10% vs the buggy cap; all remain downsampled even
at 250% camera zoom. No regenerated art, anisotropic warping or source resampling.

No individual lying sprite exists. Endoscopy/OR use occupied covered furniture
and hide the individual patient; recovery supports use seated stills. Existing
composite tests passed, but physical room occlusion remains browser QA. The
standalone page's seat proxy verifies contact math, not actual furniture art.

`characterBitmapArt.test.ts` deliberately replaces the old cap assertion with
profile/invariant coverage. `characterPresentation.test.ts` replaces the old
LINEAR string assertion with explicit character NEAREST / room LINEAR routing.

Concurrent service-visitor waiting-support imports/call changes appeared in
FacilityScene after baseline capture. Preserve them; they belong to the other
worker and are excluded from this worker's claimed edits. Phase-one scene changes
were character filtering, measured head labels and body-axis origin; follow-up
adds only pose-aware scaling/locator calls and a development-only render hook.

The original standalone QA remains a useful per-identity/pose inspection tool;
actual occupied-room captures and current validation are now described in the
follow-up handoff above. The historical nine entry assertions now pass in the
shared tree. Manager must still accept matched 70/100/160% room/furniture/head QA.
Checkpoint remains local only. Worker performs no Git writes.
