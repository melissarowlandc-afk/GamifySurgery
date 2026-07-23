# Architecture Proposal

Status: PARTIALLY APPROVED. Accepted choices are identified by their ADRs;
remaining choices are explicitly marked proposed or open. This document does
not authorize implementation.

Last updated: 2026-07-23

## Recommended coherent architecture

Accepted client foundation:

- TypeScript is the primary client and shared-domain language.
- React handles text, forms, clinical questions, navigation, accessibility, and responsive interface panels.
- Phaser handles the top-down facility canvas, camera, sprites, and direct map interaction.
- Pure TypeScript domain modules own facility simulation, economy, progression, queues, FSRS coordination, and seeded randomness independently of React and Phaser.

This accepted choice is recorded in
[ADR 0004](docs/adr/0004-react-phaser-typescript-client.md).

Accepted repository organization:

- Use this one private repository as a monorepo.
- Keep the player application, separately deployed administrator application,
  shared deterministic rules, data contracts, publishing validators, database
  migrations, tests, simulations, and documentation in clearly separated
  workspaces or directories.
- Enforce dependency and security boundaries so the player build cannot import
  administrator-only code, draft content, or secrets.

This accepted choice is recorded in
[ADR 0005](docs/adr/0005-private-monorepo.md).

Accepted backend and database foundation:

- Supabase-managed PostgreSQL for protected logical data domains, published
  releases, campaigns, saves, and administration data
- PostgreSQL row-level security and least-privilege grants for player-accessible
  data
- Server-side protected functions for publishing, save revision checks,
  administrator operations, and other trusted transitions
- Version-controlled database migrations and owner-controlled logical exports

This accepted choice is recorded in
[ADR 0008](docs/adr/0008-supabase-postgresql-backend.md).

Accepted player authentication foundation:

- Use Supabase Auth for invite-only verified-email accounts.
- Players sign in with their verified email address and a permanent passphrase.
- Gameplay, learning state, and campaigns remain keyed by a hidden internal
  account ID rather than email.
- Email may be used for invitations, verification, sign-in identification,
  password recovery, important account-security notices, and duplicate-account
  control, never marketing.

This accepted choice is recorded in
[ADR 0009](docs/adr/0009-verified-email-passphrase-auth.md).

Accepted educational-scheduler foundation:

- Use the official `ts-fsrs` TypeScript package for the FSRS-6 algorithm.
- Access it only through a project-owned scheduling adapter and project-owned
  card and review types.
- Pin the exact package release, algorithm version, resolved parameter set, and
  integration version used by each campaign.
- Disable library interval fuzz so project-seeded tests remain reproducible.
- Begin with validated default model parameters and no per-player optimizer.
- Set the pilot's campaign-pinned desired-retention target to 0.90 through the
  immutable balance release; it is not player-adjustable.
- Never silently upgrade an existing campaign's scheduler. Validate every
  proposed upgrade with golden histories and require an explicit migration
  before moving an existing campaign.

This accepted choice is recorded in
[ADR 0013](docs/adr/0013-pinned-fsrs-adapter.md).

Static web hosting remains a proposed RED decision, provisionally using
Cloudflare Pages or an equivalent standards-based host.

## Component boundaries

### Player application

Responsibilities:

- Responsive desktop and phone presentation
- Facility rendering and interaction
- Clinical decision presentation
- Accessible text and controls
- Local presentation state and brief connection-loss buffering
- Authentication session handling
- Loading an immutable published release
- Submitting revision-checked campaign saves

The player application must not receive administrator credentials, draft content, publishing permissions, or database service-role secrets.

### Facility renderer

The renderer displays domain state but does not own economic, clinical, queue, or progression truth. Animation completion must not decide whether a task logically completed.

Accepted spatial model:

- Integer logical tiles independent of screen pixels
- Expandable map bounds
- Room footprint masks with physical size separate from room upgrade level
- Explicit valid doors and fixtures
- A walkability grid and deterministic A* paths owned by the pure TypeScript
  simulation layer
- Pixel-perfect camera zoom levels where practical
- Pan, zoom, select, and build controls designed separately for mouse and touch

