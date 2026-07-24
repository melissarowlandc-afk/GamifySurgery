# Open Decisions

Status: Owner-facing choices and delegated delivery backlog. Technical impact
severity no longer implies that Melissa must select the implementation.

Last updated: 2026-07-23

## Impact severity

- GREEN: inexpensive and easy to change later
- YELLOW: meaningful but manageable rework
- RED: foundational; likely major refactoring, migration, redesign, or
  redeployment

Under ADR 0021, the lead agent resolves technical items and records costly
choices. Melissa is asked only about player experience, clinical intent,
privacy/research, external access, spending, licensing, or destructive actions.

## Owner-level design decisions

| ID | Decision | Recommended direction | Required before |
|---|---|---|---|
| G-001 | First playable clinical interaction: guided staged choices, searchable action catalogs, or a hybrid | Begin with short guided staged choices; preserve searchable catalogs as a later expansion | First playable patient |
| G-002 | First real clinical concept or small concept set | Melissa chooses only after the synthetic prototype proves the authoring and play flow | Real clinical-content integration |
| G-003 | Opening tone and story, including whether to use the inheritance joke | Defer until the core loop is playable; use a minimal clinic opening first | Tutorial polish |
| G-004 | Pilot participants, optional feedback, and any disclosed playtest metrics | Melissa and trusted family first; decide outside access and data fields later | Hosted tester invitations |

## Delegated delivery backlog

These items will be resolved by the lead agent when implementation evidence is
available and will not be presented as serial owner decisions:

| Item | Current working default |
|---|---|
| Exact vertical-slice technical scope | Smallest coherent loop after G-001: founder, patient, feedback, resources, first room, pause, and save |
| Tutorial economy | Guarantee the first room and an operating buffer even after mistakes |
| Phone layout | Support portrait and landscape with responsive drawers, pan, and zoom |
| Early authoring tools | Private Google Sheets workbook plus validated exports; full admin application later |
| Session and security logs | Revocable trusted-device sessions; minimal allowlisted logs with no clinical-answer payload |
| Backups | Owner-controlled exports first; managed backups before valuable pilot saves |
| Simulation step and visible speed | Versioned tunable values selected through tests and deterministic simulation |
| Static hosting provider | Select just before the hosted pilot; preserve standards-based portability |

Legacy items Y-002, Y-003, Y-004, Y-006, Y-011, Y-012, Y-015, and Y-016
are represented in this delegated backlog. Owner-facing portions of Y-007,
Y-013, and Y-014 are represented by G-002 and G-004.

## External-action gates

The lead agent may design these systems, but owner authorization is still
required before creating paid resources, enabling billing, purchasing a domain,
inviting outside testers, making a deployment public, collecting new telemetry,
starting research, or destroying owner data.

## Resolved decisions

