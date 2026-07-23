# Data Model Proposal

Status: PROPOSED AND UNAPPROVED. This is a conceptual model, not a database schema.

Last updated: 2026-07-22

## Principles

- Use stable opaque internal identifiers; names and display labels may change.
- Keep authentication identifiers separate from gameplay and learning records.
- Distinguish definitions from runtime instances.
- Distinguish mutable drafts from immutable releases.
- Pin every campaign to explicit versions.
- Use integer cents for money and explicit units for every duration and probability.
- Store timestamps in UTC and record the timezone rule used for calendar-date mastery.
- Preserve provenance and approval history.
- Do not provide fields intended for PHI.

## Identity domain

### Account

Represents an authenticated pilot user through a hidden internal ID.

Relationships:

- One authentication identity
- One display profile
- Zero or more campaigns
- Zero or more optional manual feedback submissions

The account ID, not email, owns campaigns and records.

### Authentication identity

Contains or references the verified email and authentication-provider state. It is permission-separated from gameplay and learning data.

### Display profile

Contains the chosen display name and non-sensitive preferences such as learning timezone and accessibility settings.

## Clinical authoring domain

### Clinical concept

The stable educational unit and FSRS card identity within a campaign.

Potential attributes include category, objective, aliases, status, confusion relationships, and stable lineage.

### Fictional patient case

Defines a clinical scenario independent of a single wording or demographic presentation.

### Patient variant

Provides an approved variation in fictional demographics, symptoms, context, or presentation while preserving clinical truth.

### Decision node

Presents a scored or unscored choice within a case. The recommended rule is one primary FSRS concept per scored node.

### Answer choice

Belongs to a decision node and preserves correctness plus choice-specific rationale.

### Explanation

Provides the post-answer teaching explanation. It may reference several sources but does not create an additional review.

### Source

Preserves citation, link or identifier, date accessed, notes, and any relevant licensing information.

### Content revision and approval

Every edited record has revision history, provenance, AI-draft indication, workflow state, and clinical approval record. Only Melissa can provide clinical approval.

## Published-content domain

### Clinical release

An immutable numbered collection of exact clinical revisions with validation result, approver, timestamp, and checksum.

### Core-concept set

The exact concept identifiers used for a campaign's mastery denominator. It remains stable for that campaign.

### Emergency withdrawal

An audited overlay that prevents selection of a known incorrect item while preserving the historical release. Replacement and compatibility behavior remains an open decision.

## Balance domain

### Balance key

A stable, documented identifier with value type, unit, default, validation range, explanation, and category.

### Balance release

An immutable numbered set of balance values and referenced game definitions.

### Facility-stage definition

Defines accomplishments, XP requirements, satisfaction threshold, unlocks, and dependencies.

### Room-type definition

Defines footprint rules, allowed doors, build requirements, capacities, work areas, upgrade track, modifiers, and costs.

### Staff-role definition

Defines permitted tasks and work areas, salary rules, training track, capacity, and operational modifiers.

### Task definition

Defines requirements, duration, priority rules, outcomes, and eligible staff or rooms.

### Event definition

Defines eligibility, probability unit, cooldown, guarantees, outcomes, and whether it is progression-critical.

## Campaign domain

### Campaign

Owned by an account and pinned to:

- Clinical release
- Core-concept set
- Balance release
- Save-schema version
- FSRS integration/parameter version
- Random-generator version
- Campaign seed

### Campaign snapshot

Captures current operational state and has an increasing revision number.

### Room instance

References a room-type definition and records placement, construction, upgrade, condition, cleanliness, capacity, and occupants.

### Employee

References a staff-role definition and records salary, morale, training, home room, work permissions, task queue, and current task.

### Runtime patient episode

References approved fictional content and records arrival, queue state, selected variants, services, scored decisions, and operational outcome.

### Runtime task

References a task definition and records queue, eligibility, assignment, progress, and completion.

### Money ledger entry

Records each economic change with integer amount, reason code, facility time, and related entity. Current cash is derived or reconciled from the ledger.

### Progression state

Records XP, satisfaction, objectives, facility stage, accomplishments, unlocks, and level-up attempts.

### Inspection attempt

Records eligibility snapshot, scoring-rule version, component scores, recognition tier, and completion date.

## Campaign learning domain

### Concept card

One card per campaign and concept. Stores the FSRS state and pinned algorithm/parameter version.

### Review record

Immutable record of the first scored response, including concept, case and variant, correctness, Again/Good rating, UTC timestamp, and resulting card state.

### Mastery evidence

Derived from review history, distinct calendar dates, distinct variants, and current interval. A cached mastery flag may exist but must be reproducible.

### Non-review educational event

Separately records optional practice, explanation viewing, or APP automation when operationally useful. It must not alter FSRS.

## Operational records

Only essential security/error records are authorized. No gameplay telemetry is currently authorized.

Security/error records should minimize personal data, use a documented retention period, and not become a hidden playtest analytics system.

## Expensive choices still open

- Exact content-version compatibility model
- One primary concept versus multi-concept scoring
- Snapshot layout and normalized/runtime split
- Hidden-tab facility-time semantics
- Save takeover and conflict UX
- Random generator and stream-state representation
- Timezone changes and distinct mastery dates
- Emergency clinical correction behavior

