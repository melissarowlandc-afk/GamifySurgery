# Architecture Proposal

Status: PROPOSED AND UNAPPROVED. This document does not authorize implementation.

Last updated: 2026-07-22

## Recommended coherent architecture

Use a TypeScript monorepo containing a responsive player web application, a separately deployed administrator application, shared deterministic game rules, shared data contracts, publishing validators, migrations, and tests.

Recommended components:

- React for text, forms, clinical questions, navigation, accessibility, and responsive interface panels
- Phaser for the top-down facility canvas, camera, sprites, and direct map interaction
- Pure TypeScript domain modules for facility simulation, economy, progression, queues, FSRS coordination, and seeded randomness
- Managed PostgreSQL, provisionally Supabase, for identity, releases, campaigns, saves, and protected administration data
- Server-side protected functions for publishing, save revision checks, administrator operations, and other trusted transitions
- Static web hosting, provisionally Cloudflare Pages or an equivalent standards-based host
- A pinned TypeScript FSRS library behind a project-owned interface

The exact providers and frameworks are RED decisions and require explicit approval.

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

Proposed spatial model:

- Integer logical tiles independent of screen pixels
- Expandable map bounds
- Room footprint masks
- Explicit valid doors and fixtures
- Walkability grid and A* paths
- Pixel-perfect camera zoom levels where practical
- Pan, zoom, select, and build controls designed separately for mouse and touch

### Simulation domain

The simulation is independent of React and Phaser.

It owns:

- Facility clock and pause state
- Task creation and queues
- Staff eligibility and assignment
- Patient arrivals and episode state
- Construction and room state
- Economy, XP, satisfaction, and objectives
- Random-event eligibility and guarantees
- Inspection state and scoring inputs

Simulation uses a fixed logical tick rather than animation frames. Exact tick duration is a tunable value. Probabilities are defined per eligible task or unit of facility time.

### Educational domain

The educational domain owns campaign-specific:

- FSRS cards
- Review log
- Mastery evidence
- Concept eligibility
- Variant recency
- Due-concept prioritization

Only the first scored submission updates FSRS. Explanation viewing, retry practice, and APP automation are separate event types.

### Runtime API

The runtime API or protected database functions handle:

- Account and session validation
- Release-manifest retrieval
- Campaign creation
- Revision-checked save writes
- One-active-writer conflict policy
- Trusted timestamps where required
- Rate limits and audit-relevant security events

### Administrator application

The administrator application is a separate build and deployment, even if it shares a repository and design system.

It eventually supports clinical and balance editing, but the first approved slice should limit scope to structured import/editing, validation, preview, approval, publishing, release history, and rollback.

Administrator access requires:

- A verified administrator account
- MFA
- An explicit administrator role
- A protected server-side publishing path
- A separate access gate before any internet deployment

### Database boundaries

For the pilot, one managed PostgreSQL project may contain separate schemas or comparably strong boundaries for:

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

## Browser and phone behavior

- Full gameplay is available on both desktop and phone.
- Desktop may show the facility and contextual panels together.
- Phone uses drawers, tabs, and map pan/zoom rather than removing systems.
- Touch targets and normal interface text must meet accessibility needs.
- Sound is optional and never the sole signal.
- The game should not reward faster reading of clinical material.

Whether facility time auto-pauses whenever the page becomes hidden is still open. Browser suspension makes uninterrupted hidden-tab simulation unreliable; auto-pause is recommended.

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

Recommended campaign storage combines:

- A versioned campaign snapshot for current operational state
- An immutable educational review log
- An auditable money ledger
- A save revision for concurrency
- Version references for content, balance, save schema, FSRS integration, and randomness

When a stale device attempts to save, the write is rejected. The player must reload the current version or explicitly take over after being warned.

## Content and balance publication

Authoring data is mutable. Published releases are immutable.

Publishing flow:

1. Edit a draft.
2. Validate structure and relationships.
3. Verify sources and required approvals.
4. Preview the exact candidate release.
5. Publish an immutable numbered release.
6. Move the current-release pointer for new campaigns.
7. Preserve prior releases for pinned saves and rollback.

Clinical and balance releases are independent. An audited emergency-withdrawal mechanism is needed for a materially incorrect clinical item; it must not silently rewrite a historical release.

## Seeded randomness

Recommended design:

- Store a campaign root seed.
- Pin the pseudorandom algorithm version.
- Derive named streams for identities, appearance, arrivals, presentation selection, events, failures, and cosmetics.
- Store stream state or counters in the save.
- Keep progression guarantees outside random selection.
- Never use unseeded randomness in domain rules.

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

