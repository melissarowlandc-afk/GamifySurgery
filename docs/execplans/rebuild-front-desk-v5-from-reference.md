# Rebuild Front Desk v5 from the Detailed Reference

## Goal

Replace the active Front Desk room presentation wholesale so the live map
matches the approved ignored local room-reference image
as closely as possible. The only deliberate architectural transformation is a
clean rectangular outer footprint. Retain the flower beds the owner liked,
the exact logical five-by-four room, and all existing gameplay behavior.

## Requirements

- Treat `exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png` as the sole authority
  for the room's viewpoint, material language, floor perspective, wall mass,
  openings, furniture identity, scale, asymmetry, and negative space.
- Do not reuse the active v4 empty shell as the visual basis. It comes from a
  different source image and the owner has explicitly rejected the result.
- Replace the active architecture with a new Front Desk v5 composition built
  from the existing transparent v3 architecture components and v2 fixture
  sprites that already match the target's visual family. Direct-reference
  editing on Cortan was attempted first, but the installed SDXL base workflow
  could not reconstruct the masked tiled floor without flat gray fill. Keep v4
  files intact but inactive as a recoverable rollback; do not physically delete
  them.
- Keep the room logically five spaces wide by four spaces tall, fixed above the
  center of the sidewalk, with the south public entrance centered.
- Preserve the target's wide, shallow dollhouse perspective instead of forcing
  its source floor into v4's taller visual proportions. Use target-measured
  presentation geometry while keeping semantic grid coordinates authoritative.
- Preserve the target's heavy charcoal/stone outer frame, layered baseboards,
  deep side returns, inset cream rear wall, pale tiled floor, centered north
  opening, centered south threshold, and integrated contact shadows.
- Match the target composition almost exactly with independent elements:
  filing cabinet/plant at rear-left; noticeboard and clock left of the north
  opening; large reception counter left of center; secretary chair and worker
  behind it; public patient on its front/right side; cooler and bin rear-right;
  and one visitor chair in the southeast.
- The new owner direction supersedes the prior no-visitor-chair decision. Keep
  the chair inset enough that a real east-wall door candidate remains clear.
- Keep live founders, staff, patients, doors, and the interactive water cooler
  out of the architecture bitmap. Static fixtures must remain separately
  measurable/renderable so actor depth and future door cuts still work.
- Preserve the accepted declarative exterior flower beds and the unobstructed
  one-tile south walk exactly as the current rejected-room checkpoint renders
  them.
- Preserve at least one usable, furniture-free integer door candidate on every
  wall. The target's north and south openings should be visually obvious; east
  and west candidate spans must remain clear without cyan debug overlays.
- Keep direct-reference review candidates under
  the ignored local owner-review asset workspace as an audit trail. Reuse the accepted,
  already-versioned transparent v2/v3 atlases in place rather than copying or
  mutating them into a misleading generated-v5 bitmap.

## Image-generation execution contract

- Use case: `precise-object-edit` for the v5 shell, followed by
  `background-extraction` only if alpha cleanup is required.
- Image 1 is both the edit target and strict composition/style authority:
  the approved ignored local room-reference image.
- The owner's current message gives fresh, task-specific authorization to send
  that one cited reference PNG to Cortan over the existing Tailscale HTTPS
  connection. Do not upload any other private project file without separate
  need and authority.
- Perform reference-guided img2img/inpainting on Cortan, not text-only
  generation and not Codex's native image generator. This attempt is complete:
  broad, corrected, and localized inpainting all failed the shell acceptance
  bar and must not be used in runtime.
- Preserve the target viewpoint, palette, pixels, wall/floor texture, openings,
  and proportions. Change only the clipped/stepped outer corners into straight
  rectangular walls and remove all people/furniture/decor from the shell layer
  so those remain independent.
- No new ComfyUI nodes, models, or software may be installed. Use the existing
  SDXL/core inpaint or img2img and BiRefNet capabilities.
- Version every candidate. Never overwrite v4 or user reference files.
- Sol must inspect candidates at native resolution before any runtime switch.
  All attempted workflows were rejected; no generated candidate is authorized
  for runtime. The deterministic v2/v3 recovery path is now the active
  implementation decision.

