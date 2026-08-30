# Rebuild the Front Desk Room from the Accepted Reference

## Goal

Replace the live Front Desk presentation rather than incrementally rearranging its current generic room shell. Rebuild only this room around the composition, proportions, detail, and atmosphere of `Photos for Codex/exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png`, while removing the lower/front-right visitor chair and preserving the interactive 5-by-4 facility model.

## Requirements

- Keep the logical Front Desk footprint exactly 5 by 4 tiles, fixed at orientation 0.
- Render a mostly rectangular room with a complete floor. Front-corner architectural recesses may hold exterior flower planters, but they must not remove logical floor tiles or change collision.
- A new campaign has exactly one automatic Front Desk door: the protected exterior entrance centered on the south/front wall.
- The north, east, and west walls have no automatic doorway or opening. Player-built explicit doors may later create valid openings using the existing Build Mode system.
- Keep north/east/west wall stretches visually continuous in the baseline isolated room. Do not bake the reference image's north opening into the room.
- Rebuild the Front Desk presentation as separate room shell, floor, wall, door, furniture, planter, cooler, waste-bin, decoration, and character layers. Never use a flattened room screenshot as the live background.
- Match the accepted reference composition: large light square floor tiles; detailed dark-trimmed walls; compact cabinet with plant/binders at rear-left; noticeboard and clock on the north wall; cooler and waste bin at rear-right; centered horizontal reception counter; one modest work chair directly behind the counter; one patient standing on the public side.
- Remove the lower/front-right visitor chair completely. Do not relocate or replace it.
- Remove the current Front Desk rug and any generic-room decoration that is absent from the accepted reference.
- Align the work chair, staff anchor, and counter so a seated founder or receptionist is centered behind the desk and the counter visibly conceals the seated character's lower body.
- Preserve the current public/check-in anchor so the patient stands directly in front of the counter and renders in front of it.
- A stationary founder at the Front Desk staff anchor uses the authored seated pose. A stationary receptionist assigned to and positioned at that same anchor also uses the authored seated pose. Movement or a real task overrides seating.
- Keep the interactive water cooler at the synchronized rear-right domain/view location.
- Preserve the approved art system, palette, map, saves, routing, buildable-door behavior, gameplay, and every other room.
- Preserve the new visual target in the ignored local `generated_images/front-desk-room-v3/` owner-review workspace.
- Refinement after owner review: retain the accepted v2 furniture, but replace the Front Desk floor, wall framing, and architectural shadow treatment so they match `front-desk-rebuild-target.png`. The floor must read as subtle finished clinic tile rather than a stretched or construction-grid-like texture. Walls must read as a coherent shallow cutaway frame with dark finished trim, baseboard, corner depth, and contact shadows.
- Render exactly one work chair at B3. Because the authored seated founder/receptionist pose already includes its chair, suppress the separate empty-chair fixture only while a character is seated at that anchor; restore the room chair when the anchor is vacant.

### Owner grid refinement (August 28)

- Treat the fixed 5-by-4 room as columns `1` through `5` west-to-east and rows `A` through `D` north-to-south.
- Put the filing cabinet wholly in `A1` and the interactive water cooler plus waste bin in `A5`.
- Put the staff chair and staff anchor in `B3`.
- Put the reception counter principally in `C3`. Its artwork may overlap visually into `C2` and `C4`, but those two tiles must remain traversable.
- The counter blocks only `C3`; the cabinet and cooler/bin block their occupied `A1` and `A5` tiles. `B3` remains reachable for the founder or receptionist.
- Preserve the patient/check-in position in `D3` and the waiting positions in `D2` and `D4`.
- Add a shallow landscaped setback between the building frontage and the main sidewalk, with planting along the frontage except for a clear centered walkway connecting the front entrance to the sidewalk. This is presentation-only and must not change the logical 5-by-4 floor, exterior-door identity, or persisted room position.

## Constraints and non-goals

- Do not change clinical content, balance, progression, check-in timing, staff capacity, patient behavior, room upgrade logic, or save schema.
- Preserve the staff anchor `(2,1)`, public anchor `(2,3)`, waiting anchors, door-clear zones, and room footprint. Update the Front Desk obstacle map only as expressly required by the owner grid refinement: `A1`, `A5`, and `C3` are occupied; `C2` and `C4` are traversable.
- Do not add automatic internal doors or migrate existing valid saves merely for this visual rebuild.
- Do not change other room shells, fixture layouts, floors, landscaping, or character identities.
- Do not infer collision or door validity from bitmap pixels; the domain remains authoritative.
- Preserve unrelated work in the heavily dirty worktree. Do not reset, revert, clean, commit, push, deploy, publish, install dependencies, or spawn subagents.