Equal-cost routes use deterministic tie-breaking. Routes are recalculated when
relevant walkability changes, not per animation frame. Exact visible tile size,
room dimensions, rotations, initial map bounds, and expansion prices remain
later visual or balance decisions.

This accepted choice is recorded in
[ADR 0006](docs/adr/0006-logical-tile-grid.md).

### Simulation domain

The active, visible, unpaused browser that holds the campaign writer lease runs
the facility simulation. The simulation is a renderer-independent pure
TypeScript state machine; React and Phaser display it and request actions but
do not own game truth.

It owns:

- Facility clock and pause state
- Task creation and queues
- Staff eligibility and assignment
- Patient arrivals and episode state
- Construction and room state
- Economy, XP, satisfaction, and objectives
- Random-event eligibility and guarantees
- Inspection state and scoring inputs

Simulation uses fixed logical steps plus explicitly scheduled events rather
than animation frames. Facility time and foundational quantities use integers
or an explicitly fixed-precision representation. Rendering may interpolate
between logical states without affecting outcomes. Exact step duration, visible
speed options, and bounded visible-stall behavior remain versioned balance and
implementation decisions. Probabilities are defined per eligible task, entity,
or unit of facility time.

The backend does not continuously run the pilot facility or reproduce every
ordinary player command. This is an explicit private, single-player,
nonresearch, noncompetitive integrity boundary. A tamper-resistant use such as
leaderboards, prizes, assessment, or research-quality outcome measurement
requires a new RED decision.

This accepted choice is recorded in
[ADR 0017](docs/adr/0017-browser-authoritative-facility-simulation.md).

### Educational domain

The educational domain owns campaign-specific:

- FSRS cards
- Review log
- Mastery evidence
- Concept eligibility
- Variant recency
- Due-concept prioritization

Each scored decision node identifies exactly one primary FSRS concept. Only the
first submission to that node updates its primary concept. Supporting concepts
may be tagged for authoring and explanation but receive no automatic scheduler
or mastery change. When a case needs to assess several concepts, it uses
separate independently scored nodes or encounters.

Explanation viewing, retry practice, and APP automation are separate event
types.

The project-owned scheduler adapter is the only educational-domain boundary
permitted to import `ts-fsrs`. It maps the first scored answer to Again or Good
and returns project-owned state. Review evidence preserves the pre-review and
post-review card state, UTC review time, mapping used, package and algorithm
versions, resolved parameters, and resulting due time. FSRS supplies scheduling
state; the game's separate selection and mastery rules remain authoritative for
case choice and progression.

After an Again response, the selector may present at most one additional scored
remediation encounter for that concept on the same learning date. It becomes
eligible after 30 real-world minutes, uses a different approved variant, and
does not force an extra arrival or interrupt the facility. If no suitable
encounter occurs, the card stays due for a later session. Immediate correction
and optional practice are unscored. A same-date remediation updates FSRS but
does not create another mastery date.

Each account has one confirmed IANA learning-timezone identifier. Initial setup
may detect a device suggestion, but the player confirms it and the value does
not change automatically when traveling or switching devices. The trusted
review instant is stored in UTC; the server also stores the timezone identifier,
applied offset, and derived learning date used by mastery and same-date limits.
A later timezone change applies only to future reviews and cannot rewrite
historical learning dates.

### Runtime API

The runtime API or protected database functions handle:

- Account and session validation
- Release-manifest retrieval
- Campaign creation
- Revision-checked save writes
- One-active-writer conflict policy
- Save-shape, version-pin, idempotency, and basic-invariant validation
- Trusted timestamps where required
- Rate limits and audit-relevant security events

### Administrator application

The administrator application is a separate build and deployment, even if it shares a repository and design system.

It eventually supports clinical and balance editing, but the first approved slice should limit scope to structured import/editing, validation, preview, approval, publishing, release history, and rollback.

Clinical publication also requires a compatibility report against supported
earlier clinical releases and an owner-selected distribution mode for eligible
existing campaigns.