| ID | Decision | Resolution | Record |
|---|---|---|---|
| R-001 | Overall client stack | TypeScript, React, Phaser, and a renderer-independent pure TypeScript game-rules layer | ADR 0004; D-013 |
| R-002 | Facility spatial model | Integer logical tile grid, footprint-based rooms, explicit doors and fixtures, and deterministic A* pathfinding | ADR 0006; D-015 |
| R-003 | Facility-time behavior when hidden | Automatically pause when the page is hidden, never catch up hidden facility time, and require explicit Resume | ADR 0007; D-016 |
| R-004 | Code organization | One private monorepo with separately built applications and strongly bounded shared packages | ADR 0005; D-014 |
| R-005 | Backend and database | Supabase-managed PostgreSQL, protected logical domains, row-level security, trusted server functions, migrations, and owner-controlled exports | ADR 0008; D-017 |
| R-006 | Save representation | Versioned operational snapshot plus immutable learning and finance evidence, transactional writes, and tested sequential migrations | ADR 0011; D-020 |
| R-007 | Cross-device conflict policy | One active writer, expected-revision checks, explicit takeover, no automatic merge, and bounded local recovery | ADR 0011; D-020 |
| R-011 | Authentication mechanism | Invite-only Supabase Auth using verified email plus a permanent passphrase, with email-based recovery and hidden internal ownership IDs | ADR 0009; D-018 |
| R-012 | Administrator protection | Local-only during the vertical slice; then a separate private deployment with an outer gate, TOTP MFA, roles, server enforcement, and audit records | ADR 0010; D-019 |
| Y-008 | Start Over campaign lifecycle | Save and archive the prior campaign read-only, then create a fresh campaign ID with the same seed and pinned releases; permanent deletion remains separate | ADR 0012; D-022 |
| R-009 | FSRS implementation | FSRS-6 through pinned `ts-fsrs`, isolated behind a project-owned adapter, with campaign-pinned settings, fuzz disabled, default model parameters initially, no optimizer, and validated upgrades only | ADR 0013; D-023 |
| Y-009 | Initial FSRS desired retention | Fixed 90% pilot target, stored in the immutable balance release, pinned per campaign, and not player-adjustable | D-024 |
| Y-010 | Short-term and same-day review behavior | One alternate-variant remediation encounter after 30 real-world minutes, at most once per learning date; no forced arrival, instant scored retry, or additional same-date mastery credit | D-025 |
| Y-001 | Mastery-date timezone | One confirmed IANA learning timezone per account; immutable derived dates, trusted UTC instants, and prospective-only changes with no automatic travel/device switching | D-026 |
| R-010 | Primary concept mapping | Exactly one primary FSRS concept per scored decision; supporting tags do not update learning state, and multiple concepts require independently scored nodes or encounters | ADR 0014; D-027 |
| R-008 | Clinical/balance publishing and forward clinical adoption | Independent complete immutable releases; permanent core/balance/technical pins; controlled advancement to one compatible complete clinical release; immutable adoption history; supplemental new concepts; frozen episodes and reviews | ADR 0015; D-028 |
| R-015 | Emergency clinical correction and withdrawal | Append-only withdrawal directives, new-version correction packages, exact frozen history, evidence annotations and pinned-scheduler repair, no earned-progress clawbacks, and non-mastery availability waivers | ADR 0016; D-029 |
| R-016 | Facility simulation authority and timing | Deterministic pure-TypeScript simulation in the active browser using fixed logical steps and scheduled events; cloud-accepted saves remain authoritative for sync, while the server does not continuously execute the pilot facility | ADR 0017; D-030 |
| R-017 | Seeded-randomness implementation | Versioned project-owned `xoshiro128**` contract; strong 128-bit root seed; SHA-256-derived independent named streams; persisted state/counters; stable unbiased selection; golden fixtures | ADR 0018; D-031 |
| R-018 | Physical data boundary | Normalized PostgreSQL for independently related, protected, published, or audited records; one validated versioned JSONB snapshot for coherent operational facility state | ADR 0019; D-032 |
| R-020 | Dual-purpose clinical knowledge-base and runtime-teaching model | Linked revisioned Clinical Topics, structured facts, Tested Concepts, meaningful many-to-many Patient Presentation Variants, typed constrained templates, one-concept Decision Nodes, Question Variants, facility-stage/capability eligibility, frozen instances, protected Draft-only AI assistance, and no live AI generation | ADR 0020; D-034 |
| R-013 | Initial deployment target | Local playable prototype, coherent local vertical slice, staging, then invite-only private browser pilot | ADR 0022; D-037 |
| R-019 | Hosted-pilot topology | Separate staging and pilot data plus separately deployed player and administrator applications; exact static host selected just-in-time by the lead agent | ADR 0022; D-037 |
| Y-017 | Initial clinical authoring workbook | Private owner-controlled Google Sheets working source, protected stable identifiers, validated exports, one- or two-concept trial, and one-way handoff to the future admin database | D-038 |
| R-014 | Vertical-slice scope | Lead agent selects the smallest coherent scope after the applicable owner-level interaction choice and expands only after a playable demonstration | ADR 0021; D-039 |
| Y-005 | Clinical question correction | Only the first submitted answer to a scored node updates FSRS; correction, explanation, and optional practice remain unscored | ADR 0013; D-025 |
