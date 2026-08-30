# Implement Level 2 Expanded Outpatient / Endoscopy

## Goal

Extend the existing Stitchin' Time prototype from playable Levels 0-1 through a coherent, playable Level 2 Expanded Outpatient / Endoscopy loop without restarting the architecture, changing approved clinical meaning, or implementing Level 3.

## Requirements

- Preserve the accepted Level 0-5 unlock table and make Level 2 playable.
- Unlock at Level 2: Ultrasound Room, CT Suite, Phlebotomy Station, Environmental-Services Closet, Endoscopy Room, Peri-op/Recovery Room, Training Room, Coffee Kiosk, and GLP-1 Telehealth Suite.
- Unlock at Level 2: Peri-op Nurse, Endoscopy Nurse, Endoscopist, Phlebotomist, EVS Worker, and GLP-1 NP.
- Preserve Founder physician coverage for endoscopy while enforcing one Founder location/task at a time.
- Preserve the generalized Imaging Technician for X-ray, ultrasound, CT, and later MRI.
- Separate imaging acquisition from interpretation. Use an external read delay until the later Radiologist/Radiology Reading Room capability exists.
- Keep Level 2 phlebotomy as onsite collection plus send-out testing, not an in-house laboratory.
- Keep the floating manual GLP-1 consultation until the suite is both built and staffed; then automate bounded Level 2 consultations through the GLP-1 NP.
- Activate only clinician-approved `release.l2.endoscopy` content and retain the same concept/question meaning, source labels, and stable IDs.
- Preserve campaign-scoped FSRS, one primary concept per scored decision, corrective-forward intermediate decisions, current saves, and the approved visual system.
- Stop progression at a completed Level 3 preview; do not implement Level 3 rooms, staff, clinical release, or gameplay.

## Implementation-time prototype defaults

These are centralized, tunable YELLOW balance/operational defaults selected under the owner's authorization to proceed autonomously. They do not create clinical claims.

### Level 2 completion preview

- 300 current-level Learning XP.
- Rolling/effective patient satisfaction above 90%.
- A functioning Endoscopy Room.
- A functioning Peri-op/Recovery Room.
- A Peri-op Nurse.
- An Endoscopy Nurse.
- An Endoscopist.
- Manual Level Up remains unavailable because Level 3 is a locked preview; the goals panel should make the completed-preview state clear.

This gate intentionally lets the Founder provide endoscopy early in Level 2, then requires dedicated physician capacity before the future ASC expansion. Ultrasound, CT, phlebotomy, EVS, training, coffee, and GLP-1 automation remain optional investments rather than redundant gate items.

### Centralized construction defaults

| Buildable | Cost | Hourly upkeep | Footprint |
| --- | ---: | ---: | --- |
| Ultrasound Room | $950 | $16 | 3x3 |
| CT Suite | $1,600 | $26 | 4x4 |
| Phlebotomy Station | $550 | $9 | 3x2 |
| Environmental-Services Closet | $475 | $6 | 2x2 |
| Endoscopy Room | $1,450 | $24 | 4x3 |
| Peri-op/Recovery Room | $900 | $16 | 4x3 |
| Training Room | $650 | $8 | 3x3 |
| Coffee Kiosk | $500 | $5 | 2x2 |
| GLP-1 Telehealth Suite | $1,200 | $12 | 3x2 |

Room upgrade values follow existing centralized percentage/capacity patterns and remain tunable. Imaging rooms retain the accepted patient-facing door plus direct shared-wall/internal-door Imaging Control requirement.

### Centralized staffing defaults

| Role | Hiring cost | Hourly salary | Pilot maximum |
| --- | ---: | ---: | ---: |
| Peri-op Nurse | $450 | $34 | 2 |
| Endoscopy Nurse | $500 | $36 | 2 |
| Endoscopist | $900 | $60 | 2 |
| Phlebotomist | $350 | $28 | 2 |
| EVS Worker | $280 | $24 | 2 |
| GLP-1 NP | $600 | $40 | 5 |

### Operational defaults

- Onsite ultrasound acquisition: 45 facility minutes plus a 30-minute external interpretation phase.
- Onsite CT acquisition: 60 facility minutes plus a 45-minute external interpretation phase.
- Offsite ultrasound and CT routes remain available and slower than their functional onsite alternatives.
- Phlebotomy collection: 15 facility minutes onsite, followed by the existing send-out laboratory interval.
- Endoscopy workflow: 30-minute preparation, 45-minute procedure, and 45-minute recovery for the first playable operational pass. These are editorial simulation values, not clinical claims.
- GLP-1 NP automation: one $25 consultation per staffed suite every 60 facility minutes, no XP or FSRS. Capacity is bounded by staffed suites and remains tunable.
- EVS automation prioritizes visible litter and low-cleanliness rooms without creating infection mechanics.
- Training Room and Coffee Kiosk provide modest, centralized morale/efficiency benefits only.

