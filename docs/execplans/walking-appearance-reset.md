# Walking appearance reset

## Goal and owner feedback

Owner accepts Blue Glasses whole-body statics and considers the static process
reliable enough for autonomous production. Walking remains rejected. Navy West
still shows a shin ahead of its ankle with a cut edge; its prior walking approval
is reopened. Blue profile arms visibly separate at elbows, shoulders attach in
the wrong place, arms flare outward, legs are too narrow, texture seams are
conspicuous, and ankle silhouettes do not connect naturally.

## Scope and constraints

Stop extending the current walking fit to more characters. Preserve all existing
assets as comparison baselines, not evidence of current owner acceptance. Keep
approved static artwork separate from walking status. This milestone diagnoses
the renderer and defines one small replacement pilot; it does not generate the
entire roster, replace gameplay art, or publish anything.

The repository contains extensive unrelated changes. No broad staging, shared
renderer replacement, dependencies, commit, push, or deployment. Static batch
production/integration is a separate milestone; do not make it wait on walking
quality or claim it has already been implemented.

## Ownership and evidence

Astra owns architecture, approval status, this plan and final assessment. Sol
owns a bounded read-only diagnosis of current arm/lower rendering and validation.
Implementation of the selected pilot must be delegated before any code edits.

Current Blue manifest: 2f5efba7c624429a16467b9877fb31d02e273d0aec6047689404983cc0673d83.
Current Navy manifest: 1a6938d11630dde23024d4d7c85a4c44cc3b4587ecc3d77db6ffbc85678c16c7.
Both pass technical checks; owner feedback demonstrates those checks are not
sufficient visual acceptance. Parent viewed the actual West proof sheets again.

## Proposed pilot

Use Blue Glasses West only, the direction exposing all current defects. Establish
a neutral assembled pose that matches its approved standing art before motion.
Preserve original head, body proportions, garment shading and visible shoulders.
Use eight phase-specific complete limb drawings: shoulder-to-hand and
hip-to-shoe, with cuffs, elbows, knees and ankles already drawn cohesively.
Composite far limbs, an arm-free trunk matching the approved standing artwork,
near limbs and exact original head. Do not deform or split each completed limb
internally. Standardize phase order, source-relative attachments, ground contact
and layer order rather than forcing every design into identical part dimensions.

Use a restrained gait and fixed shoulder sockets, then inspect all phases at
actual game size and enlarged. Prototype must stand beside approved static and
the current failed walk. If shoulder/hip seams still fail, use complete walking
frames for the same small pilot. Do not assume a new method succeeds until the
comparison demonstrates it. Defer a continuous mesh: it preserves connectivity
but risks shearing pixel outlines and clothing through bends.

## Acceptance and later milestones

1. Diagnose source of visual breaks and misleading metrics; finalize pilot design.
2. Implement only Blue West in an isolated renderer and review every frame.
3. Validate visible shoulder/elbow/knee/ankle contours, stable cloth texture,
   static-relative widths and grounded feet; review playback, not only points.
4. After owner accepts the pilot, extend to Blue East/North/South, then repeat
   on Navy to prove transfer before fitting another character.

Technical validation remains useful for file integrity, margins and regressions.
It cannot grant visual approval. Do not weaken tests to accommodate an artifact;
distinguish an inappropriate metric from a genuine appearance failure explicitly.

## Progress

Planning and read-only diagnosis complete. Sol traced the shared renderer's
independent rigid arm transforms and Blue/Navy scanline-normalized thigh/shin
quads. Parent inspected those paths and West proof sheets. Elbow alpha at one
point and ankle self-consistency do not establish silhouette continuity; output
measurements copied into a manifest establish repeatability, not source likeness.
Selected complete phase-specific limbs over mesh deformation for the firstpilot.
No artwork/runtime changes this turn. Next action is the isolated BlueWest pilot.
