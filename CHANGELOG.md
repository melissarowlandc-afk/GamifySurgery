# Changelog

All notable implementation and project-record changes are listed here.

## 2026-07-24

### Accepted

- Single-select multiple-choice assessment for every scored clinical concept,
  with exactly one correct answer per Question Variant
- One to three sequential scored questions per patient encounter, each testing
  a different primary concept, with dependency-aware feedback timing
- Basic patient revenue with modest capped correctness benefits, small bounded
  mistake consequences, anti-farming rules, and guaranteed tutorial funding
- Waiting, Active, and Resolved patient-chart lifecycle with pending-result
  status, action-required exclamation points, a required approved final
  learning summary with optional viewing, and read-only reopening
- Transparent, capability-based facility-time result delays with visible
  pending status and ETA, slower outsourcing, faster functioning in-house
  services, and deterministic prototype timing
- Fair Waiting-patient patience with visible warnings, first-open Active-case
  protection, capped delay consequences, and non-abandoning tutorial patients
- Total clinic-workload capacity with pre-Waiting routine-arrival backpressure,
  protected critical reserve, and no capacity-based patient eviction
- Correction-forward nonfinal errors plus deterministic, clinically approved
  terminal outcomes for appropriate wrong final answers

### Documentation

- Added ADR 0023 and resolved G-001 for multiple-choice clinical assessment
- Added ADR 0024 and resolved G-001A for variable-length patient question
  sequences
- Added ADR 0025 and resolved G-001B for bounded clinical-answer consequences
- Added ADR 0026 and resolved G-001C for the patient-chart lifecycle
- Added ADR 0027 and resolved G-001D for transparent result timing
- Added ADR 0028 and resolved G-001E for patient patience and abandonment
- Added ADR 0029 and resolved G-001F for clinic workload and arrival backpressure
- Added ADR 0030 and resolved G-001G for incorrect-answer case continuation and
  terminal clinical outcomes
- Reconfirmed campaign-scoped FSRS with fresh learning state for every new
  campaign and every newly adopted concept; no learning state carries between
  campaigns
- Clarified that the accepted Supabase mechanism is conventional verified
  email and password with email verification and recovery; “passphrase” refers
  only to using a long password
- Marked the historical responsive-browser and staged-deployment proposals
  complete through their later accepted ADRs without authorizing deployment

### Implementation

- Added a one-click Windows launcher that refreshes dependencies, starts and
  verifies the local server, opens the browser, and stops only its owned server
- Added automatic first-run chart coaching, an animated chart callout,
  persistent tutorial controls, and a responsive in-game beginner Help guide
- Consolidated repeated visible clinical-status warnings into the existing
  striped chart notice while preserving review and source metadata
- Created a private npm-workspace monorepo with a responsive React player,
  Phaser facility renderer, renderer-independent TypeScript domain package,
  validated clinical-content package, and validated balance package
- Expanded the local-only grayscale candidate through facility Levels 0 and 1:
  two guaranteed introductory patients, the examination-room and Level Up gate,
  seeded routine arrivals, Level 1 rooms, staff hiring, operating expenses,
  dependencies, queue pressure, and full and compact desktop layouts
- Changed facility pacing to a continuous 8 AM-6 PM operating day lasting five
  real minutes, with one facility hour every 30 seconds and Level 1 routine
  arrivals no faster than about one patient per real minute
- Added reproducible, independently seeded patient identities and pixel
  appearances plus frozen answer-order shuffling that survives save/reload and
  can be disabled for an authored question when order is meaningful
- Rebuilt the chart as a large multi-column workspace showing the patient,
  presentation, prior decisions, results, and next question together; completed
  charts flip to the learning summary before explicit resolution
- Expanded result routing so multi-step patients visibly leave for off-site
  testing and return action-ready, while a staffed and connected Level 1 X-ray
  capability provides route-aware in-house service whose displayed duration
  includes the patient's frozen round-trip hallway travel
- Added an explicitly entered, automatically paused Build Mode with a build-only
  grid, camera zoom/pan, repeatable rotatable rooms, explicit doors, functional
  hallways, upgrades, and safe sale for a 25% refund
- Added generated employee names and appearances, role caps, salary adjustment,
  morale response, room assignment, reachability checks, and visible staff
  movement; new hires remain unavailable until their persisted entrance route
  reaches the assigned room
