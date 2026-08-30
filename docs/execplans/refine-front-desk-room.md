# Refine the Front Desk Room

## Goal

Refine only the live Front Desk room so it matches the proportions and composition of `Photos for Codex/exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png`, with the front-right visitor chair removed. The founder should visibly sit behind the desk when stationed there, while a checked-in patient stands on the public side of the desk.

## Requirements

- Preserve the approved room art language, palette, map composition, fixture asset system, room footprint, door system, routing, and saves.
- Keep the room interactive: walls, doors, furniture, people, and water cooler remain separate objects rather than a flattened room screenshot.
- Remove the front-right visitor chair from the Front Desk room only.
- Bring the live fixture composition closer to the reference: a centered reception counter, work chair behind it, filing/storage and plant details toward the rear-left, wall board and clock on the north wall, and cooler/waste area toward the rear-right when the existing interaction model safely permits it.
- When the founder is stationary on the Front Desk staff anchor, render the founder in the authored seated pose. Movement or a persisted active task must override the seated pose.
- Preserve the current Front Desk navigation contract: founder/staff behind the desk, patient in front of the desk, and all existing door-clear zones.
- Preserve a chairless edited reference image in the ignored local `generated_images` owner-review workspace.

## Constraints and non-goals

- Do not redesign any other room, character identity, HUD, clinical content, balance, progression, or facility mechanics.
- Do not change check-in timing or add a new simulation state merely to show the seated pose.
- Do not alter the room footprint, blocked tiles, staff/public anchors, or door legality.
- Do not use the supplied/generated room mockup as a flattened live-game background.
- Preserve all unrelated work in the heavily dirty working tree. Do not reset, revert, clean, commit, push, deploy, or publish.

## Relevant repository state

- The exact reference is available at `Photos for Codex/exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png`.
- A precise chairless edit has been generated and retained in the local ignored owner-review workspace.
- `FacilityScene.ts` currently places a Front Desk visitor chair at `(0.84, 0.48)` and uses a composition that differs from the reference.
- The Front Desk is a fixed-orientation 5-by-4 room. Its three blocked desk tiles, public anchor `(2,3)`, waiting anchors `(1,3)` and `(3,3)`, and staff anchor `(2,1)` already express the desired behind-desk/public-side relationship.
- The water cooler is a separate interactive object. Its view model and domain path target currently resolve to the same Front Desk-relative tile and must remain synchronized if its location changes.
- The shared character system already contains a `seated` pose; the founder renderer currently selects only idle, walking, or interaction poses.

## Decisions already made

- The reference composition is accepted except for the front-right visitor chair.
- The front-right visitor chair is removed entirely rather than relocated.
- The founder uses the existing authored seated pose at the Front Desk staff anchor; this is a presentation rule, not a new gameplay action.
- A patient remains standing at the existing public/check-in anchor.
- Existing navigation and door metadata remain authoritative even where the visual composition is tuned.

## Milestones

1. Preserve the chairless approved visual target in the ignored local `generated_images` owner-review workspace.
2. Refine only the live Front Desk fixture placement and north-wall details using separate interactive assets.
3. Add a narrow founder-at-front-desk seated-pose rule without changing domain timing or routing.
4. Add focused regression coverage and render an actual-app proof screenshot.
5. Review the diff and visual proof, then run focused and repository-level validation proportional to the change.

## File or module ownership

- Terra owns the bounded implementation in `apps/player/src/facility/FacilityScene.ts`, any narrowly required presentation helper/test under `apps/player/src/facility/`, the chairless review image under ignored local `generated_images/front-desk-room-v2/`, and this plan's Progress/Discoveries/Exact next action sections.
- Terra may adjust the shared water-cooler location in both `packages/game-domain/src/reducer.ts` and `apps/player/src/session/viewModels.ts` only if required to reproduce the approved rear-right composition, and must update focused tests in the same milestone.
- Terra may update one focused Playwright capture/spec only as needed to prove the live room composition.
- Sol owns requirements interpretation, reference comparison, diff review, validation review, and final acceptance.

## Acceptance criteria

- The live Front Desk contains no front-right visitor chair.
- The desk, work chair, storage/plant, wall board/clock, and cooler area visibly follow the accepted reference proportions and composition as closely as the interactive 5-by-4 room permits.
- The founder appears seated behind the desk while stationary at the Front Desk staff anchor and uses normal movement/task poses elsewhere.
- A checked-in patient appears standing on the public side of the desk; no patient-only seating rule is accidentally applied there.
- Doors, door candidates, click targets, water-cooler interaction, character routing, save compatibility, and other rooms remain unchanged and functional.
- The runtime uses separate fixture and character objects, not the mockup as a background.
- An actual-app screenshot demonstrates the refined Front Desk at a useful zoom.

## Validation

- Focused Front Desk fixture/presentation tests.
- Focused water-cooler/path tests only if its domain location changes.
- Relevant player unit tests.
- `npm run typecheck`.
- `npm run build` or the repository's current equivalent.
- Focused Playwright screenshot of the live Front Desk.
- `git diff --check` for the owned files.

## Progress

- [x] Inspected the exact supplied reference and current live room composition.
- [x] Generated a precise chairless visual target while preserving the accepted reference design.
- [x] Confirmed that current navigation anchors already support founder-behind/patient-in-front behavior.
- [x] Preserved the chairless target under ignored local `generated_images/front-desk-room-v2/`.
- [x] Implemented the live Front Desk visual refinement.
- [x] Implemented and tested the seated-founder presentation rule.
- [x] Captured and inspected the actual live room.
- [x] Completed validation and Sol review.

## Discoveries

- The current Front Desk visitor chair is a discrete `visitorChair` placement and can be removed without changing the Waiting Room's chair assets.
- The current water cooler is already a distinct interactive object, but its view-model and domain route destination are duplicated calculations; they must remain identical if repositioned.
- The room's staff/public anchors already align with the desired conversation composition, so no route or save migration is needed merely to seat the founder visually.
- The interactive water-cooler target was safely moved from the rear-left to the rear-right navigable tile. The domain path target and player view model now derive the same rotated-front-desk footprint location.
- The live capture is intentionally zoomed to 180% and confirms the room is still assembled from independent room, wall, fixture, door, and character elements rather than the review PNG.
- Sol independently inspected the bounded implementation and live capture, then reran the focused player and domain tests, workspace production build, and desktop Playwright proof successfully.

## Exact next action

Await owner visual review of `artifacts/screenshots/front-desk-refined-live.png`; make no further room-art changes until new feedback is provided.
