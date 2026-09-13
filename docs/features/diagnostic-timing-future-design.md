# Future task: surgery-center diagnostic timing

Owner request, September 13, 2026: discuss and design this in a future task.

The current ultrasound, laboratory and other diagnostic durations are prototype
placeholders, not final balance values or real-world clinical turnaround times.
Eventually, the estimate shown for each testing answer choice and the duration
used for its resulting service must come from the same runtime calculation,
based on the player's surgery center.

The owner still needs to decide how equipment, rooms, staffing and upgrades
affect that calculation. Future design should also decide how available
in-house versus outsourced routes and workload affect the estimate, and whether
an in-progress test keeps its original duration when the facility changes.
These are open design questions, not approved mechanics.

Current integration to build on: `getAnswerChoiceServicePreview` in
`packages/game-domain/src/selectors.ts`, service routing and timing in the domain
balance context, and chart duration formatting in
`apps/player/src/session/viewModels.ts`. Retain estimates for every testing
choice, including distractors; do not put fixed durations inside authored
question prose or use timing availability to reveal the correct answer.

The September 13 presentation repair documents this follow-up. It does not
choose upgrade effects, replace timing balance values or implement the future
facility timing design.
