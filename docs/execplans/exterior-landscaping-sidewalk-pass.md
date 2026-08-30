# Exterior landscaping and sidewalk pass

## Goal

Rebuild the currently playable facility exterior around the approved Front Desk so it follows `Photos for Codex/exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png`: a visibly planted setback separates the building from a broad tiled sidewalk, and stable irregular trees, shrubs, and flowers occupy the full grass field without being clipped by rooms.

## Requirements

- Preserve the approved Front Desk v4 shell, furniture, characters, rooms, gameplay, routes, collision, build grid, camera controls, and logical map coordinates.
- Reserve enough rendered space below the facility grid for a planted grass setback and a readable full-width sidewalk. The building may not sit directly on the sidewalk.
- Keep the entrance bottom-center and provide one continuous clear path from its threshold through the setback to the sidewalk.
- Render a broad sidewalk using the reference's large rectangular/square slabs, joints, subtle surface variation, top seam, and lower curb/edge. It must fill the bottom of the map without blank space.
- Add stable deterministic landscaping across the entire visible/permitted grass field, not only in bands around current room bounds. Use varied tree, shrub, and flower assets at irregular positions, scales, and spacing; avoid vertical rows and obvious repeated patterns.
- Treat landscaping as independent presentation objects. A candidate is omitted whenever its complete visual envelope, including its contact shadow and a small breathing margin, intersects a constructed room, hallway, entrance path, or sidewalk. As construction expands, affected plants disappear cleanly on redraw; no plant may show as a fragment behind or through a building.
- Preserve unrelated candidates at stable positions when rooms are added, the page reloads, the viewport resizes, or the camera zooms/pans. Do not consume gameplay/simulation RNG.
- Add soft contact shadows below landscaping and a restrained directional/contact shadow around the building footprint. Shadows may not alter collision or clickable areas.
- Keep grass moderately light with varied fine texture resembling the reference, while retaining room/character contrast and crisp pixel rendering.
- Maintain normal-play hidden grid and Build Mode grid behavior.
- Update the visual source of truth and provide actual-app desktop proof at the established Front Desk viewport/zoom plus a Build Mode proof if needed to verify the grid remains separate.

## Constraints and non-goals

- Do not redesign the approved Front Desk or its objects.
- Do not add gameplay, balance, clinical content, progression, or build rules.
- Do not make plants player-buildable, clickable, persistent domain entities, or obstacles in this pass.
- Do not flatten the clinic and landscape into a screenshot background.
- Do not change the 10% minimum zoom, manual panning, phone support, or domain sidewalk row semantics.
- Reuse the existing original environment and landscaping atlases unless a narrowly necessary original exterior material is missing.
- Preserve all unrelated dirty-worktree changes.

## Relevant repository state

- `apps/player/src/facility/FacilityScene.ts` owns layout, turf, landscaping, sidewalk, exterior entrance, and scene depth.
- `calculateLayout` currently reserves only 20-36 pixels for the sidewalk and anchors the facility grid immediately above it.
- `drawClinicGroundDetails` currently derives a small fixed set of planting anchors from the current room bounds, so the full grass field is not populated and plants can move with clinic bounds.
- `drawExterior` adds a shallow frontage after layout and the authored sidewalk surface begins at the older layout sidewalk boundary.
- `apps/player/public/art/environment/clinic-landscaping-atlas-v1.png` already contains original trees, shrubs, flowers, a bench, and planter assets with contact-shadow pixels.
- `apps/player/public/art/environment/clinic-environment-atlas-v1.png` contains the original sidewalk material.
- `docs/features/visual-art-direction.md` already requires irregular landscaping, a full-width sidewalk, and no blank lower strip.

## Decisions already made

- Reference image `exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png` is authoritative for the exterior atmosphere and density, not for copying assets or facility layout.
- Landscaping is deterministic presentation data and disappears under later construction rather than becoming a domain/build object.
- Complete sprite-envelope exclusion is required; drawing plants underneath rooms and relying on occlusion is not acceptable.
- A planted setback and actual sidewalk must be separate visual regions.

## Milestones

1. Separate the facility-grid bottom, planted frontage, sidewalk, and lower curb in the layout contract without changing logical map state.
2. Replace room-bounds anchor bands with deterministic full-field landscaping candidates and full-envelope construction/path culling.
3. Refine grass, plant, building, and sidewalk shadows/materials using existing original atlases.
4. Add focused deterministic/culling/layout tests and actual-app visual proofs.
5. Run focused tests, typecheck, production build, Playwright, and diff checks for Sol review.

## File or module ownership

- `apps/player/src/facility/FacilityScene.ts` and narrowly extracted pure exterior helpers/tests.
- `apps/player/src/facility/defaultCamera.ts` or layout tests only if necessary to preserve the established camera contract.
- `apps/player/src/art/bitmapAssetManifest.ts` and its test only if an existing frame needs a narrowly scoped registration correction.
- `tests/e2e/front-desk-visual.spec.ts` or a focused exterior visual spec.
- `docs/features/visual-art-direction.md` and this ExecPlan.
- Actual-app screenshots under `artifacts/screenshots/`.

## Acceptance criteria

- A visible grass/planted setback separates the building from the sidewalk.
- The sidewalk resembles the reference's broad slab pavement and reaches the viewport bottom with no blank strip.
- Trees, shrubs, and flowers occupy the full grass expanse with visibly irregular spacing and variation.
- No landscaping artwork is clipped by or visible through any constructed room or hallway.
- Adding a room removes only intersecting landscaping candidates; unaffected candidates remain stable.
- The entrance route remains visually clear and functional.
- Plants and the building have coherent soft shadows.
- The approved room, objects, routes, camera, and gameplay remain unchanged.

## Validation

- Focused pure tests for deterministic candidate generation, full-envelope room/path culling, layout regions, and stable candidate keys.
- Existing camera, Front Desk, world-signature, room placement, routing, and spatial regressions.
- `npm.cmd run typecheck`.
- `npm.cmd run build`.
- Focused desktop Playwright actual-app capture.
- `git diff --check`.

## Progress

- [x] Inspect the exact owner reference and current exterior renderer.
- [x] Implement the exterior layout and landscaping contract through Terra.
- [x] Inspect actual-app proof and complete independent Sol validation.

## Discoveries

- The layout currently uses `sidewalkTop` as both the facility-grid bottom anchor and the authored pavement start; `drawExterior` then inserts a frontage band after that boundary. This conflation is why the building reads as sitting on the sidewalk.
- Current plants are positioned relative to changing room bounds instead of stable site coordinates.
- The existing landscaping atlas already contains the required visual asset vocabulary and intrinsic contact shadows; the principal problem is layout, density, stability, and culling.
- The permitted build site is substantially larger than the immediately visible
  Level 0 overview, so the stable candidate field must be density-based across
  the full site rather than capped to a small fixed total. Otherwise the
  visible Front Desk scene appears nearly bare even though the logical site has
  candidates elsewhere.
- The domain's exterior actors intentionally remain at logical `y === gridRows`.
  The planted setback is visual-only, so actor base-Y presentation eases across
  that final logical route segment and lands on the separately rendered
  sidewalk without changing routes, ticks, or persisted positions.

## Exact next action

Owner visual review of the actual-app exterior and sidewalk-actor proofs is the
next action; no further implementation is planned for this bounded pass.
