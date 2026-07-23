# Decision Log

Status: Living record. "Proposed" is not approval.

Last updated: 2026-07-23

| ID | Date | Decision | Status | Reversibility | Notes |
|---|---|---|---|---|---|
| D-001 | 2026-07-22 | Use the original comprehensive specification and Melissa's latest five answers as the complete initial source | Accepted | RED | Latest explicit answers supersede earlier conflicting answers |
| D-002 | 2026-07-22 | Target Melissa and other invited adult surgery residents | Accepted | YELLOW | No minors and no research study; count and duration remain open |
| D-003 | 2026-07-22 | Carry one responsive browser application with full desktop and phone gameplay into the formal architecture proposal | Direction approved only | RED | Frameworks, hosting, and final architecture remain unapproved |
| D-004 | 2026-07-22 | Starting a new campaign restarts FSRS scheduling and mastery; reopening a campaign preserves its own schedule | Accepted | RED | Supersedes the earlier account-wide interpretation |
| D-005 | 2026-07-22 | Use verified email for pilot account verification and duplicate-account controls; key gameplay and learning data by hidden internal ID | Superseded and expanded | RED | Completed by D-018 and ADR 0009 |
| D-006 | 2026-07-22 | Tell players email is used for verification and helping prevent duplicate pilot accounts, never marketing | Superseded and expanded | YELLOW | D-018 also permits invitation, sign-in, recovery, and security-notice use |
| D-007 | 2026-07-22 | Initial pilot is not human-subjects research and will collect no research data | Accepted | RED | Research capability remains disabled unless separately approved |
| D-008 | 2026-07-22 | No gameplay telemetry or third-party behavioral tracking is authorized | Accepted | RED | Essential security/error logs and optional manual feedback only |
| D-009 | 2026-07-22 | Game must remain fully usable with sound disabled | Accepted | GREEN | Important for accessibility and real-world study environments |
| D-010 | 2026-07-22 | React, Phaser, TypeScript, PostgreSQL/Supabase, and Cloudflare form the current coherent technical recommendation | Partially superseded | RED | Client accepted in D-013, database/backend in D-017; static hosting remains open |
| D-011 | 2026-07-22 | Use a logical tile grid, fixed simulation ticks, footprint-based rooms, and grid pathfinding | Superseded and separated | RED | Spatial model accepted in D-015; browser authority and fixed-step/event model accepted in D-030; exact step duration and speeds remain Y-016 |
| D-012 | 2026-07-22 | Begin with a local vertical slice, then an invite-only hosted pilot | Proposed | RED | Requires deployment-target approval |
| D-013 | 2026-07-23 | Use TypeScript, React, Phaser, and a renderer-independent pure TypeScript game-rules layer for the player client | Accepted | RED | Explicitly approved by Melissa; ADR 0004 |
| D-014 | 2026-07-23 | Use one private monorepo with separately built player and administrator applications plus strongly bounded shared packages | Accepted | RED | Explicitly approved by Melissa; ADR 0005 |
| D-015 | 2026-07-23 | Use an integer logical tile grid, footprint-based rooms, explicit doors and fixtures, and deterministic A* pathfinding | Accepted | RED | Explicitly approved by Melissa; ADR 0006 |
| D-016 | 2026-07-23 | Automatically pause facility operations when the page is hidden, never catch up hidden facility time, and require explicit Resume | Accepted | RED | Explicitly approved by Melissa; ADR 0007 |
| D-017 | 2026-07-23 | Use Supabase-managed PostgreSQL with protected logical domains, row-level security, trusted server functions, migrations, and owner-controlled exports | Accepted | RED | Explicitly approved by Melissa; ADR 0008; no cloud resource or billing authorized |
| D-018 | 2026-07-23 | Use invite-only Supabase Auth with verified email and a permanent passphrase; permit email for invitation, verification, sign-in, recovery, security notices, and duplicate-account control, never marketing | Accepted | RED | Melissa explicitly selected Option B; ADR 0009 |
| D-019 | 2026-07-23 | Keep administration local during the vertical slice, then deploy it separately behind an outer gate with TOTP MFA, roles, server enforcement, audit records, and Melissa-only clinical approval | Accepted | RED | Explicitly approved by Melissa; ADR 0010; no deployment authorized |
| D-020 | 2026-07-23 | Use versioned hybrid saves with an operational snapshot, immutable learning and finance evidence, transactional migrations, expected revisions, one active writer, explicit takeover, and bounded local recovery | Accepted | RED | Explicitly approved by Melissa; ADR 0011 |
| D-021 | 2026-07-23 | Permit the player to start over at any time through at least two deliberate actions and a clear consequence warning | Accepted direction | YELLOW | Prior-campaign retention, undo, and seed behavior remain open as Y-008 |
| D-022 | 2026-07-23 | Start Over archives the current campaign read-only and creates a fresh campaign ID with the same seed and pinned releases; learning and facility progress restart, restoration does not merge, and deletion remains separate | Accepted | YELLOW | Explicitly approved by Melissa; ADR 0012; completes D-021 and Y-008 |
| D-023 | 2026-07-23 | Use FSRS-6 through a pinned `ts-fsrs` dependency behind a project-owned adapter; pin campaign settings, disable library fuzz, begin with default model parameters and no optimizer, and prohibit unvalidated silent upgrades | Accepted | RED | Explicitly approved by Melissa; ADR 0013; resolves R-009 |
| D-024 | 2026-07-23 | Set the pilot's FSRS desired-retention target to a fixed 90%, store it in the immutable balance release, pin it per campaign, and do not expose it as a player setting | Accepted | YELLOW | Explicitly approved by Melissa; resolves Y-009 |
| D-025 | 2026-07-23 | After Again, permit one alternate-variant scored remediation encounter after 30 real-world minutes, never an instant scored retry; do not force an arrival or award another same-date mastery date | Accepted | YELLOW | Explicitly approved by Melissa; resolves Y-010; reward values remain open but must prevent farming |
| D-026 | 2026-07-23 | Give each account one player-confirmed IANA learning timezone; store immutable derived dates with trusted UTC review times, apply timezone changes prospectively only, and do not auto-change for travel or devices | Accepted | YELLOW | Explicitly approved by Melissa as Decision 9D Option A; resolves Y-001; the proposed universal Eastern rule was clarified but not accepted |
| D-027 | 2026-07-23 | Require exactly one primary FSRS concept per scored clinical decision; supporting concepts do not receive automatic credit or penalty, and multiple concepts require independently scored nodes or encounters | Accepted | RED | Explicitly approved by Melissa; ADR 0014; resolves R-010 |
| D-028 | 2026-07-23 | Publish independent complete immutable clinical, core-concept, and balance releases; permanently pin nonclinical campaign foundations while allowing controlled advancement to explicitly compatible complete clinical releases with immutable adoption and item-version history | Accepted | RED | Melissa approved revised Decision 11A Option A1; ADR 0015; resolves R-008; emergency correction was later resolved by D-029 |
| D-029 | 2026-07-23 | Use append-only clinical withdrawal directives and new-version correction packages; freeze audit history, classify evidence, repair invalid FSRS state non-destructively, prohibit earned-progress clawbacks, and waive unavailable publisher-caused gates without fabricating mastery | Accepted | RED | Melissa approved Decision 11B Option A; ADR 0016; resolves R-015 |
| D-030 | 2026-07-23 | Run the deterministic facility simulation in the active browser through pure TypeScript fixed logical steps and scheduled events; the cloud accepts and validates versioned saves but does not continuously execute the pilot facility | Accepted | RED | Melissa approved Decision 12A Option A; ADR 0017; resolves R-016; private nonresearch and noncompetitive integrity boundary |
| D-031 | 2026-07-23 | Use a project-owned, versioned `xoshiro128**` randomness contract with a strong 128-bit root seed, SHA-256-derived independent named streams, persisted state and counters, stable selection rules, and golden fixtures | Accepted | RED | Melissa approved Decision 12B Option A; ADR 0018; resolves R-017; never used for security |
| D-032 | 2026-07-23 | Use normalized PostgreSQL records for identity, authoring, releases, permissions, audit, ledgers, frozen clinical references, and learning evidence, plus one validated versioned JSONB snapshot for coherent operational facility state | Accepted | RED | Melissa approved Decision 13A Option A; ADR 0019; resolves R-018 |
| D-033 | 2026-07-23 | Require the clinical system to serve as both a comprehensive Clinical Topic knowledge base and a source of clinically approved concept-level teaching content; gate concept encounters by facility stage, use constrained seeded templates, allow AI drafts only in administration, and prohibit live AI generation | Accepted requirement direction | RED | Supplied explicitly by Melissa; completed by D-034 and ADR 0020 |
| D-034 | 2026-07-23 | Use a linked, revisioned dual-purpose Clinical Topic and runtime-teaching model with one-FSRS-card Tested Concepts, meaningful many-to-many Patient Presentation Variants, typed constrained templates, facility-stage and capability eligibility, frozen runtime instances, protected Draft-only AI assistance, and no live AI generation | Accepted | RED | Melissa approved Decision 13B Option A; ADR 0020; resolves R-020 |

## Approval rule

Discussion, continued planning, or approval to include a direction in a proposal is not final approval. Before implementation Melissa must explicitly approve:

1. Overall architecture
2. Data and versioning plan
3. Vertical-slice scope
4. Initial deployment target
