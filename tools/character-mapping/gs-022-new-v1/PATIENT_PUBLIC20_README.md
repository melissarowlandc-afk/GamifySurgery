# GS-022 patient and general-public 20

This package is isolated from employee concepts and runtime catalogs. It reserves `gs022-new-person-001` through `gs022-new-person-020` for new visual identities only.

The package is populated from frozen `design-specs.json`, `demographics/question-bank-demographics.json`, four exact prompts, and four transparent source sheets. It uses alpha-projection bands and one 0.375 uniform scale/translation per source character. The owner approved all 20 visual identities and front concepts on 2026-09-18; the immutable receipt preserves that scope. The other 140 pose slots remain pending and runtime remains disabled.

Run `node tools/character-mapping/gs-022-new-v1/validate-patient-public20-packaged.mjs`. The validator is read-only: it checks the stored receipt and five-proof ledger, source/prompt/spec/evidence hashes, source-RGBA reconstruction, dimensions, anchors, frozen per-record demographics, quotas, and pose status.