## Relevant repository state

- `packages/balance-config/src/prototype-balance.ts` already defines the protected Front Desk as fixed 5 by 4 with desk-blocked tiles `(1..3,2)`, staff anchor `(2,1)`, and public anchor `(2,3)`.
- `packages/game-domain/src/reducer.ts` already creates only `door.instance.front_entrance`, south offset 2, exterior true. The exterior door is protected from removal.
- The detailed counter, work chair, filing/storage, cooler, and waste-bin assets already exist as separate frames in `apps/player/public/art/rooms/level-1-v1/front-desk-fixtures-v1.png`.
- The approved architectural/floor/planter language already exists in the environment and landscaping atlases. It can be reused through new Front Desk-specific composition rather than shipping a flattened mockup.
- The current Front Desk fixture switch still represents the rejected incremental layout and includes a floor rug.
- The current founder seating helper covers only the founder. Receptionists still receive the generic working pose.
- The existing exterior renderer draws the central entrance and two planters, but the planters are near the entrance rather than anchored in the two front-corner recesses.
- The generated controlling rebuild target is retained in the local ignored owner-review workspace.

## Decisions already made

- The previous Front Desk refinement is superseded; this is a clean presentation rebuild.
- The accepted reference controls visual quality and composition, except that the front-right visitor chair is omitted and the north opening is closed.
- The generated rebuild target accurately captures the clarified rectangle, sole south entrance, corner flower recesses, desk/chair alignment, and character occlusion relationship.
- Existing high-detail independent fixture assets may be reused; the old generic layout and rug may not.
- The corner recesses are visual exterior architecture only. The logical room remains a full rectangle.
- Domain door initialization is already correct and should be protected by tests rather than rewritten.

## Milestones

1. Preserve the generated rebuild target in the ignored local `generated_images/front-desk-room-v3/` owner-review workspace.
2. Create a dedicated, declarative Front Desk presentation module that replaces the rejected generic fixture arrangement and exposes its layout invariants for tests.
3. Rebuild the Front Desk floor/shell/fixture/entrance-planter composition in the live Phaser scene using separate interactive layers.
4. Extend the seated-at-desk presentation rule to the receptionist while preserving movement and task overrides.
5. Add focused tests for the 5-by-4 layout, sole baseline exterior door, no visitor chair/rug, planter/counter alignment, founder/receptionist seating, and depth ordering.
6. Capture and inspect an isolated actual-app Level 0 Front Desk screenshot, plus a receptionist-at-desk proof if practical.
7. Run focused regressions, typecheck, production build, Playwright, and diff checks; Sol reviews the actual diff and screenshots before acceptance.

## File or module ownership

- Terra owns a new narrow Front Desk presentation module and tests under `apps/player/src/facility/`.
- Terra owns the Front Desk-only seams in `apps/player/src/facility/FacilityScene.ts`, the existing Front Desk seating helper/tests, and the focused Front Desk Playwright spec/captures.
- Terra may add only narrowly required render metadata to `apps/player/src/facility/types.ts` or view-model tests; it must not change domain gameplay.
- Terra owns the local owner-review copy of the generated target under ignored `generated_images/front-desk-room-v3/` and this plan's Progress/Discoveries/Exact next action sections.
- Sol owns art-direction judgment, requirements interpretation, actual diff/screenshot review, integration corrections, and final acceptance.

## Acceptance criteria

- The isolated live Front Desk reads as the generated rebuild target rather than the previous generic modular room.
- The room is visibly a complete 5-by-4 rectangular interior with large light tile, finished walls, and only one baseline opening at the centered south entrance.
- No north/east/west automatic door or baked opening appears in the baseline room.
- Two flower planters occupy exterior front-corner recesses without reducing room floor area or affecting routes.
- The old Front Desk floor rug and lower/front-right visitor chair are absent.
- Cabinet/plant, noticeboard/clock, cooler/bin, counter, chair, worker, and patient match the accepted composition.
- A seated founder and a seated receptionist both align directly behind the counter; the counter masks their lower body. The public-side patient remains visible in front of the counter.
- Player-built doors, water-cooler interaction, routing, saves, Build Mode, and all other rooms remain functional and unchanged.
- The runtime is still assembled from independent objects, not a full-room bitmap.
- The live room visibly and logically honors `A1` cabinet, `A5` cooler/bin, `B3` chair, `C3` counter, and `D3` public/check-in placement.
- Automated routing coverage proves that `C2` and `C4` remain traversable while `A1`, `A5`, and `C3` are occupied.
- A landscaped frontage separates the building from the main sidewalk, while the centered entrance walkway stays clear and patient/staff arrivals remain visually continuous.
- The ordinary full application at its relaunch/default Level 0 camera framing—not only an isolated 180% crop—visibly reads as the detailed rebuild target. The room, fixtures, and architectural depth must be legible in the exact kind of 100%-scale screenshot supplied as `Photos for Codex/No new front desk room.PNG`.
- The delivered proof must compare the same normal gameplay viewport against the owner screenshot. A developer-only close crop cannot substitute for that acceptance view.
- The floor and wall framing—not merely the furniture—visibly match the accepted target's material, depth, border proportions, and restrained shadowing at normal Level 0 framing.
- No doubled chair is visible behind the counter. The seated worker occupies the one visible chair; an empty chair remains present when nobody is seated there.

