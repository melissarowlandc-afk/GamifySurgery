# Roadmap

Status: ACTIVE PROTOTYPE-FIRST PLAN under ADR 0021. The current working point is
a local Level 0/1 implementation candidate awaiting owner walkthrough.

Last updated: 2026-07-25

## Delivery rules

- Combine the educational and management loops in every playable increment.
- Use synthetic or conspicuously unapproved fixture content until Melissa
  supplies and clinically approves real material.
- Keep balance values and content outside game logic.
- Prefer a small playable loop and short feedback cycle over broad unfinished
  infrastructure.
- Complete security, publishing, cloud-save, and recovery work before outside
  testing, not before the first local walkthrough.
- Do not create paid infrastructure, deploy, or invite outside testers without
  the applicable owner authorization.

## Milestone 0: Reconcile and prepare

Status: COMPLETE ENOUGH FOR PROTOTYPING.

Completed:

- Reconstructed the accepted design and preserved superseded explorations.
- Recorded the foundational client, save, FSRS, identity, content, balance, and
  staged-delivery decisions.
- Created the private npm-workspace monorepo, shared validation, deterministic
  domain layer, and automated test structure.

The owner-controlled clinical authoring workbook and Clinical Content Workbench
remain a parallel future workstream. They are not blockers for evaluating the
small synthetic local slice.

## Milestone 1: First playable local loop

Status: IMPLEMENTED AND ABSORBED INTO THE LEVEL 0/1 CANDIDATE.

Completed:

- Founder clinic, facility clock, pause/resume, resource display, chart folders,
  clinical decisions, feedback, result delay, local save, and construction
- Grayscale full and compact desktop presentation; early phone-width regression
  coverage is retained, but phone-specific polish is deferred
- Protected introductory patient behavior, workload capacity, waiting-patient
  patience, and deterministic facility-time processing
- Grid placement for the first examination room

## Milestone 2: Coherent local Level 0/1 slice

Status: IMPLEMENTATION CANDIDATE BUILT; FIRST TESTER ONBOARDING FEEDBACK
INTEGRATED; THE NEXT WALKTHROUGH AND BALANCE ITERATION ARE THE CURRENT GATE.

Implemented:

- Two guaranteed, separately introduced Level 0 tutorial patients
- Exactly one primary concept and one FSRS update per scored decision
- Campaign-scoped FSRS-6 histories with fresh state for every new campaign
- Money, clinical XP, satisfaction, expenses, facility time, and explicit level
  gates
- Continuous five-minute operating days from 8 AM to 6 PM, with one facility
  hour every 30 real seconds and routine arrivals paced at roughly one per real
  minute
- Level 0 completion through two patients, the examination room, the XP
  threshold, and satisfaction above 90%
- Level 1 deterministic routine arrivals, waiting patience, workload
  backpressure, Existing Patients tracking, and treatment/referral decisions
- Level 1 rooms: bathroom, waiting room, X-ray room, imaging control room, and
  minor-procedure room
- Level 1 staff: receptionist and imaging technician, including dependency,
  hiring-cost, generated identity/appearance, role-cap, salary, morale,
  reachability, persisted entrance routes, capability gating until arrival,
  and visible movement rules
- Large multi-column charts with portraits, decision/result history, visible
  test timing, action-ready return, whole-chart learning-summary flip, and
  explicit resolution
- Reproducible patient identity/avatar generation and frozen seeded answer
  shuffling
- Outsourced patient departure/return and capability-dependent in-house X-ray
  timing, including frozen round-trip hallway travel
- Paused Build Mode with a build-only grid, zoom/pan, repeatable rotatable
  rooms, explicit doors, functional hallways, upgrades, and 25% resale
- Four-priority actionable alerts plus a nonurgent ticker/recent-event log,
  deterministic nonrepeating flavor, duplicate consolidation, critical alert
  suppression of humor, and visible current-system save/campaign/testing
  notices
- Bounded founder-run emergency GLP-1 consultations below $100, with a
  facility-hour cooldown, configurable daily cap/diminishing payment, and no
  XP or FSRS benefit
- Multiple local campaigns, local save/reload, compatible save migration,
  recoverable same-seed Start over, and a separate fresh learning history for
  each campaign; creating a genuinely new campaign uses a new seed
- Centralized validated clinical and balance fixtures
- Development fast-forward plus visible campaign, review-count, and per-concept
  FSRS card/due-time inspection
- Open-by-default left-side prototype controls for deterministic cash,
  fast-forward, tutorial preference, FSRS inspection, and recoverable restart
- A full-window desktop layout with internally scrolling patient/goals/build/
  staff/event panels, width-aware construction cards, and newest-first Resolved
  charts