## Constraints and non-goals

- Do not invent, broaden, or clinically reinterpret question content.
- Do not admit any future Hospital, ED/Trauma, ICU, Level 3, Level 4, or Level 5 variant.
- Do not use proprietary clinical sources or add live AI/web calls.
- Do not implement the full Clinical Content Workbench.
- Do not implement Level 3 rooms, staff, QI systems, hospital gameplay, inspections, prestige, or final victory.
- Do not redesign the approved Level 1 visual direction.
- Do not break older frozen encounters, campaigns, or campaign-scoped learning histories.
- Do not commit, push, deploy, or update `main` without a separately reviewed release step.

## Relevant repository state

- At plan start, branch `beta` was clean at `cf7900101563786720bb2520840f0cccecbd7297` and matched the then-current Pages checkpoint.
- Domain and balance schemas currently hard-limit facility levels, room/staff unlocks, and active runtime clinical cases to Levels 0-1.
- `SYNTHETIC_CLINICAL_RELEASE` includes only currently active reviewed concepts/cases; several clinically approved Level 2 packages remain in approved-data backlogs with `release.l2.endoscopy` and `approvedForRuntime: false` solely because the Level 2 runtime did not yet exist.
- The facility renderer and build/staff UI already use separate room objects, explicit doors, deterministic character art, reusable room art branches, and responsive panels.
- Existing save schema version 6 can remain compatible if Level 2 is added as an accepted value; a migration is required only if new persisted operational state cannot be derived safely.

## Milestones

1. Extend domain/balance/clinical schemas and progression to Level 2, define centralized Level 2 rooms/staff/gate, preserve Level 0-1 behavior, and add focused domain tests.
2. Implement Level 2 operational services: imaging acquisition/interpretation, phlebotomy/send-out, endoscopy staffing and Founder bottleneck, EVS support, Training/Coffee effects, and staffed GLP-1 automation.
3. Convert and activate only the approved Level 2 encounter blueprints needed for a coherent content pool, preserving exact approved variants and excluding all future-setting variants.
4. Extend the build/staff/goals/facility UI and original pixel-art branches for all visible Level 2 rooms and employees, plus concise Level 2 guidance/alerts.
5. Run full unit/integration/type/build/browser validation, exercise an upgraded old save and a new campaign through Level 2, capture desktop/phone evidence, and create a reviewed `beta` checkpoint.

## File or module ownership

### Milestone 1 Terra ownership

- `packages/balance-config/src/schema.ts`
- `packages/balance-config/src/prototype-balance.ts`
- `packages/balance-config/src/*.test.ts` when tightly relevant
- `packages/game-domain/src/types.ts`
- `packages/game-domain/src/selectors.ts`
- `packages/game-domain/src/reducer.ts` only for Level 2 progression/error wording required by this milestone
- `packages/game-domain/src/persistence.ts`
- focused tests under `packages/game-domain/tests/`
- this ExecPlan's Progress, Discoveries, and Exact next action only

Later milestone ownership will be assigned sequentially after Sol reviews the preceding diff.

## Acceptance criteria

- A qualifying Level 1 campaign can advance once to Level 2; XP resets once and no money, rooms, staff, patients, FSRS histories, or timers duplicate.
- Existing Level 0/1 saves load without loss; a saved Level 2 state round-trips.
- Every approved Level 2 room/staff role unlocks only at Level 2 and uses centralized costs/capabilities.
- The Level 2 goals panel tracks the selected 300 XP, satisfaction, core rooms, and three staff roles while clearly indicating Level 3 remains locked.
- Imaging rooms retain explicit accepted access validation.
- Functional services use capability and staff capacity rather than room presence alone.
- Only named-clinician-approved Level 2 cases can enter the routine pool, and future-setting variants remain excluded.
- The Founder cannot perform concurrent physician/facility interactions.
- The staffed GLP-1 suite removes the floating manual action and automates only the bounded nonlearning cash stream.
- All existing tests pass, focused Level 2 tests pass, typecheck/build pass, and desktop/phone browser flows remain usable.

## Validation