The dual-purpose clinical knowledge-base, constrained template, Draft-only
AI-assistance boundary, seeded preview, and runtime-teaching architecture are
accepted in
[ADR 0020](docs/adr/0020-dual-purpose-clinical-content-model.md) and detailed in
[CONTENT_MODEL.md](CONTENT_MODEL.md). No live game AI generation is permitted.
Exact visual styling and the amount of the administrator interface included in
the vertical slice remain later scope decisions.

Administrator access requires:

- A verified administrator account
- TOTP MFA
- An explicit administrator role
- A protected server-side publishing path
- A separate access gate before any internet deployment

Accepted staging and protection:

- Keep the administrator application local-only during the vertical slice.
- Before a hosted pilot, deploy it separately from the player application
  behind an outer access gate.
- Use individual Supabase Auth administrator identities, mandatory TOTP MFA,
  allowlisted roles, server-side authorization, and audit records.
- Only Melissa receives clinical-approval authority.
- Never rely on a hidden route or disabled button for authorization.

This accepted choice is recorded in
[ADR 0010](docs/adr/0010-staged-admin-security.md). The exact outer access-gate
and static-hosting providers remain deployment decisions.

### Database boundaries

For the pilot, one Supabase-managed PostgreSQL project will use separate schemas
or comparably strong boundaries for:

1. Authentication
2. Clinical authoring
3. Clinical published releases
4. Balance authoring
5. Balance published releases
6. Accounts and display profiles
7. Campaigns, learning state, and saves
8. Essential security/error records
9. Optional manual feedback

Draft authoring areas are not exposed to the player application. A future public release may split authoring and runtime into different database projects if the security or operational benefit justifies the additional cost.

This approves the backend architecture but does not create a Supabase account,
project, subscription, or billing relationship. Those external actions require
separate deployment authorization.

Within these domains, normalized PostgreSQL tables own independently related,
protected, searchable, published, or audited records. One validated,
save-schema-versioned `jsonb` snapshot owns the rapidly changing operational
facility state. Important clinical references, reviews, money entries,
publication records, and audit evidence remain relational and cannot be
overwritten by the snapshot. This accepted physical boundary is recorded in
[ADR 0019](docs/adr/0019-hybrid-relational-and-jsonb-storage.md).

## Browser and phone behavior

- Full gameplay is available on both desktop and phone.
- Desktop may show the facility and contextual panels together.
- Phone uses drawers, tabs, and map pan/zoom rather than removing systems.
- Touch targets and normal interface text must meet accessibility needs.
- Sound is optional and never the sole signal.
- The game should not reward faster reading of clinical material.

Facility operations automatically pause when the page becomes hidden. Hidden
elapsed time is never simulated afterward, and the player must explicitly
resume after returning. Losing focus alone does not pause a page that remains
visible. This accepted lifecycle rule is recorded in
[ADR 0007](docs/adr/0007-pause-when-hidden.md).

## Connectivity

The initial pilot is online-required.

Recommended resilience:

- Cache static application assets
- Keep the last acknowledged save locally for refresh recovery
- Queue only a short, bounded unsent save during a brief connection loss
- Clearly show connection and saving state
- Prevent a second device from silently overwriting a newer revision

Full offline-first play and automatic state merging are excluded.

## Save strategy

Accepted campaign storage combines:

- A versioned, validated JSONB campaign snapshot for current operational state
- An immutable educational review log
- An auditable money ledger
- A save revision for concurrency
- Permanent version references for the core-concept set, balance, save schema,
  FSRS integration and parameters, and randomness
- Initial and current clinical-release references plus an immutable clinical
  adoption sequence

The server writes a compatible snapshot and its new review or finance evidence
atomically. Unique operation identifiers make retried requests idempotent.
Every value has one canonical owner; a cached snapshot total must reconcile
against any normalized immutable evidence that owns it.

Only one device holds the active writer lease for a campaign. Every save
includes its expected revision. A stale write is rejected, and a second device
must reload or explicitly take over after a warning. A takeover revokes the
older writer; there is no automatic state merge and no last-write-wins policy.