## Validation

- Unit tests for declarative Front Desk presentation data and seating rules.
- Domain/state assertion that a new campaign contains only the protected south exterior Front Desk door.
- Existing door/spatial and Front Desk water-cooler tests.
- Player facility tests and focused game-domain facility tests.
- `npm run typecheck`.
- `npm run build`.
- Focused desktop Playwright capture of the isolated live room; optionally a second receptionist proof.
- Visual comparison of the actual app with the generated target and original reference.
- `git diff --check` for owned files.

## Progress

- [x] Inspected the original reference, chairless edit, previous live room, fixture atlas, room shell, exterior entrance, door initialization, character depth, and seating seams.
- [x] Generated a clarified rebuild target with the full rectangle, closed north wall, one south entrance, corner planters, aligned chair/counter, and no visitor chair.
- [x] Confirmed that domain room dimensions, anchors, and initial door state are already correct and require no migration.
- [x] Preserve the generated target in the workspace.
- [x] Implement the dedicated Front Desk presentation rebuild.
- [x] Add receptionist seating and counter occlusion coverage.
- [x] Capture and inspect the isolated actual live room.
- [x] Complete Terra validation and independent Sol review.
- [x] Add a close 180% actual-app proof and correct authored-fixture scale envelopes.
- [x] Compare the close live render against the original reference and generated rebuild target.
- [x] Apply the owner's exact A1-D5 fixture and traversability refinement.
- [x] Add the shallow planted frontage setback and clear entrance walk.
- [x] Capture and inspect a new actual-app proof, then rerun focused regression checks.
- [x] Correct the nondeterministic browser proof and complete independent Sol acceptance.
- [x] Correct the owner-reported normal-view mismatch with a Front Desk v2 transparent component sheet.
- [x] Replace the relaunch-visible fixture, floor, wall, entrance, and planter treatment while preserving the semantic 5-by-4 room.
- [x] Capture and inspect a 1806-by-1014 normal gameplay proof before calling the correction complete.
- [x] Replace the rejected stretched floor and weak wall framing with target-matched layered architectural assets.
- [x] Correct the duplicate-chair presentation and prove occupied versus vacant chair states.
- [x] Capture a new normal-view proof focused on the wall/floor/shadow refinement.

## Discoveries

