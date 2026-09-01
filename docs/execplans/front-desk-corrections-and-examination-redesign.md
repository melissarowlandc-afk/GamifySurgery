# Front Desk Corrections and Examination Room Redesign

## Goal

Preserve the owner-approved Front Desk v5 appearance while correcting its
wall closure, south-edge occlusion, visitor-chair direction, and entrance-bed
relationship to the sidewalk. Then replace the active Examination Room visual
design with a new, repo-native cutaway composition based on
an ignored local room-reference image.

This is a graphics-only task. Logical room footprints, collision, routing,
door legality, saves, progression, balance, clinical content, and simulation
behavior must remain unchanged.

## Requirements

### Front Desk corrections

- Keep the current owner-approved Front Desk v5 furniture arrangement,
  materials, proportions, stationary actor scale, and overall composition.
- Render each wall as visually closed by default. A visible opening may exist
  only at a currently placed explicit door on that wall and offset.
- Keep the protected founder south entrance visibly open because its explicit
  exterior door exists. Any later explicit door must still render independently
  and create a coherent opening through the corresponding wall.
- Make every character and floor-standing furnishing in the south/front area
  render behind the low foreground wall. Nothing whose floor contact is inside
  the room may draw over that wall face.
- Make the southeast/front-right visitor chair face left into the room.
- Make the surgery-center buildable band meet the one-tile sidewalk everywhere.
  Place the two entrance planters directly against the Front Desk exterior on
  either side of the centered front door, within/overlapping the same one-tile
  sidewalk band rather than in a separate grass setback.
- Preserve a clear horizontal pedestrian lane along the bottom/front portion
  of the sidewalk, including directly in front of both planters.
- Preserve at least one furniture-clear legal door candidate on north, east,
  south, and west walls.

### Examination Room replacement

- Treat `exec-7bebc262-1a11-414b-b9a2-ec6ddc2223e1` as the visual authority.
- Replace the active Examination Room presentation rather than incrementally
  polishing its current sparse composition. Keep prior assets inactive for
  rollback; do not destructively delete unrelated or historical files.
- Preserve the authored north-up cutaway perspective in both supported logical
  footprints: 3-by-2 at orientation 0 and 2-by-3 at orientation 90. Do not
  mechanically rotate a furnished bitmap or rotate the north wall away from
  world north.
- Reproduce the reference's visual hierarchy at the available game scale:
  warm clinical floor; dark substantial rectangular walls; centered south
  entry; left/rear sink cabinet with paper-towel and glove supplies; rear
  diagnostic tools and anatomy art; right-side exam table with step; privacy
  curtain along the right/rear; rolling clinician stool; floor scale; waste
  bin; and a broad, readable central circulation area.
- Architecture, fixtures/decor, doors, characters, trash, cleanliness,
  selection, and click targets remain independent layers. Decorative additions
  do not become new gameplay objects.
- Furniture and decor must leave at least one visually and logically legal
  door location on each of the north, east, south, and west walls in both
  orientations.
- Explicit doors must visually cut through otherwise closed walls. Characters
  and floor furniture near the south edge must render behind the Examination
  Room's foreground wall.
- Preserve existing actor identities and interaction anchors; presentation-only
  remapping is allowed when needed to seat or stand them convincingly.

## Constraints and non-goals

- Do not change gameplay, room costs, service timing, placement dimensions,
  pathfinding, collision, door rules, progression, clinical content, or saves.
- Do not redesign other rooms or global character systems.
- Do not flatten live characters or doors into room art.
- Do not install ComfyUI nodes, models, LoRAs, or other software.
- Use Cortan (`https://cortan.taile197db.ts.net`, HTTPS 443) only for a bounded
  missing-art need. The user has authorized the cited Examination Room mockup
  as the direct visual input for this graphics task; do not upload unrelated
  private project material.
- Save review-only generated candidates under
  the ignored local owner-review asset workspace. Promote only inspected, versioned,
  transparent runtime assets under `apps/player/public/art/rooms/`.
- Preserve all unrelated dirty-tree changes, especially clinical-review work.
- Do not commit, push, deploy, publish, or promote `main` without explicit
  owner direction.

## Relevant repository state

- The active Front Desk is an uncommitted v5 component composition using
  `frontDeskV5Architecture.ts`, `frontDeskPresentation.ts`, Front Desk v3
  architecture frames, and Front Desk v2 furniture frames. The owner explicitly
  likes its current overall look.
- The v5 architecture currently contains permanent split north and south wall
  openings instead of deriving openings from actual explicit doors.
- The southeast Front Desk visitor chair currently selects a right-facing
  Front Desk-only atlas frame.
- Entrance planters are currently modeled relative to the grass setback above
  the sidewalk, and their live art sits behind rather than inside the sidewalk
  band.
