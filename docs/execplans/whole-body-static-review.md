# Whole-body static review for the first four characters

## Goal and authorization
Owner accepted Brown Beanie walking as good enough and authorized one combined
review of consistent whole-body static poses for Green, Gray Braid, Gray Overshirt
and Brown Beanie before further character fitting.

## Requirements
Four standing directions and four sitting directions for each character.
South clipboard only for verified founders. Preserve approved walking frames;
star jump is a separate founder action, outside this static-art replacement.
Reuse suitable original whole-body art; create missing or unsuitable views with
source-referenced image generation. Preserve identity, clothing, body proportions,
head scale, direction and floor/seat registration. No fitted limb assembly for
these final static poses. Background must be transparent. No game integration,
commit, push or deployment. Extensive unrelated work exists; preserve it.

## Decisions and workflow
Generate coherent bodies as complete poses. Register each complete pose with a
single uniform scale and translation; no stretch-fill. Where possible preserve
original whole-body standing art. Source crops/alpha extraction and deterministic
packaging are asset import, not generated replacement art. Record exact prompts,
source hashes, static floor/seat anchors and approved walking manifest pins.

## Milestones and ownership
1. Terra fourth_character_inventory: read-only source/view/founder inventory.
2. Parent: art direction, source inspection, imagegen missing poses and visual QA.
3. One worker: isolated whole-body static importer/registry/build/validation.
4. Terra: combined inline review packaging with static/walk comparison.
5. Parent: actual code/proof review, independent validation, handoff and delivery.
Workers share files, preserve unrelated edits, and do not spawn/install/push.

## Acceptance and validation
All required poses present, true alpha, no cropped head/chin/feet, correct facing,
cohesive arms/torso/legs, consistent clothes/identity and natural seated posture.
Verify floor/seat anchors, common scale, image dimensions and original provenance.
Approved walk files and manifests must remain byte-identical. Review at native
size plus enlarged detail and with synchronized walking to judge transitions.
Browser controls/layout checked at desktop/mobile and both themes.
Owner appearance approval remains separate from automated validation.

## Progress and next action
2026-09-17: source art, deterministic import, registry and core validation complete.
Parent inspected all 32 scaled poses and original/static/walk comparison; corrected
too-tall seated scale and standing crops that truncated sole pixels before review.
Terra completed combined UI. Parent inspected host desktop/mobile East chair and
North chair screenshots and independently reran final browser validator: PASS.
All implementation milestones complete; next owner appearance approval.

### Inventory and source decisions
No verified founder among these four: Green patient.adult.046, Overshirt
patient.adult.032, Brown patient.adult.043, Braid preview retained.gray-braid.
Scope is 32 poses, no new clipboard. User accepted Brown walking on September17;
all four walking baselines remain frozen. Reuse original four-cardinal stands.
Parent generated four complete seated sheets with built-in imagegen, inspected
all at native resolution, and saved images/exact prompts/generation record in
whole-body-static-v1/assets. These are source art pending scaled visual review.
Parent independently confirmed original Green checkerboard is opaque (alpha255
at neutral background samples); inventory's transparent description was wrong.
Importer must preserve original subject RGB and avoid eating white hair/shirts.

Sol owns core registry/import/build/validation. Terra owns only build-review.mjs,
validate-review.mjs and new inline review outputs; these are disjoint writes.
Seat/head/floor markers must be measured, no independent XY scaling or limb fits.

### Core review and verification
Sol completed build-static-v1.mjs, validate-static-v1.mjs, registry and protocol.
Parent inspected actual code and proof sheets and independently reran validator:
PASS 32 poses, 274988 exact original standing RGB pixels, 4158 retained bright
identity pixels, all 128 walk files. Five walking manifest hashes independently
match the pre-task frozen baselines. Registry and artifact mirror SHA-256:
5e9ba1ad208e1db6bdd1752939f43f6f684da4a9afcab0cdc2e074886959df54.
Stand crops expanded from310 to330 high to retain soles. Seated uniform scale
comes from original whole-body South seated height; source heads use authored
crown/chin limits. Measured per-view seated/standing head-height ratios span
.872 to1.118. Generated seats are new identity-referenced artwork, not exact
original face pixels. Owner approved the review on2026-09-17: "Looks good!".
No game integration.

### Final review UI
Terra build-review.mjs and validate-review.mjs completed. Final fragment986344bytes
at the thread visualization path whole-body-static-review.html, registry hash
unchanged. All32 statics/128walking assets hash-checked; decode/failure handling,
pose/direction/character controls, chair context, play/pause/scrub, theme redraw,
and736/320 layouts pass. Parent reviewed actual UI code and screenshots and ran
the final validator independently. Sources/prompts saved with built-in imagegen
provenance. Handoff updated. Local-only checkpoint; no game integration/push.

### Owner acceptance
2026-09-17: owner approved all32 static poses with "Looks good!". Task complete.
Registry5e9ba1ad208e1db6bdd1752939f43f6f684da4a9afcab0cdc2e074886959df54
is the approved static baseline for the first four; walking approvals retained.
