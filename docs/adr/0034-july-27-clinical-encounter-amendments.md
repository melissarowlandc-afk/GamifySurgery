# ADR 0034: July 27 Clinical Encounter Amendments

Status: Accepted

Date: 2026-07-27

Decision owner: Project owner

Severity: RED clinical game-design and content-validation decision

## Context

The July 27 prototype review confirmed the assessment interaction and refined
the maximum encounter length, incorrect-answer behavior, rewards, and
patient-level consequences.

## Decision

- Every scored clinical decision remains single-select multiple choice.
  Search, autocomplete, free text, ordering, matching, and multi-select are not
  scored interaction modes in the current game.
- Question variation comes from approved stems, patient variants, answer
  wording, distractors, presentation order, and safely shuffled choice order.
- Encounters present one active decision at a time. Completed decisions
  collapse into reviewable rows containing the submitted answer, result,
  explanation, and XP.
- Published encounters may contain one through four scored Decision Nodes.
  Level 0 normally uses one or two. Levels 1 and 2 permit at most three. A
  four-node encounter is permitted only from Level 3 onward and must be rare
  and clinically justified.
- Each node continues to test exactly one distinct primary Tested Concept and
  produces exactly one campaign-scoped FSRS review.
- An incorrect nonfinal answer is recorded as incorrect, receives its
  incorrect-answer XP, explains the approved action, and then proceeds through
  the authored correct action and its ordinary simulation.
- Every incorrect final choice requires a clinically authored consequence
  record. The record states what occurred, the disposition or outcome,
  financial/time/resource/satisfaction effects, severity, preferred answer,
  explanation, provenance, and clinical approval.
- A consequence may explicitly describe no immediate harm, unnecessary
  referral, delay, expense, or unresolved symptoms. A bare
  `no_terminal_outcome` placeholder is not publishable.
- Runtime code never invents a complication, harm, or clinical correction.
- Pilot encounter payment is:
  - Level 0: `$15 + ($10 * question count) + ($50 * correct count)`.
  - Level 1: `$20 + ($15 * question count) + ($65 * correct count)`.
- Current-level Learning XP is `10` per correct decision and `2` per incorrect
  decision. Cash is paid once at encounter completion; XP is shown after each
  submitted decision.

## Amendments

This ADR keeps the assessment-mode decision in ADR 0023 and amends:

- ADR 0024 by raising the absolute publication maximum from three to four only
  for Level 3 and later;
- ADR 0025 by replacing tier-based pilot payment with the explicit formulas;
- ADR 0030 by requiring authored data for every incorrect final choice; and
- ADR 0033 by replacing zero incorrect-answer XP with two current-level XP.

## Cost of changing later

Expensive after clinical authoring. These rules affect content schemas,
validators, runtime state, feedback, FSRS evidence, rewards, migrations, and
chart interaction.
