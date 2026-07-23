# Balance Model Proposal

Status: The initial FSRS desired-retention value below is accepted. All other
numerical balance values remain proposed and unapproved.

Last updated: 2026-07-23

## Principle

Every important tunable value receives a stable identifier, explicit unit, documented meaning, safe default, validation rules, and release history. Tunable numbers should not be scattered through source code.

## Accepted initial learning setting

| Stable identifier | Value | Unit and meaning | Scope |
|---|---:|---|---|
| `learning.fsrs.requested_retention` | `0.90` | Target probability of successful recall at the scheduled review time | Fixed pilot default, stored in the immutable balance release and pinned by each campaign |
| `learning.remediation.minimum_real_minutes` | `30` | Minimum real-world minutes after an Again response before the concept is eligible again | Fixed pilot default, stored in the immutable balance release and pinned by each campaign |
| `learning.remediation.max_same_date_encounters` | `1` | Maximum additional scored remediation encounters for the concept on the same learning date | Fixed pilot default, stored in the immutable balance release and pinned by each campaign |

These values are not player-adjustable during the pilot. Desired retention is a
scheduling target, not a guaranteed learner score. A newly published value
applies to new campaigns by default. An active campaign keeps its permanently
pinned value. Simulations should compare projected workload and mastery timing
at 85%, 90%, and 95% before a larger concept set is published.

The accepted remediation rules also require a different approved presentation,
do not force an extra patient arrival, prefer an unrelated encounter in between
when the content pool permits, and never award an additional mastery date for a
same-date response. Exact progression rewards remain open but must make
intentional incorrect-answer farming unprofitable.

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
- Facility logical-step duration, permitted visible speed controls, and bounded
  visible-stall handling
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

Existing campaign instances continue to interpret their data using the balance
release permanently pinned for the life of the campaign. Ordinary
clinical-content adoption cannot change balance values or introduce
dependencies absent from that pinned release.

## Publishing

Accepted release flow:

1. Edit a draft or named preset.
2. Validate individual ranges and cross-record dependencies.
3. Preview changes against representative campaign states.
4. Run deterministic simulations across many seeds.
5. Compare key outcomes with the previous release.
6. Publish an immutable numbered balance release.
7. Make it current for new campaigns only. Existing campaigns remain on their
   permanently pinned balance release.

## Required validation examples

- No room depends on an impossible unlock.
- Every progression-critical event has a guarantee path.
- Probabilities identify their eligible unit and are never per frame.
- Visible speed and rendering frame rate do not change facility outcomes.
- Random candidate weights are nonnegative integers with documented units and
  deterministic behavior when all weights are zero.
- A progression-critical event has a deterministic guarantee rather than only
  a favorable probability.
- Tutorial funding remains possible after worst-case clinical answers.
- A required task always has an eligible worker or approved fallback.
- Satisfaction can recover above the level-up threshold.
- A salary or construction cost cannot silently change units.
- Upgrade Levels 1-5 remain distinct from facility stages and staff training Levels 1-5.
- Side businesses cannot dominate the intended management strategy.
- A publisher-caused clinical withdrawal cannot claw back earned resources,
  create a penalty, or produce repeatable revenue or XP.
- A content-availability waiver affects progression gating only; it cannot
  fabricate mastery or APP automation.

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

- All numerical defaults other than the accepted initial FSRS desired retention
- Tutorial starting cash and guaranteed revenue
- XP award rules after correct and incorrect answers
- Satisfaction calculation and rounding
- Facility-time speed controls
- Pay-cycle timing
- Construction placement correction rules
- Bankruptcy trigger and recovery behavior
- Inspection formula
