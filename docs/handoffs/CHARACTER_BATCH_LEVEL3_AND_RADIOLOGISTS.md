# Current result: capped surgeons and playable Level 3 — October 4, 2026

The owner subsequently authorized scrub caps and full runtime Level3 integration.
That work is complete locally. The historical pre-integration review below is
retained for provenance and is superseded by this section.

Both surgeons (005 teal cap,006 navy cap) have all8 capped standing/seated views.
All32 identities/256 views are now registered as level3-roster-v2.001–032. Total
catalog185 identities/1510 assets; original153/1254 unchanged. Six adult patients
are eligible (76 total);10 new staff appearances supply surgeon, OR nurse, lab
technician, pharmacist and repair-person roles. Four radiologists and12 pediatric
appearances are registered but future-gated. Pediatric clinical content was not
added. Existing frozen/returning identities and compatible unused-first/LRU patient
selection remain preserved; finite compatible pools can eventually repeat.

All7 GS015 approved Level3 rooms are promoted byte-exact (82 assets): Ambulatory OR,
Laboratory, Pharmacy, Maintenance Workshop, Staff Break Room, Surgeon's Office,
Vending. Level3 is playable after the original Level2 gate. Includes full scheduled
OR flow, deliberate Lab work queue, retail, breaks with7 reserved chair IDs,
maintenance/repair, and single-seat nonclinical QI review. Office supports2 surgeon
employees, one concurrent QI review; workshop supports1 repair employee. New role
hire caps never exceed their available unique still pool. Schema9 loads older saves.

Terra surgeon_caps produced cap edits; Terra roster_runtime_integration registered
assets and initial room promotion. Sol level3_implementation_map implemented domain,
Sol level3_room_integration completed renderer and E2E, and Sol
level3_support_ui_finish completed UI. Root inspected actual baseline-relative
changes and independently ran affected tests, asset checks, typechecks and build.
Final6 browser scenarios PASS, including real UI advancement/dispatch, reducer-built
rooms/hires, reload, OR completion, pharmacy/vending, repairs, seated stills and
compact controls. Root accepted screenshots. Full player576/579:3 older GS032
movement-test expectation/mock failures remain, with motion behavior unchanged.

Implementation/review records: docs/execplans/character-stills-then-level-three.md.
Evidence: artifacts/level3-implementation-20261004/e2e/.
Launch with START_GAME.cmd at http://127.0.0.1:4173 using the same browser profile.
Final QA used isolated127.0.0.1:5173/fresh storage. No owner saves or launchers changed.
Local checkpoint only; no push/deploy. Owner can request "push to GitHub".

---
# Complete character roster before Level 3

## Owner direction and current result

The owner requested20 new identities, then clarified that readiness includes
seated stills, pediatric coverage, the established game style, and fewer repeated
patients before implementing Level3. The resulting additive v2 art package has
32 identities and256 directional stills: four standing and four seated per person.

- 001–004: Severance-inspired Mark, Helly, Irving and Dylan radiologists.
- 005–014: two each of surgeon, OR nurse, laboratory technician, pharmacist,
 and repair person. These are visual alternatives, not approved staffing caps.
- 015–020: six adult patients filling younger visual roster gaps.
- 021–032:12 future pediatric appearances, four younger children, four older
 children and four teens, two girls and two boys in each group.

Package: artifacts/character-statics/level3-roster-complete-v2/.
Gallery: review/index.html. Paired overview:
review/owner-overview-stand-south-sit-east.png.
Native sources and exact tool inputs: sources/001 through sources/032.
Normalized160x320 pose PNGs and manifests: packages/001 through packages/032.
Contact boards: contact-review/. Actual South chair composites: placement-qa/.
Tooling: tools/character-mapping/level3-roster-complete-v2/.

The original standing-only20-person v1 remains preserved as historical material.
Use v2 for the complete eight-pose candidates. Root has reviewed every selected
native sheet, all128 seating contact values, all32 actual South chair composites,
and the paired overview. This is technical/visual QA; owner approval and runtime
asset registration remain pending. The art is not yet selectable during gameplay.

## Coverage and repeat selection

There are70 currently registered adult patient appearances. Integrating the six
new adults would produce76 and increase the young-adult and adult Female/Male
visual bands to at least nine each. The12 pediatric assets are future presentation
art only: the current856-case release has no explicit under18 case profiles.
No pediatric diagnoses, cases, demographic weights or clinical eligibility were
invented. Age-cohort artwork heights184/211/234px versus adult246px are editorial
scale decisions, not medical height claims. Infant/toddler art is not included.

