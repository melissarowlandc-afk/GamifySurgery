# Open Decisions

Status: No item in this file is approved unless the Decision Log says otherwise.

Last updated: 2026-07-23

## Severity

- GREEN: inexpensive and easy to change later
- YELLOW: meaningful but manageable rework
- RED: foundational; likely major refactoring, migration, redesign, or redeployment

## RED decisions

| ID | Decision | Recommended proposal | Serious alternatives | Required before |
|---|---|---|---|---|
| R-013 | Initial deployment target | Local vertical slice followed by private browser pilot | Hosted from the start | Implementation approval checkpoint |
| R-014 | Vertical-slice scope | Founder, two tutorial patients, first room, one concept with variants, one queue/staff behavior, FSRS, saving, versioned data | Smaller technical proof; larger pilot build | Implementation approval checkpoint |
| R-019 | Hosted-pilot provider and environment topology | Separate staging and private-pilot environments; standards-based static player/admin deployments; accepted Supabase backend; owner-controlled accounts and access gate | One shared environment; combined player/admin deployment | Before hosted-pilot resources are created |

## YELLOW decisions

| ID | Decision | Recommended default | Needed before |
|---|---|---|---|
| Y-002 | Tutorial funding | Guarantee first room plus operating buffer despite wrong answers | Tutorial balance |
| Y-003 | Phone orientation | Support portrait and landscape; use drawers and pan/zoom rather than force rotation | UI layout implementation |
| Y-004 | Admin scope in vertical slice | Structured import, validation, preview, approval, publish, rollback | Vertical-slice scope approval |
| Y-006 | Email retention and deletion | Retain while account exists; verified deletion process; define backup expiry | Hosted pilot privacy notice |
| Y-007 | Pilot feedback | Optional manual feedback with no detailed clinical-answer export | Playtest plan approval |
| Y-011 | Player session lifetime and device revocation | Long-lived revocable trusted-device sessions with visible device management | Hosted pilot authentication configuration |
| Y-012 | Security/error log fields, IP handling, and retention | Strict allowlist, shortest useful retention, restricted access, and no clinical-answer payloads | Hosted pilot privacy and incident plan |
| Y-013 | Pilot clinical-content scope | Melissa selects a small multi-concept clinically coherent set after the technical slice; every item follows approved review and source rules | Vertical-slice and pilot content approval |
| Y-014 | Pilot participant count, recruitment, and duration | Melissa and husband first, then a small invited adult-resident group for approximately three to four weeks | Hosted pilot authorization |
| Y-015 | Backup and recovery objectives | Owner-controlled exports plus managed backups once pilot saves matter; define acceptable loss and restoration time | Hosted pilot deployment approval |
| Y-016 | Facility tick duration and visible speed controls | Keep exact fixed-step size and permitted speeds in versioned balance configuration after simulation testing | Management-loop implementation |
| Y-017 | Initial clinical authoring workbook | Create a nontechnical multi-tab workbook and data dictionary matching ADR 0020; test it with one or two concepts before bulk entry | Bulk clinical authoring |

## GREEN decisions

- Exact visible tile size
- Grayscale palette
- Placeholder sprites and animation cadence
- Font selection, provided accessibility remains acceptable
- Sound assets, provided the game remains fully usable without sound
- Exact panel styling
- Tutorial wording after mechanics are approved

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
| Y-005 | Clinical question correction | Only the first submitted answer to a scored node updates FSRS; correction, explanation, and optional practice remain unscored | ADR 0013; D-025 |
