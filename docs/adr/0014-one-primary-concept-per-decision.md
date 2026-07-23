# ADR 0014: One Primary Concept per Scored Decision

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The smallest scheduled educational unit is a clinical concept, and each concept
is one FSRS card within a campaign. A clinical question can draw on several
facts, but one submitted answer usually does not reveal which of several
underlying facts caused success or failure.

Updating several concept cards from one undifferentiated answer could create
false mastery after a correct response or penalize concepts the learner
understood after an incorrect response. Treating an entire patient encounter as
one composite card would undermine the accepted concept-level scheduling model.

## Decision

- Every scored clinical decision node identifies exactly one primary FSRS
  concept.
- The first submitted answer to that node updates only the primary concept's
  campaign card: incorrect maps to Again and correct maps to Good.
- Supporting concepts may be attached as authoring, search, confusion, source,
  or explanation references. They receive no automatic FSRS, mastery, or
  scheduling change from the answer.
- When a case needs to assess more than one concept, it uses separate
  independently scored decision nodes or separate encounters.
- Each independently scored node has its own visible answer opportunity,
  primary concept, correctness rule, feedback, explanation, and immutable
  review record.
- Publication validation rejects a scored node with no primary concept or more
  than one primary concept.
- Publication preview must identify cases where feedback or state changes from
  an earlier node reveal the answer to a later scored node.
- A future multipart interface may be represented as several independently
  scored nodes, but it cannot use one undifferentiated response to update
  several cards.

## Benefits

- Every FSRS transition is supported by one observable answer.
- Mastery and review histories remain interpretable and auditable.
- An incorrect response cannot indiscriminately penalize several concepts.
- Content authors can discuss clinically connected knowledge without granting
  unsupported scheduling credit.
- The schema, scheduler transaction, and administrator validation remain
  understandable.

## Risks and limitations

- Clinical review must identify the primary teaching objective explicitly.
- One response may rely on supporting knowledge that receives no direct
  scheduling credit.
- Complex cases may require additional separately authored nodes or encounters.
- Sequential nodes need careful feedback timing so one answer is not revealed
  by an earlier explanation.

## Alternatives considered

1. Update several concept cards from one submitted answer.
2. Use multipart submissions with independently scored subanswers as the
   default interaction.
3. Treat an entire patient encounter as one composite scheduled card.

## Cost and maintenance

There is no additional hosting cost. Ongoing maintenance is low to moderate:
content-authoring guidance, required-field validation, multi-node preview, and
tests proving that exactly one card changes per scored response.

## Cost of changing later

Expensive. A change would affect clinical-content relationships, administrator
forms, publication validation, review records, scheduler transactions, mastery,
XP attribution, selection rules, and saved learning histories. Historical
multi-concept reviews could not later reveal which concept the learner actually
recalled, so migration would be intrinsically lossy.
