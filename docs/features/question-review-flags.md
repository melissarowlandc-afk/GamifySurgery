# Question Review Flags

Status: Implemented for the browser prototype

Every displayed authored clinical question includes a small non-scoring flag
control. Selecting it records the frozen question revision the player actually
saw without changing the answer, encounter, rewards, FSRS history, facility
time, or clinical-content approval state.

## Captured record

Each local flag stores:

- clinical release, case, presentation, instantiation profile, decision,
  Question Variant, and primary Concept IDs;
- the frozen presentation, stem, displayed answer order, keyed answer,
  explanation, and source labels;
- campaign, clinic, facility time, selected answer, and correctness when
  available; and
- first/last flag time, occurrence count, bounded occurrence history, and
  developer-review status.

The deduplication identity includes the frozen clinical release, case,
presentation, instantiation profile, Question Variant, and exact frozen
presentation/question/answer/explanation wording. Answer-order shuffling alone
does not create another item. A wording revision does. Reflagging a reviewed
item reopens it and adds an occurrence.

## Storage and review

The GitHub Pages prototype has no authorized shared write backend. Flags are
therefore stored in browser `localStorage` under
`gamify-surgery.question-review-flags.v1`, independently from campaign saves.
They survive campaign restart but can be lost if site data is cleared.

The developer queue is intentionally hidden from ordinary gameplay because it
contains answer keys. Open the prototype with `?question-review=1` to access
the footer's **Question flags** control. The queue can mark items reviewed or
open and export a versioned JSON packet for later owner/developer review.

Cross-device aggregation requires a separately approved authenticated backend
and is not implied by this local implementation.
