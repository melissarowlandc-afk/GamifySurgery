# Rebuild the Front Desk Architectural Shell from Scratch

## Goal

Replace the currently active Front Desk floor and wall composition with a new coherent architectural shell derived from the accepted mockup `exec-434683ef-00df-4eb0-9df1-d94df2a258ae`. Preserve the accepted independent furniture from `exec-b71d3677-6af2-4e87-86e5-a9d7d5792fda`, characters, navigation, and gameplay.

## Requirements

- Treat `Photos for Codex/Front desk room redesign.PNG` as the problem comparison and the ignored local `generated_images/front-desk-room-v3/front-desk-rebuild-target.png` owner-review image as the controlling visual reference; checked-in derived runtime art belongs under `apps/player/public/art/`.
- Remove the current procedural shell, authored-floor overlay, and Front Desk v3 component architecture from the active Front Desk render whenever the new shell is available. Do not blend old and new architecture.
- Use the newly generated empty shell retained in the ignored local owner-review workspace.
- Copy the selected source into a new versioned project-owned asset path. Preserve actual alpha transparency.
- Map the shell's exact five-column by four-row floor interior to the logical 5-by-4 Front Desk rectangle. The rear wall and outer frame extend north and sideways outside that floor mapping exactly as the mockup does.
- Keep the full-width deep rear wall, inset trim, thick charcoal perimeter, short side returns, low front wall segments, central entrance, entrance jambs, subdued tile grout, and unified directional shadows.
- Keep furniture, wall decorations, water cooler, bin, planters, doors, founder, staff, and patients as independent live objects.
- Retain the accepted v2 furniture art and exact A1/A5/B3/C3/D3 placement.
- Retain the occupied-versus-vacant single-chair behavior.
- Preserve correct depth: rear architecture is behind people and furniture; the front wall/jamb portion can occlude characters crossing the south boundary; explicit door art remains above the wall opening.
- Preserve build-mode placement, clickable objects, routing, saves, room dimensions, and the protected exterior entrance.
- Update the visual source-of-truth so this coherent shell, not stretched wall/floor components, controls the base look of future rooms. Future rooms may vary floor and furnishings while sharing this perspective and wall language.

## Constraints and non-goals

- Do not alter gameplay, balance, room footprint, collision, routes, character appearances, furniture designs, landscaping, UI, clinical content, or other rooms.
- Do not use a flattened furnished screenshot. The new bitmap contains architecture only.
- Do not delete prior versioned assets or unrelated dirty-worktree content.
- Do not commit, push, deploy, publish, install dependencies, or make destructive changes.

## Relevant repository state

- The active room renderer draws a generic base/floor/shell and then Front Desk v3 architecture components in `apps/player/src/facility/FacilityScene.ts`.
- `apps/player/src/art/bitmapAssetManifest.ts` registers the existing Front Desk v2 furniture and v3 architecture atlases.
- `apps/player/src/facility/frontDeskPresentation.ts` owns the fixed 5-by-4 composition and single-chair logic.
- `tests/e2e/front-desk-visual.spec.ts` produces the normal 1806-by-1014 visual proof.
- The worktree contains extensive unrelated user work and must be preserved.

## Decisions already made

- The current Front Desk shell is visually rejected and must not remain active beneath the replacement.
- The accepted furniture remains unchanged.
- One coherent room shell is preferred over independently stretched architecture fragments because perspective, framing, material continuity, and shadows must remain unified.
- The source shell has genuine RGBA transparency and exactly five floor columns by four floor rows.
- A foreground crop or duplicate frame from the same source may be used for south-wall occlusion without changing the shell's appearance.

## Milestones

1. Copy and register the new transparent architectural shell with measured floor bounds and any foreground-occluder frame metadata.
2. Replace the active Front Desk architecture path while keeping all furniture and interactive objects independent.
3. Add focused tests proving old architecture is bypassed, floor mapping remains 5-by-4, furniture mapping is unchanged, and one-chair logic remains intact.
4. Update the visual source-of-truth document.
5. Capture the actual app at the same normal viewport as the comparison screenshot and compare it with the mockup.
6. Run focused tests, typecheck, build, Playwright, and diff checks for Sol review.

