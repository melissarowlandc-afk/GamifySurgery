# Implement the Room and Character Visual Upgrade

## Goal

Replace the remaining geometric or under-detailed room and character presentation in the currently playable Stitchin' Time clinic with the approved cohesive illustrated style, while preserving gameplay, room footprints, routing, doors, saves, clinical content, balance, and the canonical character identity system.

The authoritative visual reference is the original integrated mockup `exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86`, retained locally in the ignored `generated_images/basic-room-mockups-v1/example-clinic-basic-overview.png` owner-review workspace. Later mockups are structural references only and must not gradually replace or dilute that rendering language; derived runtime assets are checked in separately under `apps/player/public/art/`.

## Requirements

- Use the original mockup's polished, dense, crisp, natural-color pixel-dollhouse rendering language: readable rooms, modest world-scale characters, detailed fixtures, shallow dark rear walls, landscaped exterior, and bottom sidewalk.
- Keep all visual assets original and repo-native; do not flatten the clinic into a screenshot.
- Upgrade the shared canonical character pipeline so every persisted person remains visibly identical across map sprites, directions, walking, sitting, working, interactions, star jumps, cards, and portraits.
- Preserve 30 interchangeable founder heads and 30 bodies, including the approved human and non-human choices, while increasing portrait and in-world detail coherently.
- Give every currently playable Level 0-2 room a recognizable, restrained fixture package and distinct floor material.
- Preserve the existing room IDs, footprints, costs, capabilities, progression, explicit door system, imaging-control rules, save schema, and route semantics.
- Keep furniture sparse enough for legibility and routing. Prefer realistic wall or central placement according to room function.
- Preserve at least one fixture-clear candidate door zone on each wall of every room. A candidate becomes placeable only when domain validation also finds adjacent traversable space.
- Bathroom: place sink and toilet on opposite walls/corners, keep the center clear, and preserve a candidate door zone on all four walls.
- Waiting Room: no small stool; use a two-seat couch and two normal backed chairs with navigable approaches.
- Examination Room: no curtain, scale, or paper-towel dispenser; keep otoscope and gloves on the exposed world-north wall; show the optional anatomy poster only when a door does not consume its wall segment.
- X-ray Room: keep the machine base toward the left/northwest so public and control-room door approaches remain clear.
- Square rooms use their one approved fixed furniture orientation. Non-square rooms expose only their approved 0/90 footprint orientations. Front Desk retains its special fixed orientation.
- Grounded room-local fixtures transform with the room. The visible shallow dollhouse wall remains world-north and does not rotate with the floor package.
- Hallways behave as floor rooms and receive a shallow north wall only where they form the northernmost exposed boundary.
- Wall fixtures remain attached to a real visible wall, re-anchor to the exposed world-north wall when supported, or disappear. They must never float over the floor.
- Doors render as clean wall openings and thresholds, not ajar slabs.
- Characters, fixtures, litter, and rooms retain correct floor-contact depth ordering.

## Constraints and non-goals

- Do not add or change clinical content, progression, unlocks, room costs, staff rules, simulation timing, satisfaction, FSRS, or balance.
- Do not change stable room, employee, patient, concept, or campaign IDs.
- Do not change persisted `PlacedRoom`, `DoorState`, or character appearance descriptor semantics unless a migration is unavoidable and separately reviewed.
- Do not copy sprites, rooms, UI assets, or layouts from another game.
- Do not use a generated mockup as the live clinic background.
- Do not redesign HUD composition, gameplay panels, or phone behavior beyond small compatibility adjustments required by the new art.
- Do not extend beyond currently playable Level 0-2 art.
- Preserve all unrelated dirty working-tree changes. Do not reset, revert, clean, commit, push, deploy, or publish during implementation unless separately authorized.

## Relevant repository state

- Branch `beta` contains a substantial uncommitted Level 2 implementation and visual work that must be preserved.
- Room definitions and footprints are centralized in `packages/balance-config/src/prototype-balance.ts`.
- `apps/player/src/facility/FacilityScene.ts` renders rooms, floors, cutaway walls, fixtures, characters, door previews, and depth sorting.
- `apps/player/src/art/fixtureArt.ts` contains reusable native pixel fixture assets.
- `apps/player/src/art/characterArt.ts` provides the shared persisted appearance, map poses, directional frames, portraits, and stable signatures. `CharacterQaGallery.tsx` displays cross-representation identity checks.
- `roomCutaway.ts` already computes exposed world-north wall runs. `renderDepth.ts` already sorts by floor-contact depth.
- The domain already rotates footprints, navigation masks, anchors, and doors. The visual gap is that many fixtures are still positioned with hard-coded world-space ratios and do not share the same room-local transform.
- The generated structural reference sheets document legal door-clear zones and world-north wall behavior. They do not supersede the original mockup's art style.