- The previous mismatch came primarily from retaining the generic room shell/rug and treating the task as fixture repositioning; the detailed object atlas itself is reusable.
- Initial door behavior is already exactly the newly clarified rule. Rewriting it would create unnecessary save and routing risk.
- The current counter baseline naturally sorts in front of the founder anchor and behind the public patient anchor, but the rebuilt layout must make that relationship explicit and regression-tested.
- Exterior flower recesses can remain visual-only and anchored to the protected entrance room, preserving the full logical rectangle.
- Before the owner grid refinement, the live water cooler was independently drawn at `(frontDesk.x + 4, frontDesk.y + 1)`. The refined presentation moves its physical/click location to A5 and keeps only the worker approach at B5.
- The controlled browser capture needs a briefly advanced campaign to provide a real serialized patient before it is reduced to one stationary Front Desk patient; it still loads through the normal persisted campaign migration and Phaser scene.
- `getFixturePresentationSize` is intentionally aspect-ratio preserving, so the original nominal counter/cabinet ratios were height-capped. The Front Desk's dedicated fixture envelopes now provide enough height for the counter to read at roughly 60% of room width and the integrated cabinet/cooler cluster to read at the intended reference scale.
- The authored filing-cabinet frame already includes its plant and binders. The separate plant placement was removed to prevent a duplicate.
- The Front Desk's physical water cooler now occupies A5 (`x + 4, y`), while the persisted refill route ends at adjacent B5 (`x + 4, y + 1`). This preserves the authoritative obstacle map and prevents a worker from walking into the cooler.
- The exact grid mask is now A1, A5, and C3 only. Focused pathfinding coverage verifies C2/C4 are open and D3 can reach B3 without entering C3.
- The landscaped setback is intentionally a renderer-only strip between the starter-room frontage and the existing sidewalk. Its centered paved walk is continuous with the protected south entrance and it does not change map tile/collision coordinates.
- The close 180% desktop capture shows the fully closed north/east/west shell, sole south entrance, A1 cabinet cluster, A5 cooler/bin, B3 seated founder behind the C3 counter, D3 public patient, no rug/visitor chair, exterior planters, and a planted frontage with central walk.
- The initial visual proof was nondeterministic because it resumed facility time before capture, and navigating its source page let page-hide saving overwrite the crafted profile. The E2E now pauses the source, persists an exact A1-D5 composition, opens it in a second shared-storage page, and keeps the capture state paused.
- The proof now asserts both persisted paused state and the controlled encounter's exact dynamic D3 location (`frontDesk.x + 2`, `frontDesk.y + 3`) after real-app hydration. It hides only the pause banner via capture-local CSS so the actual paused Phaser scene remains visible.
- Two independent focused desktop E2E runs produced captures with the patient visibly in front of the C3 counter at D3. Their patient identities vary with normal campaign generation, but the asserted grid location and seated-founder/public-patient composition are identical. The main sidewalk remains a distinct lower paved band below the shallow landscaped setback, so no exterior geometry change was needed.
- The owner screenshot `Photos for Codex/No new front desk room.PNG` proves the launcher is loading the newest implementation: A1 cabinet, A5 cooler/bin, B3 chair, C3 counter, D3 public position, planted frontage, and the removed visitor chair are all present. The failure is therefore not stale code or save migration.
- The current live render reuses the pre-existing `front-desk-fixtures-v1.png` and generic environment wall/floor treatment. At the relaunch/default 100% framing those layers remain visually close to the older presentation, while the prior 180% isolated crop amplified them enough to conceal the mismatch. The prior acceptance judgment was therefore too narrow.
- The v2 correction uses `apps/player/public/art/rooms/front-desk-v2/front-desk-components-v2.png`, a transparent (ARGB) component sheet rather than a flattened room. Its cabinet, chair, counter, cooler, bin, noticeboard, clock, floor, wall, threshold, and planters are independently framed and placed in Phaser.
- The new full-app Playwright proof is `artifacts/screenshots/front-desk-v2-normal-view.png` at the owner-supplied relaunch viewport (1806 by 1014). It shows the detailed cabinet/plant, distinct chair and counter equipment, blue cooler/bin, tiled floor, mounted noticeboard/clock, threshold, and planters at the new isolated-Level-0 140% relaunch framing.
- The v2 fixture mapping is room-scoped: semantic Level 1 frames remain on `front-desk-v1` by default, while `getRoomBitmapFixtureFrame("room.front_desk", ...)` selects v2 only for the five rebuilt starter-room fixtures. This prevents a cabinet, bin, or counter in another room from silently changing art.
- The camera is not persisted. A fresh session with exactly the isolated Level 0 Front Desk starts at 140%; an expanded Level 0 clinic and all later levels retain the normal 100% overview. A deliberate session zoom change still replaces this default normally.
- Explicit built doors are drawn by the architecture layer after room art (layer depth 30 versus the Front Desk v2 wall images at depth 16-19), so the independent v2 wall treatment cannot visually seal a valid door.
- Front Desk v3 is a separate transparent architecture-only sheet: exact 5-by-4 floor plate, rear/side/front wall pieces, threshold, and three restrained contact shadows. It has no furnishings and preserves the v2 fixture layer unchanged.
- A seated founder or assigned receptionist already carries the chair in their authored actor sheet. The separate `secretaryChair` now appears only while B3 is vacant; focused pure-helper coverage proves founder/receptionist occupied and vacant cases.
- `artifacts/screenshots/front-desk-v3-floor-walls-normal.png` is the primary 1806-by-1014 / 140% proof, showing the complete v3 architecture, one chair, grounded fixtures, entrance, sidewalk, and planters.

## Exact next action

Owner visual review of `artifacts/screenshots/front-desk-v3-floor-walls-normal.png`; make no further Front Desk changes unless requested.
