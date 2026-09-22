# Patient/public20 cardinal stills — 2026-09-18

## Deliverables
Twenty approved patient/general-public identities, gs022-new-person-001 through
020, now have 160 local transparent PNG stills: standing and seated South,
East, West and North for each character. The 20 original approved South/front
PNGs are reused byte-for-byte; 140 missing views were generated with built-in
ImageGen. Generated South cells serve only as scale references and are excluded
from the final 160.

- Package: artifacts/character-statics/patient-public20-statics-v1/manifest.json
- Final PNGs: artifacts/character-statics/patient-public20-statics-v1/characters/<id>/
- Visual proofs: artifacts/character-statics/patient-public20-statics-v1/proofs/<id>/
- Sources, exact prompts, tool provenance and frozen ledgers: tools/character-mapping/patient-public20-statics-v1/
- Plan: docs/execplans/patient-public20-cardinal-statics.md

The current user's confirmation that these characters were approved is recorded
in approvals/patient-public20-front-concepts-user-approval-v1.json within the
new package. It binds all 20 existing front hashes. Historical pending/candidate
labels in the read-only source intake remain unchanged.

## Production and review
All final canvases are 160×320 with body axis 80 and floor 287. East and West
are full 90-degree profiles. Original civilian clothing, hairstyles, accessories
and age cues are retained. No staff badges, chair props or clipboard poses were
added. Scaling uses one uniform whole-body transform, with no segmented edits.

Each seated pose has an authored chair-contact anchor. For dresses, skirts and
long coats, the anchor describes the inferred posterior support plane beneath
the clothing rather than the garment hem. These anchors still require actual
runtime integration with chair geometry before gameplay use.

Parent reviewed all 20 native-light sheets and enlarged seated proofs. Terra
independently inspected all 20 native-dark sheets, all 40 game-size light/dark
proofs and 12 selected enlarged proofs; no visual blockers were found.
Owner front/identity approval is recorded separately from parent production QA.

## Delegation and validation
Sol coverage_completion implemented reference extraction, packaging, manifests,
proofs and validators. Terra remaining_patient_seats generated 001–002;
employee_badge_repairs generated 003–007; public_stills_08_14 generated 008–014
and performed the independent visual audit; static_inventory generated 015–020
and audited intake/tooling. Parent retained art direction, contact authorship,
acceptance, actual-code review and independent verification. No qualifying
implementation milestone was left undelegated.

Validation commands:
- node tools/character-mapping/patient-public20-statics-v1/validate-patient-public20-references.mjs
- node tools/character-mapping/patient-public20-statics-v1/validate-patient-public20-statics.mjs --complete
- node --check for each new .mjs tool

The reference validator verifies 20 exact source-crop RGBA matches and approval
bindings. Strict completion requires 20 source/prompt/provenance triples, 160
populated slots, 140 frozen accepted generated poses and zero pending reviews.
It also verifies source-to-output contact transforms, demographic/spec retention,
and a frozen receipt hash. Partial states report PARTIAL_VALID explicitly.

Parent independently checked all 894 previously completed PNGs: GS018's 704
baseline plus 30 clipboard poses and the 160 employee stills. All match their
original manifests/frozen ledgers. The new preservation guard additionally
covers the 20 patient/public approved originals, totaling 914 preserved files.

## Delivery boundary
Local artwork only. No runtime IDs were invented, no clinical content changed,
and no staging, commit, push or deployment was performed. Preserve all other
work in the shared repository. Say "push to GitHub" to request a scoped backup.

Final independent validation: PASS_COMPLETE — 20 identities, 160 populated
stills, 140 accepted new poses, 20 preserved fronts, zero pending review or
missing poses, and all 914 preservation checks passed. All 80 seated-contact
anchors were visually accepted. Reference, syntax and scoped whitespace checks
also passed.
