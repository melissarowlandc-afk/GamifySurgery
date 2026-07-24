# Balance Model Proposal

Status: The initial FSRS settings and the structural clinical-answer reward
relationship below are accepted. Other numerical balance values remain
agent-managed prototype defaults until validated and published.

Last updated: 2026-07-24

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
same-date response.

## Accepted clinical-answer reward relationship

- Basic operational revenue is settled per completed patient and provided
  services, not multiplied by the number of scored questions.
- Correct first submissions award educational XP and contribute to a modest,
  capped patient-level quality or satisfaction bonus.
- Incorrect first submissions forfeit the correctness bonus, never remove
  earned XP, and contribute to a small capped patient-level consequence.
- Multi-question patient bonuses and penalties are normalized and capped.
- Same-date remediation cannot award another clinical XP or quality bonus for
  that concept.
- Worst-case tutorial funding still covers the first examination room and an
  operating buffer.
- No intentional incorrect-answer strategy may have higher expected reward than
  correct play.

Exact amounts and formulas are balance values selected through simulation and
playtesting. The structural relationship is accepted in ADR 0025.

Terminal Clinical Outcome `minor` or `major` severity is clinical-content
metadata, not a balance multiplier. A wrong final answer uses the same
normalized patient-level consequence relationship as any other wrong answer.
It cannot override the cap, tutorial funding guarantee, progression safeguards,
basic completion-revenue rule, or one-review-per-node behavior. This separation
is accepted in ADR 0030.

## Accepted result-timing relationship

- Result delays advance in facility time only.
- Clinical content supplies the exact result and gate meaning; balance supplies
  operational turnaround and route behavior.
- Approved outsourced routes are slower than a functioning appropriate
  in-house service.
- In-house staff, capacity, and queues affect the timing and ETA resolved when
  the service is scheduled without changing the clinical result.
- The pending chart shows the best current facility-time ETA, labeled as
  approximate when appropriate.
- Prototype delays are deterministic. Future variation must be bounded, seeded,
  pinned, and persisted at scheduling.
- The action-required indicator appears only when a player action is ready.

Exact turnaround numbers, costs, queue capacities, and upgrade modifiers remain
agent-managed prototype defaults until simulation and playtesting support
publication. The structural relationship is accepted in ADR 0027.

## Accepted patient-patience relationship

- Only unopened Waiting patients may leave because of patience.
- Patience and warnings advance in facility time and remain visible without
  relying on sound or color alone.
- First chart opening cancels abandonment and protects the Active encounter.
- Reading the open chart creates no response-delay consequence for that patient.
- Operational delay and ignored action-ready charts may produce small, capped
  satisfaction effects after visible grace thresholds. Operational thresholds
  reference an explicit promised target or ETA rather than penalizing an
  ordinary unavoidable wait.
- Tutorial patients are exempt from abandonment and cannot cause an opening
  softlock.
- Leaving before being seen creates no review, clinical XP, completion revenue,
  mastery evidence, or answer disclosure.
- The final warning has observable facility-time grace at every supported speed,
  and answer/delay satisfaction effects share one patient-level cap.

Exact durations, warning bands, grace periods, satisfaction amounts, and caps
remain agent-managed prototype defaults until simulation and playtesting
support publication. The structural relationship is accepted in ADR 0028.

## Accepted clinic-workload relationship

- Clinic workload counts Waiting plus unresolved Active encounters; opening a
  chart is count-neutral.
- Terminal completion and pre-open departure release capacity. Optional summary
  viewing does not occupy a slot.
- Routine arrivals pause before instantiation when the routine workload limit
  is full and resume without a catch-up burst.
- Protected reserved slots are unavailable to routine arrivals and guarantee
  eligible tutorial or progression-critical cases.
- Functioning rooms, staff, upgrades, and published modifiers may change the
  effective limit. A capacity decrease never evicts existing cases.
- Clinic workload, physical seats, room occupancy, and service/task throughput
  use distinct stable identifiers and units.

Exact limits, reserve counts, contribution formulas, and arrival intervals are
agent-managed prototype defaults until simulation and playtesting support
publication. The structural relationship is accepted in ADR 0029.

## Proposed balance areas

- Facility-stage requirements and accomplishments
- Room costs, footprints, construction duration, dependencies, capacity, and upgrade levels
- Staff salaries, permitted work, morale, training costs, and modifiers
- Task durations, priority, capacity, and failure conditions
- Patient arrival and queue parameters
- Diagnostic and other result turnaround times and facility-capability
  modifiers
- Numerical Waiting-patience and capped delay-consequence values,
  clinic-workload capacity and reserve values, and Resolved-list pagination or
  movement of older charts into an archive view; frozen encounter records are
  not deleted by balance configuration
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
- Every tutorial or progression-critical patient guarantee has a valid
  workload-reserve admission path, including after worst-case capacity changes.
- Tutorial funding remains possible after worst-case clinical answers.
- Routine arrivals cannot consume protected workload reserve.
- Full-capacity pause and later release cannot create a catch-up arrival burst.
- Every capacity modifier identifies whether it affects clinic workload, a
  physical room, or a service/task queue.
- Base patient revenue is not multiplied by scored-node count.
- Multi-question clinical bonuses and penalties obey their patient-level caps.
- Minor and major terminal clinical outcomes produce no automatic difference in
  operational penalty.
- Same-date remediation cannot repeat clinical XP or quality bonuses.
- Deliberately incorrect play never has greater expected value than correct
  play.
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
- Numerical result turnaround defaults and facility-capability speed modifiers
- Numerical patience and grace thresholds, clinic-workload limits/reserves, and the
  Resolved-list pagination/archive display threshold, never underlying-record
  deletion
- Bankruptcy trigger and recovery behavior
- Inspection formula