- The active Examination Room uses two v2 960-by-960 shell bitmaps plus
  independent v1 furniture. Its live proofs are much smaller and sparser than
  the new reference.
- Existing Examination Room visual metadata lives in
  `examinationRoomPresentation.ts`, `roomVisualLayout.ts`,
  `bitmapAssetManifest.ts`, and Examination-specific branches in
  `FacilityScene.ts`.
- Existing visual proof is in `tests/e2e/examination-room-visual.spec.ts`.
- The worktree already contains unrelated and earlier graphics changes. No
  reset, checkout, clean, broad staging, or destructive replacement is allowed.

## Decisions already made

- The Front Desk is a correction pass, not another redesign.
- Walls are visually solid unless an explicit door occupies that exact wall
  segment; visual door openings must therefore be driven from the room's live
  door collection rather than unconditional gaps in an architecture bitmap.
- Planters may overlap the rear/upper portion of the sidewalk visual band, but
  their display bounds must not consume the front/lower pedestrian lane.
- “Completely destroy and re-design” means replace the active Examination Room
  renderer/art package while retaining inactive prior assets for rollback and
  preserving unrelated files.
- The cited Examination mockup authorizes its use as a direct visual reference
  and, if a bounded Cortan request is necessary, as that request's sole private
  image input.
- Reuse clean existing assets where they faithfully match. Generate only the
  specific missing architecture or fixture layers, because broad ComfyUI
  inpainting previously failed to remove Front Desk contents cleanly.
- Both Examination orientations will be authored deliberately from the same
  visual vocabulary; a furnished image will not be stretched or rotated.

## Milestones

1. Audit and decompose the current Front Desk wall/door/depth/sidewalk seams
   and the new Examination reference versus reusable local assets. Record an
   exact implementation map and any truly missing art.
2. Implement the Front Desk-only corrections, focused unit coverage, and an
   actual-app proof showing closed walls, explicit entrance, south occlusion,
   left-facing chair, planter/sidewalk relationship, and a clear walk lane.
3. Produce and inspect a versioned Examination Room architecture/fixture art
   package. Prefer deterministic reuse/composition; use Cortan only for bounded
   missing layers and retain prompts/settings/provenance with review outputs.
4. Replace the active Examination Room presentation for both orientations,
   keeping doors/actors/fixtures independent and all four wall candidates
   clear. Add focused unit and actual-app visual proof.
5. Run integrated validation, inspect native-resolution captures, update this
   plan and the thread handoff, and report the owner-review checkpoint.

## File or module ownership

Each write milestone will be assigned sequentially to one `terra_worker`.
Workers share the dirty tree and may edit only the paths explicitly assigned
for that milestone. Likely owned paths are:

- Front Desk: `frontDeskV5Architecture.ts` and test,
  `frontDeskPresentation.ts` and test, the minimal Front Desk seams in
  `FacilityScene.ts`, Front Desk-specific manifest metadata/tests, and
  `tests/e2e/front-desk-visual.spec.ts`.
- Examination Room: versioned assets under
  `apps/player/public/art/rooms/examination-*`,
  `examinationRoomPresentation.ts` and test, Examination-specific manifest
  metadata/tests, the minimal Examination seams in `FacilityScene.ts`,
  `roomVisualLayout` tests only if the visual envelope changes, and
  `tests/e2e/examination-room-visual.spec.ts`.
