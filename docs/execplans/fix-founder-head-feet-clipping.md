# Fix Founder Head and Feet Clipping

## Goal

Make the founder's complete authored silhouette visibly survive the real
Front Desk composition: the seated pose must retain the whole head, and
standing front/side poses must retain the whole feet, without changing any
route, logical tile, staffing behavior, room rule, or save data.

## Requirements

- Diagnose the actual live overlap instead of moving the proof actor to a
  different tile and treating that as a fix.
- Exercise the real stationary Front Desk staff position, standing front and
  side poses, an open-floor control position, normal mode, and Build mode.
- Cover human and tallest/widest nonhuman founder silhouettes; a fix must not
  work only for the default founder.
- Preserve the full 128-by-192 source frame, 181/192 floor registration, and
  canonical display scale. The owner screenshots now prove that those geometry
  contracts can be correct while the authored standing silhouette still lacks
  recognizable shoes.
- Keep intentional room-wall layering: contents remain behind west/east/south
  walls and in front of north-facing walls.
- Produce new, task-specific screenshots that visibly show the corrected head
  and feet at 100% map zoom.

## Constraints and non-goals

- Graphics/presentation only. Do not change movement, routes, staffing,
  simulation, logical character locations, room footprints, collision,
  buildability, door legality, saves, or clinical/gameplay content.
- Preserve every unrelated hunk in the heavily dirty shared worktree.
- Do not change the global founder/patient floor anchor or character scale to
  hide a Front Desk-only composition collision.
- Identity 10's front/left/right idle source cells end in flat dark trouser
  cuffs without recognizable shoes. Repair only the affected lower-body pixels
  through the existing mask-bounded Cortan workflow; do not fall back to
  Codex-native image generation.
- Do not stage, commit, push, deploy, or release without explicit owner
  direction.

## Relevant repository state

- Every founder standing and seated runtime atlas uses a 128-by-192 cell. A
  prior audit measured transparent gutters above and below the applicable alpha
  silhouettes, but that was only a frame-safety check: it did not establish
  that the lower silhouette included recognizable feet.
- Phaser registers the complete cell and `drawPixelPerson` uses no crop, mask,
  or clipped container. Live tests already report `cutWidth=128`,
  `cutHeight=192`, and origin `181/192`.
- Seated Front Desk staff use the renderer-only v5 display position
  `{ x: 0.4, y: 0.5, scale: 1 }`; the counter and secretary chair are separately
  baseline-sorted fixtures.
- The owner supplied refreshed `Feet off.PNG` and `Head off.PNG` captures. The
  open-C4 proof reproduces the foot appearance exactly, which isolates the
  standing issue to the identity-10 artwork rather than a Phaser crop.
- Identity 10's seated source cell contains the complete rounded hair/head. A
  full-scene Canvas readback confirms that the complete head is rendered with
  no crop or mask. A lower-depth receptionist overlaps its bounds directly
  behind the founder, making the two dark silhouettes merge and look clipped.
- West/east/south structural occluders now correctly foreground solid wall
  segments; north-facing walls remain behind contents.

## Decisions already made

- Treat the two owner symptoms separately: standing requires a narrow raster
  repair, while seated requires a presentation/composition correction rather
  than an atlas or global-anchor change.
- Keep an open-floor standing control alongside the real staff-position proof
  so source-frame completeness and foreground occlusion remain distinguishable.
- Prefer the smallest Front Desk-only presentation separation that preserves
  logical positions and layering rules. Do not solve shared desk occupancy in
  this graphics thread; if the domain should prevent both actors occupying the
  area, record that as a systems-thread follow-up.
- Treat the owner's observation as authoritative even if the previous proof
  passed; acceptance requires a new live image that directly shows the
  previously unproved composition.

## Milestones

1. Add a controlled diagnostic proof for seated and standing founder
   silhouettes at the real Front Desk position, quantify every overlapping
   fixture/wall depth, and capture representative human/nonhuman evidence.
2. Use Cortan's versioned Qwen incremental-edit workflow to create and review
   mask-bounded identity-10 front/left/right standing-foot candidates. Accept
   only complete shoes, unchanged pixels outside the mask, preserved alpha,
   exact 128-by-192 cells, and the existing 181 floor baseline; splice only
   accepted cells into the matching runtime atlases.
3. Implement the narrow Front Desk-only presentation separation identified by
   the seated evidence, without changing any logical location, route, staffing
   rule, or save.
4. Capture final normal/Build proof, run focused character/Front Desk tests,
   relevant visual regressions, typecheck, build, native image inspection, and
   update the continuous graphics handoff.

## File or module ownership

- Milestone 1 Terra:
  - one new focused E2E spec under `tests/e2e/`;
  - new `artifacts/screenshots/front-desk-founder-anatomy-*` diagnostic files;
  - diagnostic evidence/progress in this plan;
  - no production files.
- Milestone 2 Terra after Sol acceptance (or Sol only because both required
  Terra starts failed with the same worker-service 404):
  - accepted identity-10 cells in the affected founder v4 atlases;
  - narrow Cortan review inputs/outputs under the existing graphics-review
    folders;
  - founder atlas verifier coverage that distinguishes shoes from trouser
    pixels;
