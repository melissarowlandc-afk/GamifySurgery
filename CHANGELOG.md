# Changelog

All notable project-record changes are listed here. No implementation exists.

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

### Implementation

- None

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
- Invite-only Supabase Auth using verified email and a permanent passphrase,
  with email-based recovery and hidden internal ownership identifiers
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