## File or module ownership

- Terra owns the new project asset under `apps/player/public/art/rooms/`.
- Terra owns Front Desk-only changes in `apps/player/src/art/bitmapAssetManifest.ts`, its tests, `apps/player/src/facility/FacilityScene.ts`, focused presentation tests if needed, `tests/e2e/front-desk-visual.spec.ts`, and `docs/features/visual-art-direction.md`.
- Terra owns updating this plan's Progress, Discoveries, and Exact next action.
- Sol owns prompt/art selection, requirements interpretation, actual diff and screenshot review, and final acceptance.

## Acceptance criteria

- The live Front Desk room shell visibly matches the accepted mockup's viewpoint, proportions, finished wall depth, inset floor, smooth pixel lines, subdued texture, and integrated shadows.
- The prior thin/stretched room architecture is not visible underneath or around the replacement.
- The floor is exactly five columns by four rows and aligns with the logical 5-by-4 room.
- Furniture and people retain their accepted art, positions, interactions, and identities.
- Exactly one work chair is visible when occupied and one empty chair is visible when vacant.
- The central protected entrance, explicit doors, routes, object clicks, and save behavior remain functional.
- Other rooms are visually and functionally unchanged.
- An actual 1806-by-1014 normal-play screenshot demonstrates the replacement; a mockup alone is insufficient.

## Validation

- Focused manifest, Front Desk presentation, camera, world-signature, water-cooler, facility-management, door, and spatial tests.
- `npm.cmd run typecheck`.
- `npm.cmd run build`.
- `npx.cmd playwright test tests/e2e/front-desk-visual.spec.ts --project=desktop-chrome` or the repository-equivalent focused desktop target.
- Inspect the resulting live screenshot against both halves of `Photos for Codex/Front desk room redesign.PNG`.
- `git diff --check`.

## Progress

- [x] Inspected the owner comparison screenshot, accepted target, current v2 furniture sheet, current v3 architecture sheet, and active renderer seams.
- [x] Generated and inspected a new empty, coherent, transparent 5-by-4 architectural shell.
- [x] Integrate the shell into the live Front Desk renderer.
- [x] Add regression coverage and update the visual source-of-truth.
- [x] Capture and review the normal-play proof.
- [x] Complete independent Sol validation and owner handoff.

## Discoveries

- The rejected live room is not stale: it visibly uses current furniture, but the architecture is composed from separately scaled floor/wall fragments and the generic room shell.
- The accepted mockup's quality comes from one continuous cutaway volume: rear wall, side returns, outer frame, floor inset, entrance jambs, and cast shadows share a single perspective.
- The new shell is 1254 by 1254 RGBA with transparent exterior. Its internal floor is authored as exactly five columns by four rows.
- The measured floor interior is x=212..1043 and y=339..960 in the source.
  The live renderer maps only that rectangle to the logical 5-by-4 footprint;
  the deep rear wall, side returns, entrance jambs, and low south wall extend
  outside it as authored. The low south-wall/jamb crop is rendered once more
  in front of live actors for correct threshold occlusion.
- The active v4 branch bypasses generic Front Desk procedural floor/shadow,
  authored floor, upgrade finish, generic shell, and v3 architecture. The
  retained v2 furniture and wall decorations remain independent.
- The actual desktop proof is `artifacts/screenshots/front-desk-v4-shell-normal.png`;
  its controlled full-shell detail companion is
  `artifacts/screenshots/front-desk-v4-shell-detail.png`.
- Isolated Level 0 now starts at 110% rather than 140%. This leaves visible
  breathing room above the deep rear frame while retaining the full south
  entrance and sidewalk; expanded and later clinics remain at their existing
  100% default.
- The v2 noticeboard and clock remain independent sprites but now use measured
  v4 source-space anchors: noticeboard center `(480, 215)`, clock center
  `(680, 215)`. They therefore remain inside the shell's light rear-wall face
  at every isolated Level 0 camera scale rather than landing on its lower trim.

## Exact next action

Owner visual review of `artifacts/screenshots/front-desk-v4-shell-normal.png`.
Make no further room-style expansion until that review is received.