- A responsive chart/facility split with accurate post-resize Phaser pointer
  mapping, plus an explicit Level 1-complete/Level 2-locked state
- One-click Windows dependency/start/browser launcher, a state-driven Level 0
  tutorial through charting, results, goals, construction, and level
  advancement, persistent tutorial controls, and in-game beginner Help
- One global striped clinical-content warning without repeated vignette caveats
- A 52-test unit inventory: 41 game-domain tests and 11 player alert/tutorial
  view-model tests, plus desktop and retained width-regression browser coverage

Current demonstration gate:

1. Melissa can complete Level 0 and enter Level 1 without developer
   explanation.
2. Melissa and her husband can understand the patient folders, facility clock,
   goals, Build Mode, staffing, alerts, and development controls.
3. The loop remains usable at large and compact desktop browser sizes with
   sound off.
4. A saved campaign survives reload, and a newly created campaign visibly has
   no inherited FSRS history.
5. The team records the first pacing, economy, queue, satisfaction, and fun
   findings before adding breadth.

This milestone is deliberately browser-local. It does not include accounts,
cloud synchronization, real clinical approval, an admin application, or
deployment.

The adapter updates FSRS cards and exposes their due state, but the complete
selection policy that prioritizes overdue concepts, interleaves categories,
avoids recent repetition, and occasionally contrasts confused diagnoses is
deferred until the approved content pool is large enough to exercise it.

Latest local verification on 2026-07-25:

- `npm test`: 52 of 52 unit tests passed (41 game-domain and 11 player
  tutorial/alert/view-model)
- `npm run typecheck`: all four TypeScript workspaces passed
- `npm run build`: local Vite build completed with a non-blocking Phaser bundle
  size warning
- `npm run test:e2e`: desktop Level 0/1/save/campaign walkthrough plus large
  and compact desktop layout checks and storage-failure safety passed (5
  passed, 3 intentionally skipped)

## Milestone 3: Iterate and prepare approved content

Dependency: complete the local walkthrough first so content work is not built
around a confusing or unfun loop.

- Fix high-priority walkthrough defects and tune centralized temporary values.
- Refine the phone-specific layout after the desktop walkthrough; phone
  deployment is not part of the current local iteration.
- Pilot the content workflow with one chapter and roughly 5-10 Clinical Topics.
- Import structured drafts while preserving source references and conflicts.
- Validate concepts, meaningful patient variants, question variants, and
  constrained templates.
- Separate technical validation from Melissa's clinical approval.
- Produce immutable local clinical and balance release artifacts.
- Do not ingest full textbooks, commercial question-bank text, or build the
  complete Workbench yet.

Demonstration gate: a small clinically reviewed content set can enter a sealed
local release, while unapproved or invalid content cannot.

## Milestone 4: Private cloud foundation

Dependency: stabilize the local campaign/save shape and confirm that the loop
is worth hosting.

- Create the owner-controlled Supabase project only with explicit external
  infrastructure authorization
- Implement invite-only verified-email/password registration, email
  verification, and password recovery
- Move campaigns to revision-checked cloud saves without changing their
  campaign-scoped FSRS ownership
- Test same-account cross-device reopening and explicit writer takeover
- Establish separate staging and pilot environments
- Protect the administrator deployment with MFA, roles, server enforcement,
  and an outer access gate
- Test backup, restore, rollback, migration, and clinical withdrawal

Demonstration gate: no cross-account access, silent overwrite, exposed admin
surface, or unrecoverable save migration.

## Milestone 5: Private pilot readiness

Dependency: Milestones 3 and 4, then explicit owner authorization for outside
tester access.

- Complete clinical review of the small pilot set
- Polish desktop and phone usability and verify sound-off operation
- Add reviewed privacy and educational-use notices
- Add only an explicitly approved feedback route or data fields
- Conduct owner/trusted-family staging
- Prepare tester invitations, recovery instructions, monitoring, backups, and
  rollback

Gate: explicit owner permission before inviting any outside learner.

## Deferred expansion

- Comprehensive ABSITE coverage and multi-textbook ingestion
- Full Clinical Content Workbench and comprehensive administration suite
- Facility Levels 2 through 5
- Automated Level 2 Cash-Only GLP-1 Telehealth Suite and GLP-1 NP staffing;
  the bounded pre-suite founder emergency action is already available without
  expanding the Level 0-1 clinical scope
- Alert and flavor definitions tied to maintenance, inspections, future rooms,
  or other systems that do not yet exist
- Advanced rooms, staffing, diagnostics, maintenance, pharmacy, and side
  businesses
- Inspection week
- Public release, native distribution, and app stores
- Gameplay telemetry and research features
