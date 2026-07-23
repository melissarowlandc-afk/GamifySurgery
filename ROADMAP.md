# Roadmap

Status: PROPOSED. Dates and implementation estimates are intentionally deferred until architecture approval.

Last updated: 2026-07-23

## Phase 0: Reconcile and decide

- Review this documentation package.
- Resolve RED decisions in small batches.
- Select pilot clinical concepts without inventing content.
- Approve the conceptual data and versioning approach.
- Approve vertical-slice scope and acceptance criteria.
- Approve the initial deployment target.
- Record every accepted RED decision in an ADR.
- Resolve Y-017, then create and test the nontechnical clinical authoring
  workbook so Melissa can begin knowledge-base and content work before game
  implementation finishes.

Gate: explicit four-part approval. No implementation before it.

## Phase 1: Foundation milestone

Only after approval:

- Establish owner-controlled version history.
- Create the smallest monorepo structure.
- Add shared data validation and version identifiers.
- Add deterministic browser-authoritative simulation and seeded test harness.
- Demonstrate a blank responsive shell on desktop and phone.

Demonstration gate: project structure, tests, and no buried tunable values.

In parallel, Melissa may populate the approved clinical workbook. Bulk
authoring should begin only after one or two concepts successfully round-trip
through validation and preview.

## Phase 2: Educational loop milestone

- Load approved structured clinical content.
- Present one scored clinical decision.
- Map first answer to Again or Good.
- Show explanation and sources.
- Persist campaign-specific FSRS state.
- Reopen and reproduce due state using real-world time.

Demonstration gate: clinical accuracy review and scheduler tests.

## Phase 3: Management loop milestone

- Founder and front desk
- Facility clock and Pause
- Guaranteed tutorial patients
- Money, XP, and satisfaction
- First examination-room construction
- One staff role or queue behavior
- Cleaning or another visible routine task

Demonstration gate: worst-case tutorial cannot softlock.

## Phase 4: Versioning and administration milestone

- Separate clinical and balance drafts
- Validate and preview release candidates
- Require clinical approval
- Publish immutable numbered releases
- Pin campaign versions
- Demonstrate rollback and rejected draft access

Demonstration gate: live game cannot read unfinished drafts.

## Phase 5: Save and identity milestone

- Invite-only verified-email account
- Hidden internal identity
- Cloud save and revision checks
- Cross-device reopen
- Stale-device conflict warning
- Recoverable Start Over flow with an archived prior campaign
- Administrator MFA and permission tests

Demonstration gate: no cross-account access, no silent overwrite, and no
one-action campaign loss.

## Phase 6: Private pilot readiness

- Desktop and phone polish
- Sound-off verification
- Backup and restore test
- Privacy and educational-use notices
- Optional manual feedback route
- Owner and husband staging test

Gate: explicit permission to invite outside testers.

## Deferred expansion

- Additional concepts, cases, and variants
- Facility stages two through five
- Advanced rooms and staffing
- Diagnostics, pharmacy, side businesses, and maintenance
- Inspection week
- Full admin usability suite
- Public release
- Native distribution
- Research features