## Constraints and non-goals

- Graphics-only Front Desk work. Do not change gameplay, economy, progression,
  clinical content, routing, collision, saves, domain room size, room placement,
  or any other room.
- Do not change global camera defaults, global tile size, other room wall
  contracts, or character identities to make the comparison easier.
- Do not flatten people, doors, interactive cooler, or the whole furnished
  screenshot into one runtime texture.
- Do not remove the accepted planters or put any art in the central public walk.
- Do not use the two prior text-only Cortan candidates as runtime inputs; both
  were rejected for geometry and fidelity.
- Preserve unrelated and concurrent work. The current tree is intentionally
  dirty with the previous Front Desk checkpoint and the user's untracked
  ignored local owner-review asset workspace. Never reset, clean, broad-checkout, or broadly
  stage it.

## Relevant repository state

- The active `front-desk-v4/front-desk-shell-v4.png` is the separate empty
  `exec-7fb...` source, not a rectangularized form of `exec-019...`.
- The target's visible floor is approximately 914 by 560 source pixels
  (about 1.63 wide-to-deep); v4's measured floor is 832 by 622 (about 1.34).
  This architectural mismatch makes the live room read tall and narrow.
- `FacilityScene.ts` currently maps v4's floor directly to the semantic 5-by-4
  rectangle using separate X/Y scale factors and mounts v2 decor on v4 source
  coordinates.
- The v1/v2 Front Desk fixture art shares the target's object identities and
  can be reused selectively, but current normalized placement centers the
  counter and compresses the target's right-side public aisle.
- The current checkpoint already contains accepted exterior planter geometry,
  four-wall door-candidate tests, and an actual-app close capture. Preserve and
  adapt those changes rather than reverting them.
- Existing v4 and older shells remain valuable rollback/source records but must
  no longer be selected by the live Front Desk path after v5 acceptance.

## Decisions already made

- The owner's rejection is authoritative. The prior plan's room acceptance is
  superseded; only its flower-bed work remains accepted.
- Use a new v5 rendering path and switch the active renderer; do not mutate or
  overwrite v4. The renderer may reference existing immutable v2/v3 atlas
  frames directly rather than inventing a redundant bitmap file.
- Direct-reference Cortan editing was required as the first attempt. It proved
  that the source can be preserved, but the installed base model cannot replace
  masked furniture with coherent tile/wall pixels. Repeating that failure is no
  longer a prerequisite for implementation.
- The actor-free companion mockup
  `exec-da0396c3-a164-4d01-838d-d3fef8e8fb9a.png` confirms the intended target
  composition but is not a runtime source: its cyan door overlays, label, and
  non-identical pixels must not enter the game.
- The transparent v3 architecture atlas supplies the target-family blank floor,
  thick wall faces, side returns, two front-wall halves, threshold, and contact
  shadows. The transparent v2 fixture atlas supplies the matching cabinet,
  counter, work chair, cooler/bin, noticeboard, and clock. Assemble those at
  target-measured geometry instead of using v4's full-shell projection.
- Use target-measured visual geometry and a Front Desk-only presentation
  projection where needed. Logical grid coordinates, door legality, routing,
  and saves remain unchanged.
- Reintroduce the southeast visitor chair as a separate fixture while keeping
  a clear east-wall slot.
- Retain independent fixture/actor/depth layers even though a single flattened
  reference would be easier; runtime behavior and visual occlusion must remain
  correct.

## Milestones

1. Upload only the cited target to Cortan and attempt a native-resolution v5
   rectangular blank-shell candidate through masked reference editing. Save the
   candidates and reproducible workflow/settings under `Codex Rooms 2`; make no
   runtime changes. Sol rejects any candidate that fails at native resolution.
   This milestone is complete with three rejected approaches and no runtime art.
2. Implement a new v5 architecture renderer from the existing transparent v3
   pieces: a wide/shallow rectangular floor, target-weight north wall/opening,
   deep side returns, two front-wall halves, centered south threshold, and
   target contact shadows. Replace the active v4 architecture path without
   altering other rooms or copying/mutating the source atlases.