Sol implemented compatible appearance reservation for visible encounter, ambient,
service and retail actors, plus unused-first then least-recently-used selection
from retained encounter history. This reduces repeats; finite compatible pools
can still repeat when exhausted. Departed external actors have no durable recent
history, but visible external actors reserve their appearance. Saved, returning
and frozen identities are preserved. No schema or clinical selection change.

Scoped runtime files: packages/game-domain/src/appearance.ts, reducer.ts,
ambient-pedestrians.ts, service-operations.ts, retail-operations.ts; new focused
coverage in tests/patient-appearance-rotation.test.ts. Pre-task dirty-file copies
are retained under v2/integration-baseline/. Never replace these files wholesale
from Git: they contain other active work.

## Delegation and validation

Terra complete_pose_artist produced the initial radiologist/staff full-pose
sources and younger-child pilot. Terra additional_pose_artist produced staff and
adult patients; Terra finishing_pose_artist completed remaining staff and child/
teen sheets. Terra batch_review_packaging built the normalization, galleries,
contact boards and browser QA. Sol source_provenance_audit implemented the repeat
selection changes and repaired chair-proof geometry. Sol final_roster_audit
repaired remaining provenance sidecars and owns final validator hardening.
Astra retained roster/scale decisions, reviewed actual source artwork and scoped
code diffs, requested clothing corrections, and checked all seating proofs.
Only tiny metadata integration corrections and review/planning artifacts were
handled directly by Astra; substantial execution was delegated.

Root independently passed79 focused tests across appearance, still catalog,
identity persistence, rotation, ambient, service and retail behavior. Domain
TypeScript, dependency-boundary and launcher checks passed. A worker broad domain
run encountered load-sensitive timeouts; the three affected files passed alone
(4/4,193/193,189/189); no assertion failure reproduced.

All32 native source sidecars pass independent exact prompt/tool argument,
reference ordering/hash, source/native/workspace byte and provenance checks.
The existing registry153identities and all1254 referenced assets were independently
verified unchanged. Native source PNGs are byte-exact. Derived GS026 extraction
and resampling may trim very faint alpha fringe; the final measurement found maximum clipped source alpha2/255 and border alpha1/255.
No alpha>=13 character pixels were clipped. Root accepted this measured faint-only
warning at report SHA256
1f5e03103be084b763a7cad2223c406ca180a23aa81cf7fadc4b60ca6c47899a.

FINAL PACKAGE VALIDATION COMPLETE (October4,2026): root independently passed
the hardened validate-roster.mjs --require-complete:32 identities,256 poses,
zero issues, original153 identities/1254 assets unchanged. Root independently
passed validate-placement-qa.mjs:32 diagnostics. Final rebuild preserved all256
derived pose hashes from the visually reviewed state. Isolated headless Chrome
at1280x900 and320x800 loaded all64 pose-proof images plus the overview with no
overflow, console/page errors or broken local links; root inspected the screenshots.
Native transparency warnings are measured explicitly rather than silently removed.
The stronger validator binds source/provenance/reference bytes, exact roster/category
sets, source-and-coordinate contact approval, derived poses, alpha report and runtime
baseline. A negative control rejected an unaccepted alpha-report hash as intended.

## Preservation and next action

No new art is runtime registered. No Level3 implementation, clinical authoring,
movement, owner server/browser/save, commit, push, merge or deployment changed.
GS032 motion remains7px/2Hz bounce, N/S1.5-degree/1Hz sway and120ms settle.
Canonical owner launch remains START_GAME.cmd -> http://127.0.0.1:4173 in the
usual persistent profile. START_PRIVATE_GAME.cmd ->
https://melissadesktop.taile197db.ts.net/ retains separate storage. No save moved.

Review the complete validated art with the owner, then
agree concrete Level3 unlocks, staff/capacity, operations, economy, goals,
clinical access and old-save behavior before delegated implementation. All seven
GS015 Level3 room designs remain approved; use exact final versions. Radiologist
art does not enable Level4. The combined task remains open; Level3 is not done.

Local-only checkpoint. Say **"push to GitHub"** for an audited backup.
Active plan: docs/execplans/character-stills-then-level-three.md.