- Added a data-driven four-priority alert system with clickable actionable
  alerts, a lower-priority ticker/recent-event log, escalation consolidation,
  cooldowns, deterministic flavor selection, accessibility distinctions that
  do not rely on color, and humor suppression during active critical alerts;
  visible system notices now cover saves, campaign creation/restoration/reset,
  hidden-tab pause, and accelerated testing
- Preserved the complete future alert and flavor bank in
  `docs/features/alert-notification-flavor-system.md` while activating only
  definitions connected to current Level 0/1 mechanics
- Added a bounded manual emergency GLP-1 cash action that appears below $100,
  enforces a facility-hour cooldown and configurable daily cap/diminishing
  payment, rotates the approved sarcasm after repeated daily use, and grants no
  XP, FSRS update, concept mastery, or ordinary patient-care reward
- Added a pinned `ts-fsrs` 5.4.1 FSRS-6 adapter with campaign-owned card state,
  immutable scheduler pins, Good/Again mapping, real review timestamps, and no
  inherited learning history between campaigns
- Added conspicuously synthetic or clinically unapproved original fixture
  content for the interface tutorial, draft laceration, uncomplicated abscess,
  postoperative escalation, and symptomatic cholelithiasis gameplay paths
- Added Zod validation for prototype clinical content and balance configuration,
  including one-correct-answer rules, one-to-three-node limits, unique concept
  use, complete wrong-final-answer dispositions, result-route references,
  facility-stage eligibility, room/staff dependencies, patience warnings,
  satisfaction bounds, and worst-case tutorial funding
- Added a pure deterministic reducer for Waiting, Active, pending-result,
  summary-available, and Resolved states; scheduled FSRS reviews; frozen result
  timing; idempotent commands; bounded patient settlement; routine arrivals,
  patience and capacity; room placement; hiring; expenses; and level gates
- Added a versioned browser-local profile with multiple switchable campaigns,
  save/reopen, a deterministic unpublished-save migration, automatic hidden-tab
  pause, explicit Resume, and a two-step recoverable same-seed Start over
  action; opening its confirmation pauses facility time, cancellation restores
  the prior pause state, and the separate Create fresh campaign action uses a
  new seed
- Added development fast-forward and campaign, review-count, and per-concept
  FSRS card/due-time inspection controls for repeated balance testing
- Added a reducer-owned, centrally configured **Add $100** development command,
  an open-by-default left-side Prototype tools panel, and a two-step
  **Restart game** control inside that panel
- Reworked the desktop shell into a bounded full-window workspace with
  internally scrolling sidebar and construction panels, width-aware room and
  staff cards, sticky panel headings, and compact-desktop coverage
- Kept the live clinic visible above an open chart and synchronized Phaser's
  backing bitmap with responsive host resizing so build clicks remain mapped
  to the correct logical tile
- Added an explicit Level 1-complete, Level 2-locked prototype state
- Ordered Resolved charts by most recent resolution while preserving the
  existing Waiting and Active ordering
- Removed repeated caveat language from player-visible case presentations,
  questions, explanations, and summaries while retaining one striped chart
  warning plus all source and clinical-review metadata
- Deferred further phone-specific interface refinement until after the current
  desktop walkthrough
- Bounded transient operation receipts and event notices to the latest 500
  records so long local sessions do not grow those presentation logs without
  limit
- Focused the active Playwright walkthroughs on full and compact desktop
  widths; phone-specific regression and polish remain deferred
- Expanded the deterministic Vitest inventory to 49 unit tests: 41
  game-domain tests covering rules, timing, saves, FSRS, randomness,
  construction, staffing, and the emergency action, plus 8 player tests for
  alert data, routing, consolidation, cooldowns, and flavor selection

### Prototype boundaries

- The implementation contains synthetic placeholder content only; it is not
  clinically approved, medical advice, or suitable for real patient data
- No PHI, player accounts, backend, cloud save, administrator website,
  telemetry, research collection, public deployment, or external pilot access
  was added
- The accepted Supabase verified-email/password identity and cloud-save model is
  intentionally staged after the local slice under ADR 0022; browser-local
  campaigns do not replace it
- Real clinically approved content, broad content authoring, the Clinical
  Content Workbench, Supabase, cross-device saves, and deployment remain
  deferred
- Full due-prioritized, interleaved, repetition-aware encounter selection is
  deferred; card updates and due inspection are present
