# ADR 0023: Multiple-Choice Clinical Assessment

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: RED game-design decision

## Context

The original concept considered searchable catalogs for tests, diagnoses, and
treatments. That approach can feel more simulation-like, but it substantially
increases mobile-interface complexity, authoring burden, ambiguity in scoring,
synonym handling, partial-credit rules, and clinical validation.

The owner selected traditional multiple-choice assessment for every tested
clinical concept.

## Decision

Every scored clinical Decision Node uses a single-select multiple-choice
Question Variant:

- It presents a finite set of answer choices.
- Exactly one displayed choice is clinically correct.
- The first submitted choice is final for scoring.
- Correct maps to Good and incorrect maps to Again for the node's one primary
  Tested Concept.
- The number of choices may vary when clinically appropriate; the authoring
  interface does not force one universal count.
- Every distractor, the correct answer, and the explanation require clinical
  review and source support as applicable.
- Answer order may be shuffled only when the exact Question Variant declares
  that shuffling is safe.

A patient episode may contain several sequential multiple-choice Decision
Nodes, but each node independently tests exactly one primary concept. Feedback
may be deferred when revealing it would disclose a later scored answer.

Concepts still return through different Patient Presentation Variants and
Question Variants. Multiple choice does not mean repeating identical stems or
answer sets.

Search, autocomplete, and menus remain available for non-assessment activities
such as construction, staffing, filtering the clinical library, or other
ordinary game controls. They do not score clinical knowledge. Any later
proposal for scored free-text, searchable-catalog, ordering, matching, or
multi-select assessment requires a new owner-level game-design decision.

## Consequences

- The first playable patient is faster to build and easier to use on phones.
- Scoring remains unambiguous and aligns cleanly with one-concept FSRS updates.
- Clinical content authors must create plausible, non-cueing distractors and
  varied questions to reduce recognition by wording alone.
- The interaction is less open-ended than the earliest simulator concept, so
  management consequences, patient variation, and facility activity must carry
  more of the game feeling.

## Cost of changing later

Expensive after substantial content authoring. A different assessment mode
would require new content fields, validators, scoring rules, feedback behavior,
accessibility work, runtime controls, tests, and possibly reinterpretation of
learning evidence. The general Decision Node boundary will remain extensible,
but no alternate scored mode is in the current scope.