The browser may keep the last cloud-acknowledged state and one bounded pending
save for refresh or brief connection-loss recovery. The latest server-accepted
revision remains authoritative for synchronization and recovery, while the
active browser computes the next proposed facility state under ADR 0017.
Facility operations pause after a short unacknowledged-save grace period rather
than becoming offline play.

Every snapshot carries a save-schema version and uses tested, sequential,
non-destructive migrations. A failed migration preserves the prior snapshot.
Exact lease and grace-period durations remain later configuration decisions.

This accepted choice is recorded in
[ADR 0011](docs/adr/0011-versioned-hybrid-saves.md).

Start Over is implemented as one trusted transaction that saves and archives
the current campaign and creates a new campaign ID with the same seed and
pinned versions. The original is not overwritten or deleted. Failure leaves
the original campaign active and unchanged. See
[ADR 0012](docs/adr/0012-recoverable-campaign-restart.md).

## Content and balance publication

Authoring data is mutable. Clinical, core-concept, and balance releases are
independent, complete, immutable, validated, recoverable, and exportable.

Publishing flow:

1. Edit a draft.
2. Validate structure and relationships.
3. Verify sources and required approvals.
4. Preview the exact candidate release.
5. Materialize a complete manifest of exact immutable item revisions.
6. Publish an immutable numbered release with schema version and checksum.
7. Move the appropriate current-release pointer for new campaigns.
8. Preserve every referenced release for restoration and rollback.

Core-concept sets, balance releases, scheduler integration and parameters,
save-schema versions, and random-generator versions remain permanently pinned
to a campaign. Clinical releases use controlled forward adoption instead.

Each campaign stores an initial and current clinical release. A later complete
clinical release may replace the current pointer only through an explicitly
validated compatibility edge. Automatic adoption requires both a
backward-compatible additive classification and Melissa's authorization of the
automatic distribution mode. Other releases may be player-approved,
administrator-initiated, or unavailable to existing campaigns.

The adoption transaction appends immutable evidence containing the prior and
new releases, trusted timestamp, adoption mode, actor or protected process,
campaign revision, unique operation identifier, and validator/migration
version. Adoption never rewrites prior reviews or active patient episodes.

Additive compatibility requires unchanged existing item revisions and concept
meanings; compatibility with the pinned balance and runtime capabilities; no
change to the core mastery denominator or existing progression eligibility; and
tests showing that supplemental material cannot starve required content or
create a reward exploit. Compatibility is directional and explicit between
releases rather than inferred from version numbers.

Newly adopted concepts begin with no FSRS history and are supplemental for that
campaign. They may participate in ordinary learning and rewards but cannot
become required for its mastery, progression, inspection, or victory.

Every generated patient episode freezes the clinical release and exact case,
variant, decision, and question revisions used at generation. Every scored
review preserves the exact decision revision seen. New content applies only to
newly generated material unless a separate safe migration is approved.

A campaign advances to one complete current clinical release, not a base plus
an ordered expansion stack. Logically complete manifests may reuse unchanged
immutable item revisions internally, avoiding unnecessary data duplication.

Moving a current-release pointer backward affects new campaigns only. Reversing
an already adopted campaign requires an explicit migration or withdrawal
because supplemental learning evidence may already exist.

Corrections, withdrawals, concept redefinitions, deletions, incompatible
replacements, and schema changes are not ordinary additive adoption and must
never silently rewrite a historical release.

### Clinical safety directives and correction packages

The accepted correction architecture uses an append-only safety directive
followed by a separately validated correction package:

- For the pilot, only Melissa may clinically approve an item withdrawal,
  evidence-validity classification, replacement, or reactivation.
- A withdrawal targets exact immutable release and item revisions and records
  reason, severity, trusted time, approval, whether prior scoring may be
  invalid, directive version, and supersession history.
- The player application refreshes the active withdrawal manifest at session
  start, resume, periodically, and before generating scored material. If the
  manifest is too stale to trust, new scored clinical generation fails closed.
  Exact refresh and staleness intervals remain GREEN settings.