- Planning/handoff: this ExecPlan and, at final acceptance only,
  `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.

## Acceptance criteria

- Front Desk retains the approved composition while every non-door wall run is
  visibly continuous and the protected exterior entrance remains coherent.
- A south-edge actor/furniture proof shows the foreground wall correctly
  occluding every in-room object contact.
- The Front Desk visitor chair visibly faces left.
- Entrance beds touch the room on both sides of the south door, overlap only
  the rear portion of the one-tile sidewalk, and leave a continuous front walk
  lane.
- The buildable surgery-center boundary meets the sidewalk with no intervening
  grass strip.
- Horizontal and vertical Examination Rooms visibly follow the new reference's
  density, furniture hierarchy, rectangular shell, centered south entry, and
  central circulation space.
- Both rooms render closed walls except at live explicit doors and keep
  foreground wall occlusion correct.
- Both Examination orientations retain at least one fixture-clear legal door
  candidate on every wall; build-mode highlights correspond to those spaces.
- Logical room dimensions, routes, collision, saves, gameplay, and all
  unrelated rooms remain unchanged.
- Focused tests, player typecheck, player build, desktop visual E2E, native
  screenshot inspection, and `git diff --check` pass.

## Validation

- Focused Vitest for Front Desk architecture/presentation/manifest/layout.
- Focused Vitest for Examination presentation/manifest/layout and any new
  pure renderer helpers.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- `npm.cmd run test:e2e -- tests/e2e/front-desk-visual.spec.ts --project=desktop-chrome`
- `npm.cmd run test:e2e -- tests/e2e/examination-room-visual.spec.ts --project=desktop-chrome`
- Sol inspection of the cited mockup, promoted source assets, and all refreshed
  occupied/vacant/build/orientation captures at native resolution.
- `git diff --check`

## Progress

- [x] Read repository instructions, current handoff, dirty-tree state, and the
  image-generation skill instructions.
- [x] Inspect the new Examination Room mockup at original resolution.
- [x] Confirm the existing Examination v2 proof is materially smaller and
  sparser than the requested design.
- [x] Complete the read-only implementation/art audit.
- [x] Implement and validate the Front Desk corrections.
- [x] Produce and inspect the bounded Examination accessory review package;
  it is retained as review-only because no Cortan alpha candidate passed
  isolation review.
- [x] Replace and correct both Examination Room orientations with the v3
  composition, including four-wall closure, exact live-door apertures, shallow
  south foreground occlusion, focused tests, and actual-app proof captures.
- [x] Complete integrated visual review and handoff.

## Discoveries

- The new reference asks for decorative elements that the preceding
  Examination v2 plan explicitly excluded (privacy curtain, scale, and
  paper-towel dispenser). They are now authorized as visual layers only, not
  new semantic gameplay fixtures.
- The current Examination v2 screenshots confirm that the live room is
  recognizable but visually too small and sparse to match the new target.
- The prior Front Desk generation attempts establish that large-mask SDXL
  cleanup is unreliable on Cortan's current workflow; targeted generation or
  deterministic transparent component assembly is the safer path.
- Terra's read-only audit confirmed the Front Desk's south wall images render
  at depth `FACILITY_DEPTH_WORLD + 29`, while fixtures and actors use sortable
  depths beginning around `100,000 + baseline * 128`. The wall therefore
  cannot currently occlude any live floor object; the correction must put the
  foreground wall into the same deliberate baseline/depth contract without
  globally lowering actors or furniture.
- Live door state is already available through `bridge.viewModel.doors`. The
  protected founder entrance is an exterior door and must participate in the
  v5 opening calculation even though the generic explicit-door renderer skips
  exterior doors.
- `worldExteriorLayout.ts` currently defines a `0.94`-tile setback followed by
  a `1.22`-tile sidewalk. Meeting the new visual contract requires a zero
  displayed setback and a one-tile sidewalk beginning at the buildable grid
  edge, while retaining the domain sidewalk row and route data.
- The existing Examination v1 atlas already provides close matches for the
  sink cabinet, exam table, rolling stool, diagnostic panel, glove supply,
  and anatomy chart. A deterministic v3 empty shell pair is preferable to
  whole-room generation. The only justified Cortan scope is a transparent
  accessory pack containing the privacy curtain, physician scale, paper-towel
  dispenser, and optionally a matching step/bin.
- The Front Desk chair correction is a Front Desk-only atlas-frame switch to
  the existing left-facing waiting-chair crop; no placement change is needed.
- Milestone 2 now derives Front Desk v5 component runs from live door state,
  including the protected exterior south entrance. A no-door wall is one
  continuous run; a placed door removes only its own logical slot.
- The foreground south wall now uses the sortable baseline depth at the visual
  south entrance. In-room contacts render behind it, while sidewalk actors
  and entrance beds have later exterior baselines and remain in front.
- The exterior presentation now has a zero-height compatibility setback and a
  one-tile sidewalk beginning at the grid bottom. Entrance-bed base anchors
  sit in the rear half of that band, leaving its lower portion clear.
- Native inspection of `front-desk-redesign-entrance-close.png` and
  `front-desk-grounded-vacant.png` confirmed a closed north wall, centered
  south aperture, occluded public actor, room-abutting sidewalk, and beds
  with a continuous lower pedestrian lane. The Front Desk-only chair crop is
  now the existing left-facing frame.
- Sol reviewed the actual Milestone 2 source, confirmed that live door records
  drive all wall runs and that the foreground wall/planters share the intended
  baseline ordering, inspected the refreshed close, occupied, vacant, and
  exterior captures at native resolution, and independently reran the focused
  suite (**6 files, 47 tests**) plus player typecheck successfully.
- Milestone 3 reached Cortan over the authorized tailnet URL and uploaded only
  the cited Examination reference once as `gamifysurgery-exam-reference-7bebc262.png`.
  The deterministic crop + BiRefNet workflow produced raw and `Format32bppArgb`
  alpha candidates for the curtain, physician scale, and paper-towel dispenser.
  All three alpha masks retained wall/floor/frame slabs across their full crop
  bounds, so they are honest review evidence but not runtime candidates.
- One narrowly bounded PixelartSpritesheet SDXL img2img refinement per failed
  object (fixed seeds, 20 Euler steps, CFG 5.5, denoise 0.32) likewise retained
  background slabs after BiRefNet removal. The complete workflows, prompt IDs,
  settings, remote filenames, local raw/alpha outputs, and inspection outcome
  are recorded in the ignored local owner-review asset workspace.
- Milestone 3b made the final bounded clean-source text-to-image attempt with
  the same installed PixelartSpritesheet checkpoint and BiRefNet. Its primary
  and one allowed alternate seed for each object produced full-canvas alpha but
  multi-column spritesheets (green fragments for the curtain and characters
  instead of the scale/dispenser), not isolated accessories. The attempt is
  retained with reproducible settings as rejected evidence; no Cortan output
  is eligible for promotion.
- Sol inspected all v1/v2 scene-extraction candidates and all v3 primary/alternate
  clean-source candidates at native resolution. The former visibly retain
  background slabs, while the latter visibly contain the wrong/multiple
  objects. Sol therefore accepted the provenance package but rejected every
  Cortan PNG for runtime promotion. Milestone 4 will use the exact existing
  bitmap fixtures where available and new Examination-only code-native pixel
  sprites for the three missing accessories.
- Milestone 4 replaces the active v2 shell path with the existing composable
  north-up surgery-center envelope, so the examination floor no longer uses a
  sparse fixed shell bitmap. The v3 presentation separately authors the 3x2
  and 2x3 fixture hierarchy and keeps it upright rather than rotating it.
- The Examination v1 atlas's existing measured sink, table, stool, diagnostic,
  glove, and anatomy-chart crops remain independent bitmap fixtures. New v3
  code-native curtain, physician scale, and paper-towel fixture IDs are
  examination-only; no Cortan candidate was promoted.
- The existing boundary-aware architecture path produces continuous wall runs
  by default; explicit doors remain a separate live renderer. Examination's
  prior v2 full-shell renderer is now inactive for rollback compatibility.
- Sol review identified that the shared generic shell still treated room
  adjacency as an Examination south-wall hole and emitted an oversized opaque
  foreground slab. Milestone 4 now uses an Examination-only v3 envelope whose
  complete logical four-wall runs are subtracted only by live door records for
  that room/side/offset; adjacency is intentionally not an input.
- The v3 south wall is rendered as a shallow dark foreground lip at the same
  sortable baseline contract as fixtures. Its per-door runs preserve a placed
  aperture, sort above in-room contacts, and leave exterior/south contacts
  naturally in front. Native review of horizontal, vertical, partial-adjacency,
  build-candidate, and persisted explicit-door captures found no gray slab or
  unintended shared-boundary aperture.
- Proof correction: default capture setup now removes every Examination-owned
  serialized door and retains only the founder-room entrance. Hydration asserts
  zero Examination doors for horizontal, vertical, and partial-adjacency
  captures; the explicit case inserts and asserts exactly
  `door.visual.examination.south` at south offset 1. Its Playwright test also
  hashes the live `facility-canvas` pixels for no-door and explicit-door states
  and asserts inequality, avoiding HUD-driven whole-page evidence. The latest
  whole-page SHA-256 values are `CADD8D03FE95186E3DB58AC89708659F248CA07E04784877A30F786C7B0E936E`
  (horizontal no-door) and
  `746C4CB91377BD6215391F8DDEC654D659F332DC7B8EA773AAEC534838B60B6E`
  (explicit-door capture).
- Sol's final native-resolution review confirmed that the horizontal and
  vertical no-door Examination captures have continuous front walls, the
  partial-adjacency capture stays closed without the rejected gray slab, and
  only the persisted explicit-door capture has the centered one-slot
  aperture. The sink/supply cluster, diagnostic tools, anatomy chart, east
  exam-table/curtain zone, stool, scale, bin, dark rectangular envelope, and
  warm open floor retain the reference hierarchy in both north-up footprints.
- Final integrated validation was independently rerun by Sol: Examination
  focused Vitest passed **5 files / 35 tests**; Front Desk focused Vitest
  passed **6 files / 47 tests**; player typecheck and production build passed
  (only the existing chunk-size advisory); Examination desktop E2E passed
  **4 tests**; Front Desk desktop E2E passed **1 test**; and
  `git diff --check` passed. Sol also re-inspected the refreshed Front Desk
  close, occupied, vacant, and exterior captures and confirmed front-wall
  occlusion, the left-facing chair, room-abutting one-tile sidewalk, rear-band
  planters, and continuous lower pedestrian lane.

## Exact next action

Implementation and integrated validation are complete. The owner should review
the refreshed Front Desk and Examination v3 captures in game and provide only
concrete graphics adjustments in this thread. Preserve the door-only wall-run
contracts and rejected Cortan provenance; do not promote any Cortan candidate,
change gameplay/system behavior, or commit/push/deploy without explicit owner
direction.