3. Rebuild the independent target composition around v5: measured wall decor,
   left-offset counter/worker, public-side patient presentation, rear-left
   cabinet, rear-right cooler/bin, restored southeast chair, and four clear wall
   spans. Preserve planters and all domain anchors/interaction behavior.
4. Extend focused tests, run the actual app at normal and close player zoom,
   compare side-by-side with `exec-019...`, and iterate until Sol can honestly
   call the room a near match rather than a minor adjustment.
5. Update both ExecPlans and the shared graphics handoff with the owner's final
   review state, exact validation, and next graphics-only action.

## File or module ownership

- Milestone 1 Terra owns deliberate candidate/workflow outputs inside
  the ignored local owner-review asset workspace and this plan's progress notes only.
- Milestone 2 Terra owns a focused Front Desk v5 architecture-layout module and
  tests if useful, required imports/helpers, and only the Front Desk
  architecture branch of `FacilityScene.ts`. Existing v2/v3 atlas files and
  frame definitions are read-only inputs; no new bitmap is required.
- Milestone 3 Terra owns `frontDeskPresentation.ts`, its focused test, Front
  Desk-only fixture/actor presentation portions of `FacilityScene.ts`, and
  presentation-only door-zone adjustment/tests if the restored chair requires
  one. No domain files.
- Milestone 4 Terra owns `tests/e2e/front-desk-visual.spec.ts` and its Front Desk
  screenshots. Sol owns native-resolution art acceptance, actual diff review,
  conflict resolution, tiny integration corrections, and final acceptance.

## Acceptance criteria

- A side-by-side view immediately reads as the same room as `exec-019...`, not
  the prior v4 room with rearranged props.
- The live shell is a clean rectangle but retains the target's thick dark wall
  mass, cream inset wall, shallow wide floor, north opening, south threshold,
  materials, and shadows.
- The room remains exactly five by four logically and centered above the
  sidewalk; no save or navigation behavior changes.
- The counter is visibly large and left-of-center; the target's broad public
  aisle occupies the center/right; the visitor chair returns in the southeast.
- Cabinet/plant, board/clock, cooler/bin, worker, and patient match target scale
  and placement closely at both normal and close player zoom.
- People, doors, cooler interaction, and depth occlusion remain live and
  independent. No baked duplicates appear.
- The accepted exterior flower beds remain visible and the center walk remains
  completely clear.
- At least one tested integer door candidate remains on north, east, south, and
  west walls, and furniture does not visibly consume those spans.
- No other room or non-graphics behavior changes.

## Validation

- Focused bitmap-manifest/v5 source-geometry tests.
- `npm.cmd run test --workspace @gamify-surgery/player -- src/facility/frontDeskPresentation.test.ts src/facility/roomVisualLayout.test.ts`
- Any new Front Desk-only projection/depth tests.
- `npm.cmd run typecheck --workspace @gamify-surgery/player`
- `npm.cmd run build --workspace @gamify-surgery/player`
- `npm.cmd run test:e2e -- tests/e2e/front-desk-visual.spec.ts --project=desktop-chrome`
- `git diff --check`
- Sol inspects the target, candidate shell, normal actual-app proof, and close
  actual-app proof side-by-side at native resolution.

## Progress

- [x] Record the owner's rejection and preserve the liked planter work.
- [x] Read the image-generation skill, repository instructions, prior plans,
  handoff, dirty tree, target, active shell, fixture sources, and live proof.
- [x] Complete a delegated read-only Terra v5 visual decomposition.
- [x] Complete Milestone 1 through Terra; Sol rejected all native-resolution
  outputs and confirmed runtime remained untouched.
- [x] Complete a delegated read-only Terra recovery-source audit.
- [x] Complete Milestone 2 through Terra: a component-based v5 renderer now
  selects immutable v3 architecture frames instead of the v4 shell, with a
  focused projection module/test. Sol reviewed the actual code and successive
  real-player proofs through Milestone 4.
- [x] Complete Milestone 3 through Terra and review composition/door evidence.
- [x] Complete Milestone 4 through Terra: Front Desk-only projection, actor,
  chair-frame, and boundary-renderer tuning now has focused and actual-player
  proof. Sol still owns native art review and owner acceptance.
- [x] Update the shared handoff.

## Discoveries