- Withdrawn material not yet generated is never selected. Generated material is
  not rewritten: an undisplayed affected episode or node is bypassed
  unscored; a visible unanswered prompt is disabled and explained; an already
  scored response remains immutable.
- Publisher-caused cancellation has a neutral operational outcome: no clinical
  score, satisfaction penalty, educational reward, or exploitable extra
  patient revenue.
- A correction creates a new immutable item revision in a new complete clinical
  release and enters affected campaigns only through a validated replacement
  or migration edge.
- A changed concept meaning requires a new concept identifier and an explicit
  campaign plan. An existing identifier is never silently redefined.

The correction package classifies historical scored evidence as valid,
invalid, or affected by a concept redefinition. Raw reviews are never edited.
If a review is invalid, the system appends a validity annotation and uses a
versioned, approved repair to replay the remaining valid history through the
campaign's pinned scheduler. It stores the prior and rebuilt card states and
recalculates current mastery from valid evidence. The player sees that review
is required after a content correction rather than being told they failed.

Correction never claws back money, XP, construction, facility levels,
inspection results, recognition, or victory already earned. It can require
fresh valid evidence for current mastery and disables APP mastery automation
until that evidence exists.

If a withdrawn core concept has no valid presentation, an audited availability
waiver prevents publisher error from blocking progression, inspection, or
victory without marking the concept mastered or enabling APP automation. The
concept remains in the fixed denominator. A later approved replacement closes
the waiver prospectively; previously completed gates remain complete.

Affected players receive a concise Melissa-approved correction notice. These
directives, annotations, migrations, and notices are operational
clinical-safety records, not research telemetry.

## Seeded randomness

Accepted design:

- Use a project-owned TypeScript `xoshiro128**` implementation behind a
  versioned randomness-contract interface.
- Create and permanently store one strong 128-bit campaign root seed.
- Derive independent named streams with canonical SHA-256 inputs containing the
  contract version, root seed, and stable stream identifier.
- Separate identity, appearance, arrivals, clinical-presentation selection,
  operational events, breakdowns, staff call-offs, unavoidable complications,
  and cosmetics.
- Store every initialized stream's exact state and draw counter in the campaign
  snapshot; store durable generated outcomes on their entities.
- Sort eligible choices by stable identifiers and use pinned unbiased
  integer-range, weighted-selection, and probability rules.
- Keep clinical truth and progression guarantees outside random selection.
- Never use `Math.random()` in domain rules or use the game generator for
  security.
- Preserve golden vectors, save/reload continuation tests, cross-browser
  fixtures, and multi-seed balance simulations.

The root seed is not a complete replay by itself: exact reproduction also
depends on pinned versions, adopted clinical releases, prior state, eligibility,
and player actions. This accepted choice is recorded in
[ADR 0018](docs/adr/0018-versioned-named-random-streams.md).

## Testing architecture

- Unit tests for calculations and transitions
- Golden tests for FSRS mapping and scheduler upgrades
- Deterministic replay tests for seeds and saves
- Save migration and round-trip tests
- Schema and publication validation tests
- Database permission tests
- Phone and desktop end-to-end tests
- Headless multi-seed simulations for balance and softlocks
- Accessibility checks for text, keyboard, touch, contrast, and sound-off use

## Serious alternatives

### Godot-centered game

Benefits: mature 2D editor and traditional game workflow.

Costs: separate admin web stack, more difficult responsive text UI, web/mobile export caveats, and likely duplication between game and administration code.

### DOM/canvas without Phaser

Benefits: fewer dependencies and direct web control.

Costs: the project must build camera, scene, sprite, input, and map conveniences itself.

### Firebase backend

Benefits: mature hosted authentication and offline-oriented clients.

Costs: versioned relational clinical content and balance dependencies are less natural, with greater document-model lock-in.

### Self-hosted backend

Benefits: maximum control.

Costs: patching, TLS, firewalls, backups, monitoring, uptime, and incident response become the owner's ongoing responsibility.

## Explicit approval checkpoint

Before implementation begins, Melissa must confirm:

> I approve the architecture, data/versioning plan, vertical-slice scope, and initial deployment target described in the approved documents.
