# Correct horizontal character gaits

## Goal

Make every founder, patient, employee, and ambient pedestrian face the actual
horizontal direction of travel and advance through a progressive lateral
stride cycle while walking left or right, without changing any character identity,
body proportion, palette, portrait, standing pose, or existing front/back gait.

## Requirements

- Use `Photos for Codex/Walking animation frames.PNG` only as a motion reference
  for opposing arm/leg swing; do not copy its character design or artwork.
- Preserve all 30 canonical founder identities and all 50 canonical adult
  patient identities.
- A westbound route must select left-facing art throughout the horizontal leg.
- An eastbound route must select right-facing art throughout the horizontal leg.
- Horizontal walking must use at least the visible progression `legs apart ->
  legs together -> opposite legs apart -> legs together`; no frame may silently
  reverse the actor.
- Preserve the current front/back sheets and behavior, which the owner has
  approved.
- Preserve canonical floor anchors, sprite dimensions, nearest-neighbor
  rendering, save identity, route speed, pathfinding, and gameplay.
- Staff and legacy/fallback actors must continue using their left-facing art
  plus runtime mirroring for eastbound travel.

## Constraints and non-goals

- No character redesign, resizing, reproportioning, palette change, or new
  identities.
- No movement-speed, route, simulation, balance, clinical, or room changes.
- Do not generate replacement people with an image model. Correct the existing
  deterministic source-to-atlas mapping and runtime selection.
- Preserve unrelated dirty-worktree changes.

## Relevant repository state

- Founder pose sheets are 7 x 3. The existing map labels row 1 column 0 as
  `left-walk-b`, although that panel faces right; row 1 column 2 is the matching
  left-facing stride. The two B mappings are crossed.
- Patient source sheets are 6 x 3. Row 1 columns 4/5 face right and row 2
  columns 0/1 face left, while the current extraction map labels them in the
  opposite direction.
- Runtime route sampling already carries a persistent `rightFacing` signal and
  selects explicit founder/patient right atlases or mirrors the legacy actor
  pack. The source mapping and asset contracts need focused verification.

## Decisions already made

- Derive each founder's second directional stride deterministically by
  mirroring the opposite-facing canonical first stride. This guarantees that
  both stride extremes retain one direction even where an independently
  generated B source panel turns the founder's head/body.
- Use the existing direction-specific idle side frame as the legs-together
  transition; it preserves identity and proportions without inventing art.
- Keep the existing front/back gait implementation unchanged.
- Explicit left/right founder and patient atlases remain separate runtime
  assets; fallback staff/civilians may mirror the established left atlas.

## Milestones

1. Correct founder and patient horizontal source-slot mappings and rebuild the
   affected runtime atlases with a cache-safe content revision.
2. Replace ambiguous founder B panels with deterministic mirrored opposite-A
   frames and add a neutral lateral transition selected only during side travel.
3. Strengthen structural verification for direction, stride alternation,
   identity continuity, alpha safety, and floor anchors.
4. Confirm runtime east/west selection for founder, patient, staff, and ambient
   pedestrians and add focused regression coverage where missing.
5. Correct the non-founder follow-up without changing the accepted founder r8
   pack: derive patient lateral B frames from opposite-facing A frames and
   prove staff and ambient route selection through the live route sampler.
5. Produce actual-app left/right gait proof and run focused regressions,
   typecheck, build, Playwright, and diff checks for Sol review.

## File or module ownership

- `tools/build-founder-actors-v4.mjs`
- `tools/build-patient-actors-v1.mjs`
- `tools/verify-founder-actors-v4.mjs`
- `tools/verify-patient-actors-v1.mjs`
- Character atlas manifests and only the rebuilt horizontal walk assets under
  `apps/player/public/art/characters/`
- Narrow selection/revision seams and tests under `apps/player/src/art/`
- Focused character movement proof/tests and this ExecPlan

## Acceptance criteria

- Every westbound founder and patient frame faces left in both gait phases.
- Every eastbound founder and patient frame faces right in both gait phases.
- Each identity has two distinct horizontal stride extremes, a legs-together
  transition between them, and a stable floor anchor.
- Staff and ambient fallback actors face the correct direction and alternate.
- No current identity, proportions, portrait, standing pose, front/back gait,
  route, or gameplay behavior changes.
- Actual-app proof shows the same founder and patients walking both directions.

## Validation

- Founder and patient asset build/verifier scripts.
- Focused character bitmap, route-motion, appearance, and facility tests.
- Actual-app browser proof for east/west movement.
- `npm.cmd run typecheck`.
- `npm.cmd run build`.
- `git diff --check`.