- Milestone 3 Terra after Sol acceptance (same availability fallback):
  - narrow Front Desk actor-presentation hunks in
    `apps/player/src/facility/frontDeskPresentation.ts` and its test;
  - narrow actor-position/depth hunk in `FacilityScene.ts` only if required;
  - the focused E2E proof and task screenshots;
  - no unrelated renderer or domain files.
- Sol owns diagnosis acceptance, production-fix selection, actual diff/test/
  image review, final integration, and the handoff update.

## Acceptance criteria

- Live source rectangles remain complete 128-by-192 cells with the audited
  source-alpha safety gutters and recognizable shoes above the 181 floor
  baseline in identity 10's front and side standing frames.
- At the real seated staff composition, the complete head remains visible and
  visually separated from a lower-depth adjacent actor.
- Standing front and side poses visibly retain both complete feet in the
  actual reported composition and the open-floor control.
- Human and high-extents nonhuman founders remain complete at the same 100%
  display scale and floor registration.
- The counter/chair still compose naturally, wall occlusion remains correct,
  and normal/Build modes agree.
- Focused tests, relevant E2E regressions, typecheck, build, and scoped diff
  checks pass.

## Validation

- founder/character bitmap and Front Desk presentation Vitest
- dedicated desktop-Chrome founder-anatomy proof at 100%
- existing `front-desk-occlusion-polish` and `character-resolution-zoom` E2E
- workspace typecheck and production build
- native inspection of all new task screenshots
- scoped `git diff --check`

## Progress

- [x] Read repository instructions, current graphics handoff, prior Front Desk
  plan, dirty tree, source atlases, registration code, and prior screenshots.
- [x] Complete a read-only source-frame and renderer-path audit.
- [x] Milestone 1 diagnostic is accepted after Sol independently reran the
  corrected one-worker browser proof to exit code 0 (1 passed in 52.3s).
- [x] Receive and inspect the owner's refreshed `Feet off.PNG` and
  `Head off.PNG` evidence.
- [x] Reproduce the identity-10 standing source silhouette and seated live
  composition; distinguish missing authored shoes from visual actor overlap.
- [x] Generate, accept, and splice the mask-bounded Cortan standing-foot repairs.
- [x] Implement and prove a narrow seated-composition separation.
- [x] Complete focused diagnostic validation and update the graphics handoff.

## Discoveries

- The current source/registration path cannot itself explain missing pixels:
  all applicable cells have transparent gutters, use complete Phaser frames,
  and have no crop/mask.
- The prior open-C4 standing proof verified a different composition from the
  one the owner is reporting, so it cannot close this regression.
- The new 100%-desktop live proof reads each Phaser frame directly. Human,
  Rabbit (23), Antenna Alien (27), and Axolotl (29) all retain a complete
  128-by-192 frame with the 181/192 floor origin and source-alpha gutters.
- The initial standing diagnostic was invalid because exact B3 always invokes
  `shouldRenderFounderSeatedAtFrontDesk`, regardless of the test-only
  `founder.seated` flag. Those misleading captures were replaced.
- The corrected test uses exact B3 only for production seated capture. Its
  genuine idle front/left controls use the fractional logical point
  `{x:34.5,y:29.28}`: through the ordinary actor formula it maps to the exact
  same V5 B3 staff display center/base, while it cannot satisfy the integer
  auto-seat predicate. The spec asserts the live front-idle and left-idle
  atlas/frame IDs.
- Alpha bands now use `container.getBounds()` in world space rather than an
  image child's potentially local bounds. Fixture images and all other
  character containers are checked at their live world bounds/depths. The
  seated head has no higher-depth bounds candidate. At the artificial B3
  standing control, the counter intentionally covers the feet because the
  actor is behind the desk. At open C4, side-facing feet have no candidate;
  front-facing feet intersect only the transparent rectangle envelope of the
  counter shadow and remain visibly complete in the native captures. The
  current fresh-scene evidence therefore does not reproduce a raster crop,
  canvas/container mask, viewport clip, or wall collision.
- Sol's independent rerun correctly found that `seated.higherFeet` contains
  `room:room.instance.founder_desk:2:frontDesk` at depth `139444`. This is
  expected counter coverage of a seated lower body, not a seated-feet defect;
  the diagnostic now asserts only seated head visibility and records that
  counter cover explicitly. The same complete overlap arrays are emitted for
  true standing front/side B3-display and C4 controls.
- `Wall fix.PNG` visually matches the shoulder-waves founder preset (zero-based
  identity 10 / `head.11`), so the diagnostic now includes seated B3 and idle
  C4 proofs for that identity at 100% and an additional 160% C4 capture.
- The 160% capture initially reverted to persisted identity 0 after the zoom
  UI redraw. The test now re-poses identity 10 after zoom and asserts its live
  `...founders-front-idle-v4-r9-hires:10` frame immediately before capture;
  native review confirms the regenerated 160% image is the Wall-fix woman with
  complete head and feet.