## Decisions already made

- The original `exec-44a3...` mockup is the stable visual source of truth; later mockups refine geometry only.
- Square rooms do not rotate visually; supported non-square rooms use two meaningful orientations.
- Furniture and grounded decor rotate with the room-local floor package. Plants are grounded fixtures.
- The shallow rear wall always faces world north and appears only on the northernmost exposed boundary.
- Connected room floors retain their exact build footprints; omitting an internal rear wall never expands a room's floor.
- Every wall retains at least one fixture-clear candidate door segment, but actual door placement remains governed by adjacency and reachability validation.
- Bathroom sink and toilet occupy opposite corners/walls.
- Fixed wall art may disappear when the exposed wall or a player-placed door leaves insufficient space.
- Visual metadata should derive at render time from existing room and appearance IDs to preserve saves.

## Milestones

1. Add and test a shared room-local visual-layout transform for supported orientations, grounded fixtures, wall-bound decor, fixture-clear door zones, and world-north suppression/cropping.
2. Rebuild the primary room slice: Front Desk, Hallway, Waiting Room, Examination Room, Bathroom, X-ray Room, and Imaging Control Room.
3. Apply the same system and quality bar to Minor Procedure and every currently playable Level 2 room without changing their mechanics.
4. Upgrade canonical character map sprites, directional/pose frames, and portraits while preserving persisted appearance identities and the QA gallery contract.
5. Run unit, type, build, save/routing, and browser visual regression checks; inspect the actual app at desktop and phone widths; capture the facility, Build Door mode, and character QA gallery.
6. Correct the actual-app art-quality gap found during Sol review: raise portrait-native detail, improve map-character readability without changing foot anchors or collision, and enrich room/equipment pixels while preserving every approved fixture-clear path and the frozen `exec-44a3...` rendering authority.

## File or module ownership

### Milestone 1 Terra ownership

- New room-local visual-layout module and focused tests under `apps/player/src/facility/`.
- Minimal integration edits in `apps/player/src/facility/FacilityScene.ts` and tightly relevant facility types/tests.
- This ExecPlan's Progress, Discoveries, and Exact next action only.

### Later milestone ownership

- Primary/Level 2 room artwork: `apps/player/src/art/fixtureArt.ts`, `FacilityScene.ts`, related focused tests, and only navigation metadata that demonstrably must match rendered blocking geometry.
- Character artwork: `apps/player/src/art/characterArt.ts`, `CharacterQaGallery.tsx`, and focused art/visual tests.
- Browser evidence: existing Playwright visual/build/QA suites and versioned screenshot artifacts.

Only one write-capable worker should normally be active. Each later ownership assignment is made after Sol reviews the preceding worker's actual diff and test evidence.

## Acceptance criteria

- The live application—not a standalone mockup—substantially matches the original approved reference's visual density, natural palette, depth, and cohesion.
- Every Level 0-2 room is recognizable without relying on its text label and contains no final geometric furniture placeholder.
- Every room keeps at least one visually clear candidate door zone per wall; actual door highlights and validation remain correct.
- Bathroom sink and toilet are on opposite walls/corners and all four wall approaches remain visually clear.
- Grounded fixtures rotate/re-render correctly for each supported room orientation without appearing upside down or detached.
- The dollhouse wall stays world-north, appears only on the exposed northern boundary, and does not alter room floor footprints.
- Hallways gain appropriate exposed north walls without blocking circulation.
- Wall fixtures never float; doors replace the affected wall section cleanly.
- Characters are more detailed, readable against floors, naturally proportioned, and identity-consistent across every representation and save/reload.
- Routing, click targets, occupancy, depth sorting, explicit doors, room reachability, and Level 0-2 interactions continue to work.
- Existing saves load without visual identity changes or duplicated state.

## Validation

- Focused room-layout transform tests for 0/90 and defensive 180/270 handling.
- Focused fixture-art, cutaway-wall, door-preview, render-depth, and character identity tests.
- Existing player and domain regression suites relevant to facility routing, doors, persistence, and appearance.
- `npm run typecheck`
- `npm test`
- `npm run build:pages`
- `git diff --check`
- Actual browser inspection and screenshots at desktop and phone widths, plus Build Door mode and Character QA gallery.

## Progress