## Progress

- [x] Inspect the saved walking reference, current runtime selection, source
  pose sheets, and generated atlases.
- [x] Identify crossed founder and patient horizontal source mappings.
- [x] Correct and rebuild horizontal gait assets.
- [x] Strengthen automated contracts and actual-app proof.
- [x] Complete the initial source-slot correction and validation.
- [x] Replace founder B direction-ambiguous frames with deterministic mirrored
  opposite-A frames.
- [x] Add and validate the four-step lateral gait cycle for all actor families.
- [x] Complete independent Sol review and validation of the corrective pass.
- [x] Diagnose the non-founder live lateral reversal separately from the
  accepted founder implementation.
- [x] Rebuild patient B lateral frames as exact mirrors of opposite-facing A
  frames, cache-bumped to patients-v1-r5.
- [x] Add live-route trace coverage for authored patients, legacy staff, and
  authored ambient passers.
- [x] Run the final actual-app Playwright proof plus typecheck/build/diff
  validation for the non-founder follow-up.
- [x] Replace the mixed-direction patient side-idle neutral with dedicated,
  direction-locked patient r6 neutral gait atlases and verify all 50 identities.
- [x] Add an opt-in development-only FacilityScene readback and prove on the
  actual Phaser canvas that a patient, receptionist, and authored ambient
  passer retain one lateral profile through A -> neutral -> B west and east.

## Discoveries

- The current route-facing signal is already directionally correct. Replacing
  it would risk regressing the approved smooth route interpolation.
- The existing source artwork already contains the desired opposing strides;
  the visible reversal comes from mislabeled extraction slots, not missing art.
- Owner playthrough showed that several independently authored founder B frames
  still reverse orientation despite their nominal source slot. A pixel-level
  comparison also flags multiple B frames as closer to the opposite idle view.
  Source-slot labels alone are therefore insufficient to guarantee direction.
- Patients and other actors now hold the correct profile; their remaining
  heelie-like motion is caused by the two-extreme-frame loop lacking a
  legs-together transition.
- Founder 2's approved left-A and right-A lower bodies are mirror-equivalent.
  Its deterministic B transform is therefore pixel-equivalent to A; retain
  that identity-safe exact mirror rather than redrawing it. The visible
  out-together-out progression still comes from the inserted neutral beat.
- Follow-up live diagnosis: authored patient B source panels are not reliable
  profile contracts even after nominal slot correction. Patient r5 now treats
  only the verified A panels as canonical and derives `left-walk-b` as an exact
  mirror of `right-walk-a` and `right-walk-b` as an exact mirror of
  `left-walk-a`. This keeps every B frame direction-safe with a shared floor
  anchor. Legacy staff v3 retains its verified left-facing A/B atlas and uses
  the established eastbound runtime flip. Ambient passers with authored patient
  identities use the patient r5 resolver, so they receive the same guarantee.
- `traceLateralGaitRoute` creates cardinal route tracks, advances them through
  consecutive moving samples, and then resolves their actual atlas/flip
  selection. The dev-only Character QA page renders that trace for a patient,
  legacy staff proof actor, and authored ambient passer rather than manually
  selecting static gallery frames.
- A second live playtest exposed that r5's patient lateral A and B sheets were
  still not one same-direction family: both nominal A sources were east-facing,
  while the mirrored B changed the profile. Its neutral also selected the
  generated side-idle atlas, whose nominal labels are reversed across the
  patient roster. Patient r6 instead uses source row-two columns four and five
  as one verified east-facing A/B pair, derives every westward phase by exact
  mirror, and derives the feet-together neutral from the same-direction A
  frame by changing only lower-leg rows 96–143. Rows 0–95 are exact across A
  and neutral for every identity.
- The earlier `CharacterQaGallery` route trace exercises shared selection
  seams, but it is not a FacilityScene rendering proof. The r6 corrective pass
  adds `?facility-gait-proof=1`, which is development-only and exposes a
  host-local snapshot of metadata stamped on the actual Phaser image after
  `setTexture`/`setFlipX`. Its E2E fixture drives a real patient, receptionist,
  and authored patient-passer across horizontal FacilityScene routes and saves
  west/east canvas screenshots.

## Exact next action

Owner playtests the direction-locked patient r6 gait during ordinary facility
movement. Sol has reviewed the all-identity atlas proof, actual FacilityScene
west/east captures, focused tests, typecheck, and production build. No further
implementation remains unless that playtest reveals another defect.
