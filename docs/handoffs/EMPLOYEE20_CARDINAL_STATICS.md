# Twenty employee cardinal stills — 2026-09-17

## Result and scope
All20 owner-approved employee identities (gs022-new-employee-001 through020)
have eight local transparent PNG stills each: standing and seated South, East,
West and North. Total160 includes20 byte-preserved original South/front PNGs
and140 newly generated views. East and West are full90-degree side profiles.
The generated South cells are calibration references, excluded from the160.

Package: artifacts/character-statics/employee20-statics-v1/manifest.json
PNG files: artifacts/character-statics/employee20-statics-v1/characters/<id>/
Review images: artifacts/character-statics/employee20-statics-v1/proofs/<id>/
Tools, exact prompts, retained generation sources and frozen hash ledgers:
tools/character-mapping/employee20-statics-v1/

## Production decisions
Final PNG canvas160x320, body axis80 and floor287; uniform whole-body scaling
preserves individual size calibrated to each approved front. All80 seated poses
have parent-authored, visually accepted chair-contact anchors. Coat-obscured
contact positions are inferred anatomical support planes.

Employee006 source rows are S/E/N/W; output is correctly remapped to S/E/W/N.
Employees017 and019 use v2 sources fixing missing West badges. Their v1 sources
remain retained as superseded provenance. Badge positioning follows anatomical
left, visible in the West profile and hidden in the East profile.

Parent reviewed every character's native artwork and enlarged seat-contact
proofs. Terra independently reviewed all20 native light/dark and game32x64
light/dark proofs, plus enlarged light/dark001006017019; no blockers found.
Owner identity/front approval remains separate from parent production QA.

## Ownership and validation
Sol coverage_completion implemented reference extraction, packaging, metadata,
proofs and validators. Terra remaining_patient_seats generated001003–008;
founder_seats_02_15 generated002009–014; static_inventory generated015–020 and
audited tooling/visuals; employee_badge_repairs corrected017019. Parent retained
art direction, acceptance, code review and independent verification. No
qualifying implementation milestone was left undelegated.

Commands:
- node tools/character-mapping/employee20-statics-v1/validate-employee20-references.mjs
- node tools/character-mapping/employee20-statics-v1/validate-employee20-statics.mjs --complete
- node tools/character-mapping/gs-018-statics-v1/validate-gs-018-statics.mjs
- node --check for each new .mjs tool

Reference validation passed20 exact RGBA crops and20 owner-receipt bindings.
GS018 validation and independent actual-file checks passed all704 prior baseline
stills plus30 clipboard stills against their original frozen hash ledgers.
Complete-mode validation requires160 populated slots,140 frozen new poses,
20 original fronts, all20 source/prompt/provenance bindings, and no pending
art or contact review. Partial runs explicitly report PARTIAL_VALID.

## Delivery boundary
This is completed local artwork, not runtime integration or deployment. No
runtime mapping IDs were invented. No clipboard or walking expansion was added.
The separate GS022 patient/public concept task and all prior artwork are retained.
No staging, commit, push or deployment was performed. Say "push to GitHub" to
request a scoped backup of this validated local checkpoint.

Final independent result: PASS_COMPLETE —20 identities,160 packaged stills,
140 accepted new poses,20 original fronts,zero pending poses or reviews.
