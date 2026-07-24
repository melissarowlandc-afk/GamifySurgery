# Roadmap

Status: ACTIVE PROTOTYPE-FIRST PLAN under ADR 0021. Dates remain flexible and
each milestone ends in something the owner can inspect or play.

Last updated: 2026-07-24

## Delivery rules

- Combine the educational and management loops as early as possible.
- Use synthetic, clearly unapproved fixture content until Melissa supplies and
  approves real clinical material.
- Keep tunable values and content outside source logic from the first build.
- Prefer a small working experience over a broad empty framework.
- Harden security, publishing, and cloud behavior before outside testing, not
  before the first local play session.

## Milestone 0: Reconcile and prepare

- Preserve the reconstructed design intent and superseded explorations.
- Apply the accepted multiple-choice clinical-interaction rule.
- Create the monorepo skeleton, shared validation, and deterministic test
  harness.
- Prepare the owner-controlled clinical authoring workbook and test its shape
  with one or two concepts before bulk entry.

Outcome: the project is ready for code and Melissa can begin structured
clinical collection in parallel.

## Milestone 1: Playable local prototype

- One tiny room, founder, entrance, facility clock, Pause, and visible resources
- One arriving fictional patient using synthetic fixture content
- Waiting, Active, and Resolved chart tabs, including a pending-result step and
  an action-required exclamation point
- A transparent outsourced result wait with a visible facility-time ETA and no
  progress while paused
- A visible Waiting-patient patience warning, first-open protection, and a
  guaranteed non-abandoning tutorial patient
- One short clinical decision sequence, instructional feedback, and an
  approved final diagnosis-and-management summary with optional viewing
- Money, XP, and satisfaction reactions
- Build and place the first examination room
- Restart the prototype safely
- Basic desktop and phone layouts

This version may use local storage and omit accounts, cloud saves, full FSRS,
the complete admin system, and production publication. Its purpose is to test
whether the combined loop is understandable and enjoyable.

Demonstration gate: the owner can play from patient arrival through the first
room construction without developer explanation, and never loses track of
whether the patient is waiting, pending a result, ready for action, or resolved.

## Milestone 2: Coherent vertical slice

- Two guaranteed tutorial patients
- At least one concept with meaningful patient and question variants
- Campaign-scoped FSRS and real-world due behavior
- Deterministic arrivals and one queue or automated staff behavior
- At least one result route whose timing changes when an appropriate in-house
  capability is available
- Save/reload restoration of Active pending-result and action-required charts
- Deterministic Waiting departure and capped Active delay consequences without
  losing an educational question
- Versioned clinical and balance fixtures
- Save, close, reopen, and deterministic continuation
- Worst-case tutorial funding that cannot softlock

Demonstration gate: educational scheduling, management progression, and
save/reload work together.

## Milestone 3: Content and authoring pipeline

- Import structured workbook data as Draft content
- Validate concepts, sources, variants, questions, and constrained templates
- Preview seeded patient instances
- Separate clinical approval from technical validation
- Produce immutable local clinical and balance release artifacts

Demonstration gate: unapproved or invalid content cannot enter the playable
release.

## Milestone 4: Private cloud foundation

- Invite-only verified-email accounts
- Supabase persistence and cloud save revision checks
- Cross-device reopen and explicit writer takeover
- Separate staging and pilot environments
- Protected administrator deployment, MFA, and permission tests
- Backup, restore, rollback, and clinical withdrawal drills

Demonstration gate: no cross-account access, silent overwrite, exposed
administrator surface, or unrecoverable save migration.

## Milestone 5: Private pilot readiness

- Desktop and phone usability polish
- Sound-off verification
- Privacy and educational-use notices
- Optional approved feedback route
- Owner and trusted-family staging test
- Clinical-content review complete

Gate: explicit owner permission before inviting outside testers.

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