- Sol's third review found that the corrected E2E still failed because C4
  front-facing proof had a higher-foot *rectangle* candidate for the
  transparent Front Desk shadow image. Native captures show visible complete
  feet, so raw image envelopes are now explicitly named conservative bounds
  and are not used as visible-pixel occlusion assertions. Hard contracts remain
  only for seated/standing B3 counter coverage and all head bounds; open-floor
  feet are established through complete frames, viewport/world bounds, and
  native 100%/160% images. Counter assertions compare stable image keys rather
  than zoom-sensitive numeric depths.
- A subsequent worker rerun found that Phaser rectangle getters are not
  serialized across `page.evaluate`; the diagnostic now serializes explicit
  `{left, top, right, bottom}` world coordinates for actor/container and all
  image bounds. That worker run produced a passing Playwright result record but
  no shell exit line, so Sol did not accept it until the independent exit-0 run
  recorded below.
- An already-open FacilityScene can retain a stale decoded founder texture:
  Phaser reuses an existing texture key, atlas frames are only registered when
  absent, and the React canvas owns one long-lived game instance. A normal
  reload at `http://127.0.0.1:4173` reconstructs the scene and revalidates the
  current no-cache PNG while preserving the same-origin local save. Bumping the
  asset ID would not update an already-instantiated scene by itself.
- Sol's final exact command completed with exit code 0: one desktop-Chrome
  proof passed in 52.3 seconds. Its conservative report recorded expected
  counter coverage behind the desk and transparent shadow-envelope candidates
  at C4 without mislabeling either as source clipping.
- The refreshed owner screenshots disprove the old conclusion that an intact
  alpha gutter implies complete anatomy. Native inspection of identity 10's
  front, left, and right idle source cells shows dark trouser legs ending in a
  flat baseline with no shoes/toes. The open-floor runtime capture has the same
  silhouette, so Phaser does not remove those pixels.
- The seated identity-10 source cell has a complete head. A new live Canvas
  differential rendered the full scene twice, differing only in founder
  visibility. The founder uses the complete 128-by-192 frame at origin
  `181/192`, has no actor/container/camera mask, and contributes essentially
  the complete head band. The only overlapping character is
  `character:staff:employee.visual.receptionist`: its depth is `132961`, below
  the founder's `134624`, with overlapping bounds. The screenshot therefore
  shows visual silhouette merging, not source or display-frame clipping.
- The first Canvas comparison incorrectly demanded identical anti-aliased
  pixels over two different backgrounds. The corrected differential compares
  otherwise-identical full compositions with and without the founder; its one
  equal-color head pixel is a color coincidence, not an omitted source row.
- Required Terra `/root/founder_clip_repro` failed at service handoff with HTTP
  404. The single retry `/root/founder_clip_repro_retry` failed immediately
  with the same service error. Per the orchestration fallback, Sol continued
  the bounded diagnosis and preserved the partial pixel-readback work.
- The accepted Cortan composites are stored as exact source copies under
  `tools/comfyui/accepted-assets/founder-11-foot-repair/`. Their SHA-256
  values match the owner-reviewed candidates: front
  `FEC79447F6CDBA9EA84904920D7617C7583C751F2C0F2E7390061013FF79C47B`,
  left `B416965AD55E1EC5E9114D6E75F01C3217B6E9BC8DBB26BFEFFC2D7FC363B08C`,
  and right `99A48BBEE1EC6D890CE3B5435C4262F772D0401EE4AA3AEAA4492AFC17AF9442`.
  Only zero-based identity 10 changed in the front-, left-, and right-idle
  atlases; each runtime cell is pixel-exact to its accepted candidate.
- `verify-founder-actors-v4.mjs` now rejects identity 10's prior flat cuffs:
  it requires pixel-exact accepted cells, dark toe-band coverage below the
  cuffs, pose-specific toe extension, the 181px floor baseline, and existing
  transparent perimeter/atlas geometry contracts. The founder pack revision
  is `founders-v4-r10-feet`.
- The Front Desk-only presentation contract now recognizes exactly a stationary
  `staff.receptionist` at B2 while the founder is quietly seated at B3. It
  applies a renderer-only `-0.72` westward center offset to the receptionist;
  its persisted tile, route, role, and depth category remain untouched. The
  live 100% desktop proof confirms the receptionist stays visible below the
  founder depth while its right edge clears the founder head band.
- The fresh normal-mode Canvas differential records 457 changed head pixels
  out of 458 isolated source pixels (99.78%); the single equal-color pixel is
  permitted by the 99.5% threshold. Build mode uses the same complete isolated
  source-row proof but does not compare full-scene RGB changes because its
  overlay intentionally changes the composition palette.
- Focused Front Desk presentation Vitest passed (13 tests). The dedicated
  desktop-Chrome anatomy proof passed after fresh normal and Build screenshots;
  `front-desk-occlusion-polish` and `character-resolution-zoom` also passed
  together on desktop Chrome.

## Exact next action

Sol should review the scoped presentation diff and fresh task screenshots,
then complete the remaining integrated validation and graphics handoff without
changing routes, saves, gameplay, or wall layering.
