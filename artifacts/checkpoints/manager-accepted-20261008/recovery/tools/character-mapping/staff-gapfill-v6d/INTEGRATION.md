# Accepted v6d runtime integration

Owner-delegated manager acceptance on 2026-10-08 includes the derived navy
correction for `staff-gapfill-v6d.008`. The separate `owner-approval.json` binds
all exact accepted sources, 112 corrected pose hashes, 56 authored contacts,
palette correction evidence and manager browser results. The original blue
native source and all generation/review tools and history remain frozen.

The immutable integration intake is captured after accepted v6c integration,
before any v6d runtime/test edits: 304 identities / 2,462 assets / 179 patients.
Promotion appends 14 staff identities / 112 byte-exact PNGs, yielding 318 / 2,574.
The prior v6c runtime receipt is also preserved byte-exactly in this intake.

Each consecutive pair belongs only to its single listed role:

| Identity suffixes | Role | Resulting role pool |
| --- | --- | ---: |
| 001–002 | staff.imaging_technician | 5 |
| 003–004 | staff.phlebotomist | 5 |
| 005–006 | staff.laboratory_technician | 4 |
| 007–008 | staff.surgeon | 4 |
| 009–010 | staff.or_nurse | 4 |
| 011–012 | staff.pharmacist | 4 |
| 013–014 | staff.repair_person | 4 |

```powershell
node tools/character-mapping/staff-gapfill-v6d/validate-approved-batch.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-runtime-integration.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-promotion-rerun.mjs
python tools/character-mapping/staff-gapfill-v6d/audit-scoped-changes.py
```

The wrapper runs the original roster, placement, worker review, all-catalog and
independent raw navy correction validators. A process-local loader extends only
their historical allowed-ID seam after strict current runtime verification;
original tools and historical review labels stay byte-identical. The wrapper's
last line reports current manager-approved runtime status. Direct historical
generation baseline commands retain their old allowed-ID limits.

The promoter refuses unrelated registry/catalog/provenance changes or unequal
existing destination bytes. It never writes on a successful rerun. Staff use
only explicit `eligibleStaffRoleDefinitionIds` membership. Compatible current
and departing employee saved IDs stay with unchanged selection/persistence code;
no old employee is reassigned to a new look.

Exact output/command/exit/hash receipts and immutable intake snapshots are in
`artifacts/character-statics/staff-gapfill-v6d/`. No Git, deployment, clinical,
art-editing, reducer/UI or browser-storage changes. Owner pathway remains
`START_GAME.cmd` → exactly `http://127.0.0.1:4173` in the same persistent profile.