- Focused balance schema/progression/persistence tests after Milestone 1.
- Focused facility-service, staffing, automation, and clinical-admission tests after Milestones 2-3.
- UI component tests plus Playwright Level 2 build/staff/goals/encounter walkthrough after Milestone 4.
- `npm run typecheck`
- `npm test`
- `npm run build:pages`
- `git diff --check`
- Desktop and phone screenshots from the actual application.

## Progress

- [x] Inspected accepted Level 2 decisions and current Level 0-1 implementation seams.
- [x] Selected centralized, reversible prototype defaults for the previously deferred Level 2 implementation details.
- [x] Milestone 1: Level 2 schemas, definitions, progression, persistence, and focused tests.
- [x] Milestone 2: Level 2 service/staff/automation simulation, including diagnostic routes, bounded endoscopy capacity, EVS, Training/Coffee, and staffed GLP-1 automation.
- [x] Milestone 3: approved Level 2 clinical content activation.
- [x] Milestone 4: Level 2 UI, facility art, guidance, and alerts.
- [x] Milestone 5: full validation and screenshots; the reviewed working-tree checkpoint remains local pending a separately authorized Git action.

## Discoveries

- The accepted source of truth deliberately deferred exact Level 2-5 advancement gates and balance until implementation, so choosing tunable Level 2 defaults does not reopen a foundational decision.
- The current schemas encode Level 1 as a literal maximum in several locations; the Level 2 extension must be systematic rather than a UI-only unlock.
- Several approved Level 2 packages are stored as exact reviewed question variants and encounter blueprints rather than runtime `SyntheticClinicalCase` objects. Activation therefore needs a deterministic adapter or explicit runtime cases that preserve those records without generating new clinical facts.
- Level 2 clinical capability cannot be inferred from facility level alone: `capability.endoscopy` and `capability.periop_recovery` must come from functioning rooms, while staff capacity governs operational throughput.
- The existing facility-door validator already applies the patient-facing-door plus direct Imaging Control connection rule to `room.ultrasound` and `room.ct`; Milestone 1 adds definitions and focused coverage without duplicating spatial logic.
- Save schema version 6 remains compatible: facility level is a persisted scalar and Level 2 introduces no new persisted operational state. Version-6 loading now accepts Level 2 while retaining Level 0/1 compatibility.
- Milestone 1 validation passed on 2026-08-25: focused Level 2 progression/facility tests (10 tests), full game-domain suite (21 files, 109 tests), direct balance-config Vitest file (2 tests), and workspace typecheck.
- Milestone 2A adds data-driven room/staff resource requirements and frozen editorial route phases. Onsite ultrasound is 45+30 minutes and CT is 60+45 minutes; selected slower offsite fallbacks are 150 and 180 minutes respectively. These are prototype timing values, not clinical turnaround claims.
- Review correction: X-ray no longer bypasses access validation. The legacy timing fixture now mirrors the validated Front Desk/hallway/Exam/Imaging Control/X-ray graph and asserts facility access before testing the route.
- Milestone 2A live-service coverage uses local, unapproved test cases cloned from the legacy X-ray routing fixture and a separately validated domain context. No clinical content was activated or changed.
- Frozen phased service timing is an authored end-to-end interval: ultrasound, CT, and phlebotomy remain 75/105/75 facility minutes even when patient travel is simulated. Travel must fit within the resource-bound acquisition/collection phase; return may overlap external interpretation/send-out processing, but it cannot begin before the final resource-bound phase finishes.
- Resource availability must follow frozen phase boundaries rather than result delivery. The shared imaging technician and room can accept a new acquisition after the acquisition phase while the earlier encounter remains in external interpretation.
- Milestone 2A validation passed on 2026-08-25: timing encounter file (17 tests), full game-domain suite (21 files, 110 tests), direct balance-config Vitest file (3 tests), workspace typecheck, and `git diff --check`.
- The endoscopy route uses the same data-driven service contract as diagnostic services: two room/nurse reservations, three frozen resource-bound editorial phases (30/45/45 facility minutes), and a frozen selected provider reservation. The selector prefers an available operational Endoscopist and otherwise freezes Founder coverage; it does not derive the route from a case ID or facility level.
- `getCurrentCapabilities` now excludes room and staff capability grants from unreachable or access-invalid room instances. Existing Level 1 clinical-admission coverage was made explicit with a reachable Minor-Procedure Room door instead of depending on an invalid test layout.
- Schema-version-6 normalization round-trips an optional frozen provider reservation. Legacy pending results without it normalize to `null`, so they keep their prior service behavior.
- `capability.endoscopy` is now the composite reachable-room/staff operational capability used by approved Level 2 records; the Endoscopy Room itself intentionally grants no standalone endoscopy capability. Route schema validation also rejects nonempty timing-phase arrays unless their durations exactly equal the frozen route ETA.
- Support automation remains entirely operational: staffed GLP-1 capacity is a bounded minimum of accessible suites and assigned NPs, EVS state is persisted employee work rather than an event stream, and Training/Coffee change only centralized workload/morale values. None of these paths create a clinical encounter, XP, FSRS review, satisfaction change, or clinical claim.
- Version-6 environment normalization derives absent support-operation fields from the current facility tick. An unavailable GLP-1 capacity clears its schedule; a later return starts a fresh full interval, preventing both retroactive accrual and refresh duplicates.
- Support-operation review corrections: EVS assignment now checks a reachable, valid home-room assignment without requiring the worker to remain physically in that room; all active EVS targets reserve their IDs; and unreachable rooms cannot become EVS cleaning targets.
- GLP-1 automation persists one next-payout tick per operational suite. Capacity growth starts a new full interval rather than multiplying an older due tick, shrinkage drops excess slots, capacity zero clears the schedule, and the legacy scalar is retained as the earliest-tick compatibility summary for v6 normalization.
- Coffee applies its centralized bonus once on the first tick with a reachable kiosk in a facility day (including a kiosk made operational mid-day), records that day durably, and never marks an absent or inaccessible kiosk as applied. Training remains a reachable-capability-only routine workload contribution.
- Milestone 2 support validation passed on 2026-08-25: focused `level-two-support-operations.test.ts` (4 tests), full game-domain suite (23 files, 118 tests), direct balance-config Vitest suite (4 tests), workspace typecheck, and `git diff --check`.
- Milestone 3 materializes exact clinician-approved `release.l2.endoscopy` variants through `approved-data/level-two-runtime.ts`; it preserves authored IDs, answer labels, stems, explanations, claim-derived source labels, and named-clinician approval labels without generating clinical wording. The release remains `synthetic_unapproved_prototype`.
- Activated: both colonic-lipoma direct blueprints, mechanically split from their exact approved context and question sentences; all ROW038, ROW039, and ROW040 Level 2 blueprints; ROW042 Level 2 endoscopy variants only; ROW049 Level 2 stable nonbleeding-visible-vessel variants only; and the approved ROW111 two-step EUS/ERCP-to-management blueprint. Future Hospital OR/Floor variants, colonic reverse/options-only variants, and the unschedulable ROW111 final-node workup-only blueprint remain excluded.
- The clinical schema now permits Level 2 and approved clinic/endoscopy/peri-op settings and carries an optional exact `currentUpdate` for later scored decisions. The missing EUS/ERCP balance route is an authored 480-minute editorial interval with 30/45/45 resource phases and 360 nonresource processing; approved displayed alternatives use the same editorial return interval offsite.
- Milestone 3 validation passed on 2026-08-25: focused clinical Level 2 suite (8 files, 49 tests), full clinical-content suite (35 files, 234 tests), full game-domain suite (23 files, 118 tests), direct balance-config Vitest file (5 tests), workspace typecheck, and `git diff --check`.
- Milestone 3 review correction: runtime admission is now an explicit per-package blueprint allowlist, never a broad `release.l2.endoscopy` filter. Materialization fails closed on an unknown selected blueprint, non-Level-2 selected blueprint, unknown evidence claim, claim without a supporting source, missing runtime setting/capability metadata, or overlong source label. Focused tests compare the exact admitted case/variant sequence and each node's authored stem, answer IDs/labels/correctness/service ID, explanation, and concept.
- Source labels now derive from supporting source organization/journal, title, and year, plus the named clinician approval label. Learning summaries retain every distinct exact node explanation in multi-decision cases. Backlogs distinguish all-active Level 2 packages from partial packages and explicitly enumerate active and excluded future/one-patient-ineligible blueprints.
- Correction validation passed on 2026-08-25: focused adapter test (4 tests), full clinical-content suite (35 files, 235 tests), full game-domain suite (23 files, 119 tests), direct balance-config Vitest file (5 tests), workspace typecheck, and `git diff --check`.
- Record-level correction: both approved direct colonic-lipoma blueprints are active. A fail-closed four-variant exact split table separates each authored contextual prefix from its final question sentence; concatenation reconstructs the original source stem exactly. Focused adapter coverage is now 5 tests; full clinical-content validation is 35 files and 236 tests.
- Milestone 4A UI integration uses the domain progression requirements directly for the Level 2 300-XP, satisfaction, room, and staff gate. Level 3 remains a non-actionable preview. The chart renders only the authored optional `DecisionNode.currentUpdate` at the currently active later decision; split-stem context is no longer used as a surrogate update.
- GLP-1 manual consultation visibility is keyed to `getOperationalGlp1AutomationCapacity`, so a merely built, inaccessible, or unstaffed suite cannot hide the founder action. The replacement status reports staffed-suite capacity and the persisted next payout tick without introducing rewards or learning state.
- Pixel role styles are persisted visual identity, not clinical or staffing capability data. The new Level 2 role styles are normalized during save load and deterministically rendered through the shared map/avatar/QA art path.
- Milestone 4A review correction: compact Level 2 operational guidance is capability-derived, so an inaccessible room or unreachable employee cannot be presented as functional. The same stable registry-backed guidance rows appear in the feed without attention markers and retain their build/staff-role action targets. Legacy Level 0-1 split-stem chart updates remain visible when no authored `currentUpdate` exists.
- Final M4A hygiene correction: setup guidance now uses facility-work room operation and stable employee home-room assignment rather than momentary map location/capability snapshots. A staff member walking to a valid task remains assigned; inaccessible machinery routes to Build Mode, while missing or unassigned staff routes to its hiring role. Goals remain progression-only; Alerts and Events is the single operational-guidance surface.
- Milestone 4B gives every canonical Level 2 room an explicit non-fallback fixture branch, its own floor treatment, and a distinct catalog icon. The GLP-1 branch uses the canonical `room.glp1_telehealth_suite` ID; it intentionally has no `room.glp1_suite` shorthand. Fixtures remain separate pixel-native sprites and retain existing floor-contact depth sorting, cutaway walls, and room click targets.
- Milestone 4B validation passed on 2026-08-25: player Vitest suite (38 files, 187 tests), workspace typecheck, and `git diff --check`. Focused coverage asserts all nine exact canonical room IDs have nonempty explicit fixture sets and different non-fallback catalog icons.
- Milestone 5 integration slice (Terra) adds a persisted, reload-backed operational Level 2 browser fixture with exactly one instance of each canonical Level 2 room, retained Level 1 rooms (including Receptionist/Imaging Technician), explicit nonoverlapping public hallway/door routing, and dedicated direct control-room doors for ultrasound, CT, and X-ray. Browser coverage runs the production deserialize/access selector and requires valid/no-issue/no-unreachable state before capture. It exercises a real Level 1-to-2 Level Up once, checks frozen encounters, staff/room IDs, timing, learning state and cash preservation plus duplicate-prevention after reload, verifies manual GLP before suite installation and staffed automation replacement afterward, exact build/staff surfaces, completed endoscopy/peri-op/staff goals, and captures `level-two-facility-desktop.png`, `level-two-build-mode-desktop.png`, and `level-two-phone.png` from the running app without the pause overlay.
- Milestone 5 focused domain persistence coverage round-trips a Level 2 active endoscopy pending result with provider and room/nurse reservations plus a GLP payout schedule, advances 60 facility ticks, and checks the reservation remains singular, one exactly-$25 cash payout occurs (with financial posting suppressed in the isolated fixture), the next timer is retained, and level remains 2. Validation on 2026-08-25: game-domain 24 files/121 tests passed; player 38 files/187 tests passed; focused Playwright desktop run passed (2 tests); workspace typecheck and `git diff --check` passed.
- Documentation reconciliation now records local playable Levels 0-2, Level 3 locked preview, the centralized Level 2 gate, all nine room and six staff unlocks, bounded reachable staffed GLP-1 automation, editorial service timings, and the Level 2 allowlist/prototype-release boundary. Historical changelog and approval references remain historical rather than being rewritten.
- Final acceptance validation passed on 2026-08-25: `npm test` completed 120 files/751 tests; `npm run build:pages` passed workspace typechecking, the Vite production build, and `/GamifySurgery/` asset verification; the complete Playwright run passed all 61 applicable browser scenarios with 63 intentional viewport skips and no failures; a final standalone workspace typecheck and `git diff --check` also passed.
- The final browser review repaired stale test assumptions without changing gameplay: deterministic visual fixtures no longer wait for a live arrival, generated tutorial choices are selected from their frozen case rather than obsolete labels, long physical service returns have explicit test time budgets, and Build Mode focus is verified through current patient-guidance targeting rather than suppressed construction-history events.

## Exact next action

The Level 2 implementation is ready for the owner's local walkthrough on `beta`. No commit, push, deployment, or `main` update was performed by this plan; any repository checkpoint or Pages release remains a separate reviewed action.
