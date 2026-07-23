# Clinical Content Model Proposal

Status: PROPOSED AND UNAPPROVED. No clinical content has been authored or approved.

Last updated: 2026-07-22

## Goals

- Schedule learning at the concept level.
- Present the same concept through varied fictional patients and questions.
- Preserve clinical truth, sources, provenance, revisions, and approval.
- Prevent draft or unapproved material from reaching players.
- Avoid copying or closely paraphrasing commercial question banks.
- Support safe publishing, rollback, and emergency correction.

## Proposed hierarchy

### Clinical concept

The smallest scheduled unit. Each concept becomes one FSRS card inside each campaign that includes it.

Examples must not be invented until Melissa chooses and approves pilot concepts.

### Case

A coherent fictional clinical situation. A case can contain one or more decision nodes, but every scored node should identify one primary concept.

### Variant

A clinically equivalent or intentionally contrasting presentation. Variant metadata can include difficulty, demographic constraints, recency controls, and eligibility conditions.

Changing superficial details must not introduce unsupported demographic assumptions or change the correct answer accidentally.

### Decision node

Contains the presentation visible at that point, prompt, answer mode, choices, primary concept, explanation, and source links.

Recommended scoring rule:

- First submitted answer only updates FSRS.
- Incorrect maps to Again.
- Correct maps to Good.
- Correction after feedback is practice, not a second review.
- APP automation is operational, not recall.

### Answer and rationale

Each answer choice should explain why it is correct or incorrect. A general explanation may then summarize the clinical principle.

### Source

Each source should preserve enough information to identify it later, including title, publisher or journal, link/identifier when available, date accessed, and which claims it supports.

## Confusion and contrast

Concepts may have explicit confusion relationships. These relationships allow the selector to occasionally contrast easily confused diagnoses without changing their independent FSRS schedules.

Contrast should not force a non-due concept to become a scored review merely to create a pair. An optional unscored contrast or a pairing of two already-eligible concepts is safer.

## Workflow states

Recommended states:

1. Draft
2. Needs clinical review
3. Clinically approved
4. Included in release candidate
5. Published
6. Retired or withdrawn

AI involvement is recorded at the revision level. AI output cannot skip clinical review.

## Publication validation

A clinical release candidate should fail validation when, at minimum:

- A scored decision lacks a primary concept.
- Correctness is missing or internally inconsistent.
- A required explanation is absent.
- Required source information is absent.
- A record is not clinically approved by Melissa.
- A referenced case, variant, answer, or concept is missing.
- Stable identifiers are duplicated.
- A concept has no eligible presentation.
- Variant eligibility could prevent required content from appearing.
- A release would unexpectedly change a pinned campaign's mastery denominator.

## Published releases

Published releases are immutable. A new correction creates a new revision and release; it does not overwrite a prior release.

Campaigns remain pinned to their release and core-concept set. An emergency withdrawal can stop a known incorrect item from being selected, but its replacement and mastery effect must be explicit and audited.

## No-PHI rule

- All patients are fictional.
- No user interface or administrator field should invite real patient details.
- Free-text administrator notes must display a no-PHI warning.
- Imported files must be reviewed for PHI before upload.
- Production logs must not capture free-text clinical drafts unnecessarily.

## Open content decisions

- Pilot concepts and categories
- Exact number of cases and variants
- Single-choice versus other answer modes
- Whether a patient episode may contain several independently scored decisions
- Variant difficulty labels and eligibility
- Emergency withdrawal compatibility behavior
- Retired concept behavior in old campaigns
- Source minimums and review cadence

