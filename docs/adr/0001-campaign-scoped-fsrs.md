# ADR 0001: Campaign-Scoped FSRS Scheduling

Status: Accepted

Date: 2026-07-22

Decision owner: Melissa

Severity: RED

## Context

The game can associate spaced-repetition history either with the learner account or with an individual campaign. Account-wide scheduling preserves learning across every facility, while campaign-scoped scheduling lets each new game begin educational progression from the start.

## Decision

Each campaign owns its FSRS cards, review log, mastery evidence, and due dates.

- A new campaign initializes a new educational schedule.
- Reopening an existing campaign preserves and resumes that campaign's schedule.
- An account may own multiple campaigns, but their FSRS states are not automatically merged.
- Prior campaign mastery does not satisfy a new campaign's XP, encounters, objectives, or facility requirements.
- Each campaign remains pinned to its published core-concept set and content/balance versions.

## Benefits

- A new campaign provides a complete educational and progression experience.
- Campaign mastery and operational unlocks remain internally consistent.
- Old campaigns can be reopened without their schedules being overwritten by another campaign.

## Risks and limitations

- The same learner can have several independent schedules for the same concept.
- Starting over intentionally discards the scheduling advantage of prior campaigns.
- Cross-campaign learning reports cannot be interpreted as one FSRS card history without a separate aggregation model.
- Repeated campaigns may feel redundant to knowledgeable players.

## Rejected alternative

One account-wide FSRS profile shared by every campaign. This better represents lifetime learning but can cause a new campaign to automate or skip material and complicates campaign-specific progression.

## Cost of changing later

Expensive. Moving to account-wide scheduling would require rules for merging card states and review histories, resolving conflicting content versions, recalculating mastery, adjusting APP automation, and migrating every existing save.

