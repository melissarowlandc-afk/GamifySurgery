# Canonical Design

Status: Accepted product rules plus clearly marked open proposals. No implementation authorization.

Last updated: 2026-07-22

## Core experience

The player operates a fictional surgical facility that visibly grows from a founder-run desk clinic into an ambulatory surgery center. Clinical knowledge advances learning; operational judgment advances the facility. Neither loop should trivialize or corrupt the other.

## Educational loop

- The smallest scheduled educational unit is a clinical concept.
- Each concept is one FSRS card within a campaign.
- The first scored answer to a decision maps incorrect to Again and correct to Good.
- The player does not report confidence.
- Concepts return through different fictional patients and question variants.
- Explanations teach after the answer without creating another scored review.
- APP-handled encounters do not update FSRS and do not count as active recall.
- Clinical truth never depends on randomness, room quality, or staff training.
- Only Melissa may clinically approve material for publication.
- AI-generated content remains draft material.
- Commercial question-bank wording must not be copied or closely paraphrased.
- Sources, approval state, and provenance remain attached to content revisions.

### Campaign-scoped scheduling

Each campaign owns its own concept cards, review log, mastery evidence, and next-due times.

- A new campaign initializes a new learning schedule.
- Starting a new campaign does not alter an older campaign.
- Reopening an older campaign resumes that campaign's schedule.
- Account identity may own several campaigns, but there is no account-wide scheduler that advances all campaigns together.
- Prior campaign mastery must not automatically complete new-campaign XP, encounters, objectives, or operational requirements.

This is an accepted foundational decision. Changing to account-wide scheduling later would require a learning-history migration and new rules for merging conflicting campaign card states.

### Mastery

Current mastery requires all of the following within the campaign:

- At least three correct responses
- Correct responses on three different real-world dates
- At least two patient variants
- Current FSRS interval of at least 21 days

UTC timestamps should be preserved. The timezone used to define a distinct real-world date remains an open decision.

### Review selection

Review selection should:

- Prioritize overdue concepts
- Avoid excessive clustering
- Interleave categories
- Prefer variants not seen recently
- Occasionally contrast easily confused diagnoses
- Guarantee progression-critical educational content once eligible

FSRS determines when a concept is due. A separate selection layer determines which due concept and eligible variant appears in the facility.

## Management loop

- Staff automatically handle routine work.
- Staff have home rooms, permitted work areas, salaries, morale, training, and task queues.
- Staff and room quality affect operations, capacity, speed, reliability, morale, waste, and finances.
- The player is not required to dispatch every minor task.
- The pharmacist manages medication inventory automatically.
- Medication stockouts lose dispensing revenue and may slightly reduce satisfaction; they do not block care.
- Outsourced diagnostic or repair fallbacks may exist.
- Vending machines and coffee kiosks are enclosed buildable rooms.
- The GLP-1 telehealth suite is a limited comedic side business, not the dominant strategy.
- Bankruptcy recovery does not require loans.

## Time

- Facility time and learning time are separate clocks.
- Facility operations occur only while the game is open and unpaused.
- FSRS uses real-world time and continues while the game is closed.
- A clinical decision does not silently pause facility time.
- The player must have an obvious Pause control.

The meaning of "open" when a browser tab is hidden, a phone locks, or the operating system suspends the page is not yet approved.

## Progression

- Money and educational XP are distinct.
- Level advancement uses defined accomplishments, XP, and satisfaction above 90% at the moment the player selects Level Up.
- No separate cash-balance condition is required for level advancement.
- Construction costs create the financial constraint.
- Facility stage, educational difficulty, clinical complexity, room upgrade level, and employee training level are separate concepts.
- Room and employee upgrade/training tracks each use Levels 1-5.
- The end-game challenge is an elective inspection week with a score and recognition tier.
- Continued play and later inspection reattempts remain possible.

## Randomness

- Every campaign stores a seed.
- Randomness may affect identities, appearance, eligible variants, arrivals, events, breakdowns, call-offs, and unavoidable complications.
- Randomness must not change clinical truth.
- Randomness must not prevent essential educational content.
- Progression-critical events are guaranteed once eligible.
- Probabilities are evaluated per eligible task or unit of facility time, never per animation frame.

The exact pseudorandom generator and stream model remain unapproved.

## Visual and interaction direction

- Top-down management view
- Central visible facility
- Compact contextual panels
- Black-and-white or grayscale
- Simple large-pixel graphics
- Text as a deliberate part of the style
- Legibility and clarity before visual detail
- Full desktop and phone functionality through responsive layouts
- Complete usability with sound disabled

No final mockup, pixel scale, font, layout, or control scheme has been approved.

## First playable experience

The first minute should show a tiny facility, founder, entrance, one immediate objective, basic resources, and a visible time state. The two tutorial patients should separately teach a clinical decision and the management consequences around arrivals, time, queues, and construction.

The exact clinical cases, costs, rewards, and tutorial script remain open and must not be invented without approval.