- The prior plan incorrectly treated v4 as the requested rectangular adaptation.
  It is a separate empty-room design with materially different proportions.
- The target's fixture source art already exists in related atlases, so the
  central visual gap is architecture/projection and target-measured placement,
  not a need to invent unrelated furniture.
- The target composition is intentionally asymmetric: the desk is left of
  center and the public aisle/visitor chair occupy the right. Centering the desk
  destroyed its identity even though the object sprites were similar.
- The current message supplies the explicit authority previously missing for
  sending the cited target reference to Cortan. This milestone must use that
  direct reference rather than another text-only approximation.
- No clean pixel-identical same-room shell exists in the repository. The only
  actor-free companion mockup has cyan overlays and non-identical generated
  pixels, so it is evidence rather than a source layer.
- The v3 transparent architecture atlas and v2 transparent fixture atlas are
  already the closest deterministic reconstruction sources. Crucially, v3's
  floor plate is wide/shallow (950 by 545 source pixels) and carries the heavy
  charcoal material language that active v4 lacks.
- Cortan exposes the core `VAEEncodeForInpaint`, `VAEEncode`,
  `SetLatentNoiseMask`, `ImageCompositeMasked`, `ImageCrop`, and BiRefNet
  nodes, with `sd_xl_base_1.0.safetensors` available. No nodes, models, or
  software were installed.
- The first workflow (`fe87ff4f-72a8-4370-a918-338cc38b7e9a`) used the broad
  v1 mask with `VAEEncodeForInpaint`; it generated a mostly flat gray fill,
  so it is rejected. Its raw 1254x1254 RGB output remains only as an auditable
  failed review artifact.
- A native mask audit found the v1 mask over-broad. The corrected v2 mask
  makes white denote only fixtures/actors/decor and limited clipped-corner
  rectification zones, while black protects the target floor, walls, and
  openings. The planned noise-mask v2 follow-up was cancelled before review.
- The corrected workflow (`8c3de9b5-200f-4a81-858a-4069f486d53a`) used core
  `VAEEncode` plus `SetLatentNoiseMask` and source compositing. It preserved
  the target architecture but also retained the removed fixtures and people,
  so it is rejected. Its raw output is 1254x1254 `Format24bppRgb` with sampled
  alpha `255,255,255,255,255`; it is not transparent and cannot be designated
  `best-review-candidate`.
- Recovery pass A used a localized white-only central mask and the requested
  strong-denoise core `VAEEncodeForInpaint` configuration. Cortan prompt
  `8c77181d-f40e-4153-8461-3b5194733fb5` used SDXL base, seed `99277235`,
  `dpmpp_2m_sde`/`karras`, 32 steps, CFG `5.0`, denoise `0.74`, and source
  compositing to protect unmasked pixels. Native inspection showed the masked
  region as a flat gray block rather than reconstructed ceramic tile. It is
  rejected and was kept only in the local temporary inspection location; no
  misleading candidate-03 was saved.
- Milestone 2 keeps the logical Front Desk rectangle at five by four but maps
  only its display floor to the reference-derived 1.63:1 aspect ratio, anchored
  to the existing centered south entrance. `frontDeskV5Architecture.ts` makes
  this projection and its component bounds reusable for the composition pass.
- The active Front Desk architecture branch now assembles v3 floor, split rear
  wall panels, straight side returns, split low front wall, and threshold. The
  base is behind live fixtures/actors; only the low south pieces repeat at the
  established foreground depth. v4 declarations and methods remain untouched
  as rollback sources but are no longer the active Front Desk choice.
- Sol ran the actual-player Front Desk E2E after Milestone 2 and inspected the
  normal, occupied, vacant, and 130% close captures. The v5 architecture is
  visibly a new component assembly with no doubled v4 shell, but the old
  fixture, cooler, and actor coordinates do not use the v5 projection and make
  the intermediate room read cramped and vertically incoherent. Architecture
  acceptance is therefore limited to its code foundation; visual acceptance
  requires Milestone 3 remapping and another real-player review.
