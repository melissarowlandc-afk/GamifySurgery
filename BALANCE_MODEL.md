# Balance Model Proposal

Status: PROPOSED AND UNAPPROVED. No numerical balance values are canonical.

Last updated: 2026-07-22

## Principle

Every important tunable value receives a stable identifier, explicit unit, documented meaning, safe default, validation rules, and release history. Tunable numbers should not be scattered through source code.

## Proposed balance areas

- Facility-stage requirements and accomplishments
- Room costs, footprints, construction duration, dependencies, capacity, and upgrade levels
- Staff salaries, permitted work, morale, training costs, and modifiers
- Task durations, priority, capacity, and failure conditions
- Patient arrival and queue parameters
- Revenue and expense reason codes
- Satisfaction inputs, penalties, recovery, and threshold behavior
- XP awards and progression requirements
- Cleanliness and maintenance decay
- Outsourcing availability and cost
- Medication stockout revenue and satisfaction effects
- Event eligibility, probability units, cooldowns, and guarantees
- Complication effects that do not change clinical truth
- Inspection scoring and recognition tiers
- Bankruptcy-recovery rules
- Vending, coffee, pharmacy, and limited GLP-1 side-business values

## Stable balance key

Each key should have:

- Stable machine identifier
- Friendly label
- Description and tooltip
- Data type
- Unit
- Default value
- Minimum and maximum when appropriate
- Validation dependencies
- Category and search tags
- Rationale or design note
- Revision history

Examples of units include integer cents, facility seconds, capacity count, percentage points, and probability per eligible task. A bare number without a unit is invalid.

## Definitions and runtime instances

Balance releases define room types, roles, tasks, events, and progression rules. Campaign saves contain room, employee, task, and event instances that reference those definitions.

Existing campaign instances continue to interpret their data using their pinned balance release unless an explicit migration is approved.

## Publishing

Recommended flow:

1. Edit a draft or named preset.
2. Validate individual ranges and cross-record dependencies.
3. Preview changes against representative campaign states.
4. Run deterministic simulations across many seeds.
5. Compare key outcomes with the previous release.
6. Publish an immutable numbered balance release.
7. Make it current for new campaigns only unless a migration is explicitly offered.

## Required validation examples

- No room depends on an impossible unlock.
- Every progression-critical event has a guarantee path.
- Probabilities identify their eligible unit and are never per frame.
- Tutorial funding remains possible after worst-case clinical answers.
- A required task always has an eligible worker or approved fallback.
- Satisfaction can recover above the level-up threshold.
- A salary or construction cost cannot silently change units.
- Upgrade Levels 1-5 remain distinct from facility stages and staff training Levels 1-5.
- Side businesses cannot dominate the intended management strategy.

## Simulation reports

The headless simulator should report distributions rather than only averages, including:

- Time to first room
- Time at each facility stage
- Cash minimums and bankruptcy events
- Queue lengths and wait times
- Staff utilization
- Satisfaction range and recovery time
- Construction choices
- Dominant revenue sources
- Frequency of eligible events
- Frequency of progression guarantees

No simulator results exist yet.

## Open balance decisions

- All numerical defaults
- Tutorial starting cash and guaranteed revenue
- XP award rules after correct and incorrect answers
- Satisfaction calculation and rounding
- Facility-time speed controls
- Pay-cycle timing
- Construction placement correction rules
- Bankruptcy trigger and recovery behavior
- Inspection formula