- [x] Inspected the current room, wall, door, fixture, rotation, character, save, and dirty-work seams.
- [x] Re-established `exec-44a3...` as the authoritative visual reference.
- [x] Corrected the bathroom reference so the sink and toilet occupy opposite corners and every wall retains a door-clear candidate zone.
- [x] Milestone 1: shared room-local visual-layout transform.
- [x] Milestone 2: primary room visual slice.
- [x] Milestone 3: remaining Level 1-2 room visuals.
- [x] Milestone 4: canonical character detail pass.
- [x] Milestone 5: integration validation and actual-app visual evidence.
- [x] Milestone 6: actual-app art-quality correction and final visual evidence.

## Discoveries

- Gameplay already rotates footprints, navigation masks, anchors, and doors; fixture art is the inconsistent layer because it is largely placed with hard-coded world-space ratios.
- Existing cutaway-wall and depth systems should be extended rather than replaced.
- Door-clear template zones must remain distinct from immediately legal placement: an exterior wall still needs an adjacent traversable room or hallway before a door can be valid.
- A renderer-only visual-layout registry keyed by stable room definition IDs is the safest save-compatible approach.
- The working tree already contains overlapping Level 2 fixture and character changes, so workers must patch narrowly and review the current file content rather than assuming the baseline branch.
- Milestone 1 adds renderer-only room-local fixture transforms, world-north wall-decor suppression, and fixture-clear candidate door-zone metadata. It leaves the domain door validator, room/save schema, cutaway geometry, and depth system untouched.
- Milestone 2 adds explicit primary-room visual metadata, an upright fixture-variant seam, a compact two-seat waiting-room couch, an exam-room glove dispenser, and room-safe primary fixture packages. Grounded positions transform with a room, while finished dollhouse fixtures remain upright unless a dedicated authored view is supplied. It deliberately removes the rejected base-layout waiting plant/side-table, examination scale/privacy curtain, and bathroom floating hardware.
- Milestone 3 gives Minor Procedure and all nine Level 2 rooms explicit non-fallback fixture coverage, fixed/two-orientation declarations, and room-specific door-clear spans. Existing Level 2 native pixel assets and room floor treatments remain the live rendering packages; the pass avoids adding save, navigation, balance, or imaging-rule changes.
- Milestone 4 retains all persisted 30x30 appearance combinations and stable descriptor IDs while adding natural human hair variants, a bare-scalp feminine preset rendering, distinct working and interaction overlays, and the same-descriptor QA-gallery representations. The live renderer selects these poses only from existing presentation state: founder activity labels and assigned staff home rooms; it does not alter routing, timing, or save data.
- Milestone 5 maps only domain-enabled new-door preview slots through the oriented renderer-only clear-span registry. Existing doors deliberately bypass that preview filter so legacy layouts remain rendered and removable. New Build Mode placement is constrained to each visual layout's fixed or approved 0/90 orientations without changing the domain's stored room footprint or validation rules. The health-checked E2E wrapper correctly avoided the unrelated port-4173 server and produced real Stitchin' Time captures.
- Sol's inspection of the Milestone 5 screenshots accepted the structural integration but found that the live 38x42 portraits and several room interiors still read materially coarser and emptier than the frozen reference. Automated success is therefore not sufficient for acceptance; one focused native-detail pass remains.
- Milestone 6 replaces the live portrait output with a 56x64 close-up canvas that starts from the same descriptor-driven bust source and adds independent face, hair, clothing, and role-detail pixels. It does not scale a map frame or change any stable appearance ID/signature.
- Actual application captures after the pass show materially larger, readable QA portraits and denser Front Desk, Waiting, Examination, Bathroom, X-ray, and Imaging Control equipment detail while preserving the existing room footprints, clear door approaches, world-north cutaways, and Build Mode grid behavior. The map sprites remain intentionally compact so their heads stay below the cutaway walls; their existing directional and pose detail is retained.
- Sol reviewed the actual desktop, phone, Build Door, normal-vs-Build, and character-QA captures; inspected the implementation diff; and independently reran the complete repository test suite, player/domain suites, workspace typecheck, Pages production build/base-path verifier, focused browser suite, and `git diff --check`. All completed successfully. The visual milestone is ready for owner review, not presumed owner approval.

## Exact next action

Sol should inspect the Milestone 6 actual desktop/phone, normal-vs-Build, Build Door, and Character QA captures against the frozen `exec-44a3...` reference, then decide whether the approved Level 1 golden slice is ready for owner visual review. No gameplay or domain follow-up is required by this visual plan.
