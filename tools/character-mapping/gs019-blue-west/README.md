# GS-019 Blue-West isolated pilot

This local-only pilot pins Blue Glasses' approved West standing artwork and the
rejected West cycle, extracts four rows of complete phase-authored limbs, scales
each complete limb row once, and composes limbs by translation only. It does not
modify or integrate the shared production rig.

Run:

```text
node tools/character-mapping/gs019-blue-west/build.mjs
node tools/character-mapping/gs019-blue-west/validate.mjs
node tools/character-mapping/gs019-blue-west/build-whole-body-v1.mjs
node tools/character-mapping/gs019-blue-west/validate-whole-body-v1.mjs
node tools/character-mapping/gs019-blue-west/build-whole-body-v1.mjs v2
node tools/character-mapping/gs019-blue-west/validate-whole-body-v1.mjs v2
node tools/character-mapping/gs019-blue-west/build-whole-body-v1.mjs v3
node tools/character-mapping/gs019-blue-west/validate-whole-body-v1.mjs v3
node tools/character-mapping/gs019-blue-west/validate-review.mjs v3
node tools/character-mapping/gs019-blue-west/build-whole-body-v1.mjs v3-corrected
node tools/character-mapping/gs019-blue-west/validate-whole-body-v1.mjs v3-corrected
node tools/character-mapping/gs019-blue-west/build-whole-body-candidate.mjs
node tools/character-mapping/gs019-blue-west/validate-whole-body-candidate.mjs candidate-v4
node tools/character-mapping/gs019-blue-west/validate-review.mjs candidate-v4
node tools/character-mapping/gs019-blue-west/build-whole-body-candidate-v5.mjs
node tools/character-mapping/gs019-blue-west/validate-whole-body-candidate.mjs candidate-v5
node tools/character-mapping/gs019-blue-west/validate-review.mjs candidate-v5
```

The review fragment is written to
`artifacts/character-movement/gs019-blue-west/blue-west-motion-review.html`. Its 32×64 panel is
the default gameplay presentation derived from the current authored-character
runtime at tile size 24; 160×320 is the native source frame.

The complete-limb output is retained as the rejected first attempt. The
`whole-body-v1/` variant is the authorized fallback and uses a single uniform
scale for each complete generated body, translation-only registration, and the
exact original West head.

`whole-body-candidate-v1/`, `whole-body-candidate-v2/`, and
`whole-body-candidate-v3/` retain sequential review evidence. The candidate
builder writes v4: V3 supplies odd phases, the transition sheet supplies phases
02/04/06, and the final dedicated phase-08 source supplies 08. Each source sheet
has one uniform scale. Generated heads are
removed in source coordinates at the connected blue collar; the exact original
identity layer removes its inherited blue collar wedge and attaches to each
frame's measured body collar socket at native scale.

`whole-body-candidate-v5/` preserves the v4 body art and body registration.
Its head reference is derived by direct pixel matching against the immutable
approved standing raster, then follows each frame's measured torso displacement.