- Milestone 3 remaps every Front Desk-specific live contact through
  `getFrontDeskV5Projection`: the cabinet/plant is rear-left, counter and
  seated worker are left-of-center, the patient occupies the public-right
  side, the cooler/bin are rear-right, and an independent visitor chair is
  restored southeast. The mounted noticeboard/clock now use the v2 atlas on
  the v5 rear wall rather than the inactive v4-only decor branch. Matching
  v3 cabinet/counter/cooler shadows render behind their live fixtures.
- Actual-player captures after Milestone 3 show the requested asymmetric
  composition and clear central south walk with the accepted planters still
  intact. At ordinary map zoom the assembled v5 room remains compact compared
  with the full-resolution reference; this is an honest Milestone 4/Sol art
  acceptance question, not a reason to alter global camera or logical tiles.
- Sol's native side-by-side review found three concrete Milestone 4 gaps. The
  current 1.63 display-floor constant makes the assembled component interior
  slightly too squat once its transparent frame margins are considered; the
  stationary founder/patient art is materially larger relative to the room
  than the target actors; and a Front Desk with a shared north/south boundary
  can select the legacy boundary-aware shell while its fixtures still use the
  v5 projection. The right-side visitor chair also needs its target-facing
  authored orientation confirmed rather than accepting the generic first
  waiting-room chair frame.
- Milestone 4 changes the Front Desk-only display floor aspect to 1.53:1 so
  the v3 plate's transparent perimeter no longer makes the assembled interior
  read too squat. The centered south entrance and the protected five-by-four
  logical bounds remain unchanged.
- Stationary v5 staff/public poses now carry display scale `0.82`; authored
  bitmap sizing, procedural fallback sizing, and the procedural cache
  signature all consume it. Moving actors and every non-Front-Desk pose retain
  the canonical scale of `1`.
- The existing `waiting-fixtures-v1.png` contains two isolated chair
  components. Its right-facing chair has exact alpha bounds
  `x=864, y=677, width=229, height=267`; a Front Desk-only immutable frame
  override selects it while the ordinary Waiting Room keeps its original
  left-facing frame.
- Front Desk v5 no longer falls through to the boundary-aware legacy renderer
  when a north/south neighbor shares a designed opening. A pure selection test
  proves that v5 remains active in both isolated and connected cases; existing
  `roomCutaway` boundary tests remain green for other-room behavior.
- Terra refreshed normal, occupied, vacant, and 130% actual-app captures and
  inspected them at native resolution. The target-like left-heavy composition,
  right-facing southeast chair, planters, centered clear south walk, and
  reduced stationary actors are all visible. The runtime necessarily remains
  smaller and more pixel-stylized than the high-resolution reference; Sol must
  decide whether that remaining style/scale gap clears the owner's near-match
  bar.

### Milestone 1 reproducibility record

- Authorized private input uploaded to Cortan: only
  `exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png`, as
  `front-desk-v5-reference-target.png`. The additional uploaded mask was a
  deterministic derived edit mask produced in the owned output folder, not an
  additional project reference.
- Corrected workflow file:
  the ignored local owner-review asset workspace.
  It scales 1254 to 1256 with nearest-exact for SDXL divisibility, crops from
  `(1,1)` back to 1254x1254, uses the v2 corrected red-channel mask,
  `sd_xl_base_1.0.safetensors`, seed `782419537`, `dpmpp_2m_sde`, `karras`,
  30 steps, CFG `4.5`, and denoise `0.34`.
- Exact positive and negative prompts are preserved verbatim in that workflow
  JSON. Its targeted request is to reconstruct only masked regions, remove
  every listed fixture/person, rectify only clipped corners, and preserve all
  unmasked target pixels exactly; the negative prompt excludes people,
  furniture, sidewalk, planters, text, watermarks, and gray filler.
- Candidate files, source masks, and both reproducible workflow JSON files
  are all confined to the ignored local owner-review asset workspace. No runtime or
  reference file was edited.
- The localized recovery workflow and its zone-A mask are also saved under
  the ignored local owner-review asset workspace for reproducibility. It does not provide
  usable output with the existing SDXL base inpaint path.

## Exact next action

Owner visual review of the refreshed occupied, vacant, and 130% Front Desk
proofs against `exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png`. If the owner
identifies a remaining mismatch, continue only with that concrete Front
Desk-graphics adjustment. Do not alter global camera, tile geometry, logical
room state, or any other room.