- Level 2 and later management systems are not implemented
- The automated Level 2 GLP-1 suite and GLP-1 NP staffing are not implemented;
  only the bounded founder-run emergency action is present
- Alert definitions tied to maintenance, inspections, later rooms, or other
  unimplemented mechanics remain documentation-only
- Phone-specific usability polish remains deferred; current implementation
  work targets full and compact desktop browser windows

### Verification

- `npm test` passed all 49 unit tests: 41 game-domain and 8 player
  alert/view-model tests
- `npm run typecheck` passed for the player, balance, clinical-content, and
  game-domain workspaces
- `npm run build` produced the local Vite build successfully
- `npm run test:e2e` passed the desktop Level 0/1/save/campaign walkthrough and
  storage-failure safety check plus large- and compact-desktop layout checks:
  5 passed, 3 intentionally skipped
- Vite reported a non-blocking large-chunk warning for the Phaser-containing
  JavaScript bundle; code splitting remains a pre-deployment optimization

## 2026-07-23

### Accepted

- TypeScript as the primary client and shared-domain language
- React for text-heavy, responsive, and accessible interface elements
- Phaser for the top-down 2D facility renderer and direct map interaction
- Pure TypeScript game rules kept independent of React and Phaser
- One private monorepo with separately built applications and strongly bounded
  shared packages
- Integer logical tile grid with footprint-based rooms, explicit doors and
  fixtures, and deterministic A* pathfinding
- Automatic facility pause when the browser page is hidden, with no hidden-time
  catch-up and explicit Resume on return
- Supabase-managed PostgreSQL with protected logical domains, row-level
  security, trusted server functions, migrations, and owner-controlled exports
- Invite-only Supabase Auth using verified email and a conventional permanent
  password, with long passphrases encouraged, email-based recovery, and hidden
  internal ownership identifiers
- Local-only administration during the vertical slice, followed by a separate
  private deployment with an outer gate, TOTP MFA, roles, server enforcement,
  audit records, and Melissa-only clinical approval
- Versioned hybrid saves with an operational snapshot, immutable educational
  and finance evidence, transactional migrations, revision checks, one active
  writer, explicit takeover, and bounded local recovery
- A Start Over option available at any time through at least two deliberate
  actions and a clear consequence warning
- Recoverable Start Over behavior that archives the prior campaign and creates
  a fresh campaign ID with the same seed and pinned releases
- FSRS-6 through a pinned `ts-fsrs` dependency behind a project-owned adapter,
  with campaign-pinned settings, reproducible scheduling, default model
  parameters initially, no optimizer, and validated upgrades only
- A fixed 90% FSRS desired-retention target for the pilot, stored in the
  immutable balance release and pinned by each campaign
- One alternate-variant remediation encounter after an Again response, eligible
  after 30 real-world minutes and limited to once per concept and learning date
- One confirmed IANA learning timezone per account, with immutable historical
  learning dates and prospective-only preference changes
- Exactly one primary FSRS concept per scored clinical decision, with
  independently scored nodes or encounters for additional concepts
- Independent complete immutable clinical, core-concept, and balance releases,
  with permanent nonclinical campaign pins and controlled forward adoption of
  compatible complete clinical releases
- Immutable clinical-adoption history, supplemental new concepts, and exact
  clinical-item freezing for generated episodes and scored reviews
- Append-only emergency clinical withdrawals and new-version correction
  packages, with non-destructive evidence classification and FSRS repair
- No publisher-error clawbacks and audited availability waivers that prevent
  content withdrawal from softlocking a campaign without fabricating mastery
- Browser-authoritative deterministic facility simulation using pure TypeScript
  fixed logical steps and scheduled events, with cloud validation and
  synchronization but no continuously running pilot simulation server
- A private-pilot integrity boundary that does not claim tamper-resistant
  facility results for competition, assessment, or research
- A versioned project-owned `xoshiro128**` randomness contract with a strong
  campaign root seed, SHA-256-derived independent named streams, persisted
  state and counters, stable unbiased selection, and golden fixtures
- Randomness kept outside clinical truth, security functions, and
  progression-critical guarantees
- Hybrid PostgreSQL storage with normalized identity, authoring, publishing,
  audit, learning, finance, and frozen clinical records plus one validated
  versioned JSONB operational campaign snapshot
- Foundational requirement for a dual-purpose Clinical Topic knowledge base and
  clinically approved runtime teaching library
