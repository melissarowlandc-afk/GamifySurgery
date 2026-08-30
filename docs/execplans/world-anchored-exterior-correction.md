# World-anchored exterior correction

## Goal

Correct the exterior defect shown in `Photos for Codex/Sidewalk planter positioning issue.PNG`: the sidewalk and planted band must belong to the bottom of the facility world, move and scale with the map during pan/zoom, never overlay a room, and use only compact entrance planting rather than a permanent full-width green stripe.

## Requirements

- Preserve the approved Front Desk, furniture, characters, landscaping vocabulary, room/build mechanics, routes, timers, and gameplay.
- Make the grass site, facility grid, entrance setback/path, sidewalk, and curb one world-coordinate composition derived from the same `originX`, `originY`, and `tileSize`.
- The sidewalk must live below the southern edge of the permitted world/site, not at a fixed viewport Y. Panning north/up must move the sidewalk and entrance planting out of view naturally; returning to the entrance restores them.
- The sidewalk must span the world/site width rather than being an independent full-screen overlay. Horizontal pan and zoom must transform it consistently with rooms, plants, and routes.
- Camera bounds and the initial bottom-center entrance view must include the world-coordinate sidewalk without allowing overscroll beyond the site. Preserve 10% minimum zoom and manual panning.
- Remove the full-width flat green planted stripe and repeated tuft row. Grass between the building/world edge and sidewalk must use the same continuous textured turf as the rest of the grounds.
- Add a small, attractive set of flower planters/flower beds embedded along the sidewalk's top edge around the entrance path only. They must move/scale with the world, remain clear of the path, and never become a long stripe.
- Preserve broad slab sidewalk materials, seams, and curb. No blank strip may appear beneath the world at the entrance-oriented default view.
- Keep deterministic full-site plants and full-envelope room/hallway/path culling. Landscaping must never be clipped by a building.
- Correct the opaque white gaps visible inside tree branches so the live grass texture shows through. Preserve the exact accepted tree silhouettes, atlas frame coordinates, pixel-art sharpness, and all non-white tree pixels. Do not generatively redraw or resynthesize the atlas; implement a deterministic renderer/texture cleanup seam that affects only unintended near-white tree-background pixels, not white/yellow/pink flowers or unrelated assets.
- Exterior actor presentation must still place logical sidewalk-row actors on the transformed world sidewalk and interpolate smoothly through the entrance path after pan/zoom.
- Update source-of-truth documentation and actual-app normal, panned, and sidewalk-actor proofs.

## Constraints and non-goals

- No gameplay, balance, clinical content, progression, room, or pathfinding changes.
- Do not make the sidewalk, grass, curb, or entrance planting fixed HUD/screen elements.
- Do not change the accepted Front Desk shell or object composition.
- Do not flatten the exterior into a screenshot.
- Do not add buildable landscaping or domain persistence for decorative plants.
- Preserve all unrelated dirty-worktree changes.

## Relevant repository state

- `FacilityScene.calculateLayout` currently computes `sidewalkTop`, `setbackTop`, and their heights from viewport height before `originY`, making them screen-anchored.
- `drawExterior` draws the sidewalk and setback from screen X=0 to `scale.width`, which causes the screenshot's fixed overlay across the room during pan.
- `drawContinuousTurf` and the authored sidewalk tile use the screen-anchored boundary.
- `getActorPresentationBaseY` correctly maps exterior actors to the current sidewalk boundary but must follow the corrected world-coordinate boundary.
- The landscaping atlas contains opaque near-white gaps in tree frames. A deterministic tree-only cleanup is required; flowers must retain their intended light petals.

## Decisions already made

- The new screenshot is definitive evidence of a world/screen coordinate bug.
- The full-width planted stripe is removed, not restyled.
- Entrance planting belongs in/along the top edge of the world sidewalk near the front walk.
- The image-editing skill was consulted. Because exact atlas coordinates and unchanged sprite identity are invariants, this correction uses deterministic repo-native texture handling rather than an AI-generated replacement bitmap.

## Milestones

1. Extract/test a pure world exterior layout transform including grid, grass setback, sidewalk, curb, camera bounds, and actor baseline.
2. Convert turf, sidewalk, curb, entrance path, and entrance planters to world coordinates and remove the green stripe/tuft row.
3. Add deterministic tree-only white-gap cleanup without affecting flowers or atlas geometry.
4. Add pan/zoom/culling/actor tests and actual-app normal plus deliberately panned proofs.
5. Run focused regressions, typecheck, build, Playwright, and diff checks for Sol review.

## File or module ownership

- Exterior/layout/render seams in `apps/player/src/facility/FacilityScene.ts`.
- Pure helpers/tests in `apps/player/src/facility/exterior*.ts`.
- Narrow bitmap adapter/manifest seams and tests only if required for tree cleanup.
- Focused E2E actual-app proof files and screenshots.
- `docs/features/visual-art-direction.md` and this ExecPlan.

## Acceptance criteria

- Panning the facility moves the sidewalk, curb, entrance path, and planters with the world; they can leave the viewport and never remain pinned over rooms.
- No full-width green stripe or repeated tuft row remains.
- The building never overlaps the sidewalk at the entrance-oriented default view.
- The sidewalk occupies the southern world edge and scales 1:1 with the site.
- Only compact flower planting decorates the sidewalk top near the entrance.
- Tree branch gaps show the same grass texture underneath; flower petals remain intact.
- Construction culling and exterior actor movement remain correct.
- The approved room and gameplay remain unchanged.

## Validation

- Pure layout tests for default anchoring, pan translation, zoom scaling, world bounds, and actor sidewalk alignment.
- Pure/tree-texture contract tests proving cleanup is tree-only and preserves atlas geometry.
- Existing exterior landscape/actor, camera, Front Desk, routing, ambient pedestrian, build/spatial, and persistence regressions.
- Actual-app screenshots at default entrance view and a deliberately panned view demonstrating that the sidewalk leaves its prior screen position.
- `npm.cmd run typecheck`.
- `npm.cmd run build`.
- Focused Playwright.
- `git diff --check`.

## Progress

- [x] Inspect the owner screenshot and trace the fixed overlay to screen-derived sidewalk/setback coordinates.
- [x] Implement and test a world-coordinate exterior transform for turf, setback, sidewalk, curb, entrance path, planters, and actor sidewalk baseline.
- [x] Convert the actual scene to use that transform, retaining deterministic full-envelope landscaping culling and a tree-only white-gap cleanup seam.
- [x] Add actual-app normal and deliberately north-panned proofs; the panned proof hashes differently from the default and shows the sidewalk leaving below the viewport.
- [x] Inspect actual-app proofs and complete independent Sol validation.

## Discoveries

- The previous exterior pass correctly separated the visual bands but retained the old screen-anchored layout contract, so panning exposed the band as an overlay.
- The full-width frontage fill is redundant once the grass field and sidewalk are part of one world transform.
- The entrance default sits at the southern camera clamp. A drag upward is
  therefore a no-op; proof must drag the world downward to reach the northern
  view and then restore it upward. The focused browser test asserts a
  different PNG digest to catch a clamped or screen-pinned regression.
- Room and hallway exclusions reuse the full visual-envelope culling helper;
  candidate keys are seeded from site coordinates, so adding a room only
  removes intersecting candidates and leaves unaffected placements stable.

## Exact next action

Owner playthrough review of the corrected world-anchored exterior; no further
implementation remains in this milestone.
