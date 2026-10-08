# Employee-first character batch5 coverage audit

Recommended batch: **12 radiologists, 2 APPs, 2 executives and 4 patients**. The four patient slots are 1 male aged 30-44; 1 female aged 45-64; 1 male aged 45-64; 1 female aged 65+. This is art preparation, not runtime integration or clinical approval.

The current local catalog contains 225 identities, 61 staff designs, 116 adult patients and 1830 registered assets. Every employee has standing and seated S/E/W/N; all 488 employee source/runtime hashes, 244 seated contact anchors and all 1830 registered PNG hashes/dimensions/RGBA types were validated. Exact IDs, eight poses and paths/hashes are in the JSON receipt. The 30 existing founder designs are also complete and preserved; Level 0 introduces no employee art gap.

| Role / stable ID | Unlock level | Nominal max | Finite built-room ceiling | Eligible art | Art gap |
|---|---:|---:|---:|---:|---:|
| Receptionist / `staff.receptionist` | 1 | 1 | 1 | 4 (4 dedicated) | 0 |
| Imaging Technician / `staff.imaging_technician` | 1 | 3 | 3 | 3 (3 dedicated) | 0 |
| Peri-op Nurse / `staff.periop_nurse` | 2 | 2 | 6 | 7 (6 dedicated) | 0 |
| Endoscopy Nurse / `staff.endoscopy_nurse` | 2 | 2 | 5 | 6 (5 dedicated) | 0 |
| Endoscopist / `staff.endoscopist` | 2 | 2 | 5 | 5 (5 dedicated) | 0 |
| Phlebotomist / `staff.phlebotomist` | 2 | 2 | 3 | 3 (3 dedicated) | 0 |
| EVS Worker / `staff.evs_worker` | 2 | 2 | 10 | 10 (10 dedicated) | 0 |
| GLP-1 NP / `staff.glp1_np` | 2 | 10 | 10 | 10 (10 dedicated) | 0 |
| Laboratory Technician / `staff.laboratory_technician` | 3 | 2 | 2 | 2 (2 dedicated) | 0 |
| Surgeon / `staff.surgeon` | 3 | 2 | 2 | 2 (2 dedicated) | 0 |
| OR Nurse / `staff.or_nurse` | 3 | 2 | 2 | 2 (2 dedicated) | 0 |
| Pharmacist / `staff.pharmacist` | 3 | 2 | 2 | 2 (2 dedicated) | 0 |
| Repair Person / `staff.repair_person` | 3 | 2 | 1 | 2 (2 dedicated) | 0 |
| Radiologist / `staff.radiologist` | 3 | 4 | 16 | 4 (4 dedicated) | 12 |

The hiring reducer uses actual built-room slots, rather than nominal `maximumEmployees`. All 13 non-radiologist finite ceilings are covered with dedicated, disjoint art pools. The only shared identity, `mixed-20260910-nurse-01`, is spare for both peri-op/endoscopy pools; simultaneous assignments do not depend on using it twice. Core sources: `packages/balance-config/src/prototype-balance.ts:610`, `packages/game-domain/src/room-capacity.ts:7`, `packages/game-domain/src/reducer.ts:9844`.

Radiology is the concrete gap: current `room.reading` allows four rooms, and each grants four radiologist seats. That is 16 potential slots versus 4 existing identities, despite the role's nominal maximum 4. Parent selected 12 additional distinct radiologists to cover the literal finite ceiling, preserving the original four. The newer October 7 owner timing decision places this room/role at Level 3; it supersedes the older Level 4 roadmap text. `packages/balance-config/src/prototype-balance.ts:586`, `packages/balance-config/src/prototype-balance.ts:834`, `packages/game-domain/src/room-capacity.ts:22`, `docs/features/diagnostic-timing-future-design.md:45`.

APP is an accepted Level 4 role, referenced as `staff.app` by planned clinic/pediatric/wound/ostomy services and provider fallbacks, but it has no role definition or capacity yet. Executive is an accepted Level 5 display role with no approved stable runtime ID or capacity. Two new designs each are editorial reserves. They cover those visual jobs without asserting sufficient designs for every undecided future opening. APP: `docs/features/facility-levels-and-clinical-release-points.md:176`, `packages/balance-config/src/service-income-catalog.ts:55`, `packages/balance-config/src/prototype-balance.ts:1444`. Executive: `docs/features/facility-levels-and-clinical-release-points.md:194`, `packages/balance-config/src/room-upgrades.ts:96`.

Existing NP art can visually serve APPs: inspected `gs026-employee-018` and `gs022-new-employee-020` have short clinical jackets, sage shirts, olive trousers and blank badges. All 10 NPs are currently role-locked to GLP-1, and all 10 can be employed concurrently by the configured five suites. Sharing their eligibility later would therefore not add independent parallel identity capacity; the dedicated APP reserve is useful. No reassignment occurred.

MRI retains the generalized imaging technician. Current planned pediatric and wound/ostomy rows use APP; no additional specialty job is invented. Pharmacy uses pharmacists. Retail/amenity rows do not evidence barista, gift clerk, trainer or gardener jobs. Hospital OR/floor/ED-trauma/ICU progression remains deferred without numeric levels or staffing design. Exclusions and citations are in the JSON.

Current question snapshot: 311 concepts, 934 cases, 1215 decision nodes, 3148 demographic profile rows; 36 employee discussions excluded, leaving 898 routine patient cases. The profile-aware Level 3 first-unseen model preserves explicit age/sex overrides and current fallback completion; it does not use the obsolete case-only female estimate.

| Sex | Age band | Modeled encounter share | Current designs | Share per design |
|---|---|---:|---:|---:|
| Female | 18-29 | 2.83% | 9 | 0.31% |
| Male | 18-29 | 1.57% | 9 | 0.17% |
| Female | 30-44 | 17.60% | 21 | 0.84% |
| Male | 30-44 | 14.34% | 14 | 1.02% |
| Female | 45-64 | 21.57% | 21 | 1.03% |
| Male | 45-64 | 18.19% | 18 | 1.01% |
| Female | 65+ | 12.05% | 12 | 1.00% |
| Male | 65+ | 11.85% | 12 | 0.99% |

Four new patients reduce the most pressured current cells. These are visual age briefs, not clinical constraints or runtime weights. Actual FSRS due dates, occupied concepts and occupancy/LRU rotation change encounter/repetition behavior. There are 0 authored under-18 profiles; the existing 12 future-only children already reserve pediatric art. No new pediatric designs are required by this current content snapshot.

Validation: 25184 actual demographic completions; 128 actual selector checks across operational Level 0–3 ceilings; 261 source hashes unchanged during the audit. No runtime, clinical, save, art or planning files were changed. All report paths are repository-relative; no question prose/private input is copied.

Reproduce from repository root:

```text
node tools/character-mapping/future-roster20-v5/analysis/coverage-audit.mjs --check
```

Use `--write` only after reviewing source drift; prior report mismatches fail without being overwritten. Vite runs in middleware mode, with no network listener or player save access.