- Facility-stage availability for concepts, constrained seeded scenario
  instantiation, AI drafts confined to administration, and no live AI clinical
  generation
- Long external or AI-generated design prompts are advisory inputs that must be
  reconstructed chronologically and reconciled with accepted decisions before
  use
- Delegated technical decision-making and prototype-first delivery, with owner
  gates retained for game and clinical intent, privacy/research, external
  access, spending, legal, public, and destructive actions
- Local playable prototype followed by a coherent local vertical slice,
  staging, and an invite-only private browser pilot
- Private Google Sheets as the temporary clinical authoring source, with
  protected identifiers, validated GitHub export backups, a small trial, and a
  one-way handoff to the future admin database

### Proposed, not approved

- First real clinical concept or small concept set
- Opening story and later pilot participation details

### Documentation

- Added ADR 0004 for the approved client stack
- Added ADR 0005 for the approved repository organization
- Added ADR 0006 for the approved facility spatial model
- Added ADR 0007 for the approved hidden-page facility-time rule
- Added ADR 0008 for the approved backend and database foundation
- Added ADR 0009 for the approved player authentication mechanism
- Added ADR 0010 for the approved staged administrator security architecture
- Added ADR 0011 for the approved save and cross-device conflict architecture
- Added ADR 0012 for the approved recoverable Start Over lifecycle
- Added ADR 0013 for the approved FSRS implementation and upgrade boundary
- Marked R-001 resolved and narrowed the unapproved portions of the architecture proposal
- Marked R-004 resolved
- Marked R-002 resolved
- Marked R-003 resolved
- Marked R-005 resolved
- Marked R-011 resolved
- Marked R-012 resolved
- Marked R-006 and R-007 resolved
- Resolved Y-008 and completed the Start Over design direction
- Marked R-009 resolved
- Resolved Y-009 and added the first accepted numerical balance value
- Resolved Y-010 and documented bounded same-date remediation
- Resolved Y-001 and documented consistent cross-device mastery dates
- Added ADR 0014 and resolved R-010 for primary-concept mapping
- Added ADR 0015 and resolved R-008 for publishing and controlled forward
  clinical adoption
- Added ADR 0016 and resolved R-015 for emergency withdrawal and correction
- Added ADR 0017 and resolved R-016 for facility simulation authority and timing
- Added ADR 0018 and resolved R-017 for seeded-randomness implementation
- Added ADR 0019 and resolved R-018 for the physical data boundary
- Added ADR 0020 and resolved R-020 for the dual-purpose clinical knowledge-base
  and runtime-teaching architecture
- Accepted stable Tested Concepts, meaningful many-to-many Patient Presentation
  Variants, typed constrained templates, facility-stage and capability
  eligibility, frozen clinical instances, protected Draft-only AI assistance,
  and no live AI generation
- Added the persistent external and AI-generated design-input review workflow
- Added ADR 0021 for delegated technical authority and prototype-first delivery
- Added ADR 0022 for staged local-to-private-pilot delivery
- Reconstructed the imported design history, distinguishing stable intent from
  superseded or exploratory mechanics
- Refactored the roadmap and open-decision queue so only owner-level design and
  external-action gates require owner review
- Expanded the unresolved first-phase queue after a full-document audit to
  include simulation authority, seeded randomness, physical data boundaries,
  hosted-pilot topology, session/log retention, content scope, pilot scope,
  backup objectives, and simulation-speed settings
- Marked Y-005 resolved from the accepted first-submission and unscored
  correction rules

### Implementation

- None

## 2026-07-22

### Added

- Initial project brief and source hierarchy
- Canonical design summary
- Architecture and data-model proposals
- Clinical-content and balance-model proposals
- Security/privacy and deployment proposals
- Roadmap, playtest plan, and risk register
- Decision and open-decision logs
- ADR for campaign-scoped FSRS
- ADR for verified-email pilot identity
- Proposed ADR for browser-first responsive delivery

### Accepted requirements recorded

- Melissa and other invited adult surgery residents; count and duration remain open
- No minors and no research study
- Campaign-specific FSRS schedules
- Verified-email pilot identity for verification and duplicate controls, separated from gameplay records
- No telemetry, advertising, marketing, PHI, or research collection
- Full desktop and phone browser gameplay direction
- Complete usability with sound disabled

### Implementation

- None
