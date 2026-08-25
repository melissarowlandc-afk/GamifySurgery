# Balance Model Proposal

Status: The initial FSRS settings and the structural clinical-answer reward
relationship below are accepted. Other numerical balance values remain
agent-managed prototype defaults until validated and published.

Last updated: 2026-07-27

## Principle

Every important tunable value receives a stable identifier, explicit unit, documented meaning, safe default, validation rules, and release history. Tunable numbers should not be scattered through source code.

## Current unpublished Level 0/1 fixture

The currently playable values live in one object:

- Editable prototype values:
  `packages/balance-config/src/prototype-balance.ts`
- Structural and cross-field validation:
  `packages/balance-config/src/schema.ts`
- Runtime game rules that consume those values:
  `packages/game-domain`

These values belong to `balance.synthetic.prototype.v1`, whose publication
status is `prototype_unpublished`. They are temporary playtest defaults, not an
approved immutable balance release. For a clean comparison after changing
them, create a fresh local campaign; the local prototype does not yet provide
the production release-pinning and migration behavior.

### Current progression and timing values

| Area | Current value | Unit or behavior |
|---|---:|---|
| Starting money | `$90` | Prototype whole-dollar display units |
| Patient satisfaction baseline | `100` | A clean, capable clinic starts here; applicable facility-condition penalties are applied at Front Desk check-in |
| Level 0 XP requirement | `10` | Clinical XP |
| Level 0 completed encounters | `0` | Intro patients teach the loop but are not a formal count gate |
| Level 0 satisfaction gate | `> 90` | Strictly above 90 |
| Level 0 required room | Examination room | One placed room |
| Level 1 XP requirement | `150` | Current-level Clinical XP toward Level 2 |
| Level 1 completed encounters | `0` | No separate encounter-count gate |
| Level 1 satisfaction gate | `> 90` | Strictly above 90 |
| Authoritative simulation tick | `1` | Simulated minute |
| Facility speeds | `1x / 2x / 4x` | One game hour in about `60 / 30 / 15` real seconds |
| Operating day | `8 AM-6 PM` | About 10 real minutes at 1x; continuous rollover |
| First routine arrival | `35-75` | Irregular persisted game minutes after start |
| Later routine arrivals | `60 +/- 15` | Persisted game minutes; not quarter-hour aligned |
| Idle-wait grace | `20` | Game minutes before satisfaction decay |
| Idle-wait decay | `-1 / 5` | Satisfaction per five game minutes; sidewalk multiplier `150%` |
| Walkout threshold | `0-59` | Persisted hidden value; tutorial patients exempt |
| Clinic satisfaction window | `10` | Most recent completed encounters and walkouts |
| Financial posting | `15` | Game minutes, with fixed-point prorated accrual |
| Development fast-forward | `10` | Game minutes processed by one developer action |
| Base routine workload limit | `2` | Waiting plus unresolved Active patients |
| Critical reserved capacity | `1` | Non-routine protected slot |

The locked Level 2 preview requires a functioning X-ray installation, one
Minor-Procedure Room, and one Imaging Technician. X-ray functionality
implicitly validates its directly connected Imaging Control Room and both door
types; Imaging Control is not repeated as a separate goal. Bathroom, Waiting
Room, and Receptionist remain useful Level 1 options rather than formal
completion gates. The playable slice stops there and does not advance to
Level 2.

### Current rooms and staff

| Definition | Build or hire cost | Recurring hourly rate | Other current effect |
|---|---:|---:|---|
| Front Desk | `$0` | `$10` | Protected starting room |
| Hallway tile | `$30` | `$0` | Repeatable walkable connection |
| Door | `$0` | `$0` | Explicit valid wall access; no sale refund |
| Examination Room | `$130` | `$12` | `+2` workload; in-house synthetic analysis |
| Bathroom | `$180` | `$8` | `+2` satisfaction on build |
| Waiting Room | `$280` | `$14` | `+2` satisfaction; `+2` workload; visible waiting occupancy |
| Imaging Control Room | `$350` | `$18` | Required for functioning in-house X-ray |
| X-ray Room | `$600` | `$28` | In-house X-ray capability when staffed |
| Minor-Procedure Room | `$650` | `$30` | `+1` satisfaction; `+1` workload |
| Receptionist | `$180` | `$18` salary | `+1` workload; automatically refills a continuously empty water cooler after `60` facility minutes |
| Imaging Technician | `$300` | `$26` salary | Required for in-house X-ray |

Room footprints, build dependencies, capability identifiers, and staff
dependencies are in the same fixture rather than hard-coded in the player
interface.

### Accepted future unlock structure

Levels 2-5 and their exact rooms and staff are accepted in
`docs/features/facility-levels-and-clinical-release-points.md`. They are not
yet part of the playable balance fixture. Their costs, footprints, upkeep,
salaries, capacity, upgrade curves, staffing caps, advancement gates, and
service timings remain proposed balance areas rather than implied zero values.

The structural distinctions are fixed:

- Level 2 Phlebotomy performs onsite collection with send-out testing, while
  the Level 3 Laboratory performs testing onsite with a Laboratory Technician.
- Level 2 Peri-op/Recovery supports endoscopy before becoming part of the Level
  3 Ambulatory OR workflow.
- The Founder may cover one physician task in one place at a time; hired
  Endoscopists and Surgeons add physician capacity.
- The Imaging Technician operates X-ray, ultrasound, CT, and MRI.
- The Level 3 Pharmacy hires a Pharmacist.
- Level 5 adds optimization and prestige rather than another clinical setting.

### Current patient settlement and services

| Stable area | Current value |
|---|---:|
| Level 0 gross encounter payment | `$15 + ($10 * questions) + ($50 * correct)` |
| Level 1 gross encounter payment | `$20 + ($15 * questions) + ($65 * correct)` |
| XP per correct / incorrect first submission | `10 / 2` current-level XP |
| Correct / incorrect care satisfaction | `+3 / -8` per scored decision |
| Clean / dirty room completion effect | `+2 / -4` satisfaction |
| Happy / unhappy staff completion effect | `+2 / -3` satisfaction |
| Maximum amenity completion benefit | `+3` satisfaction |
| Outsourced synthetic analysis | `10` game minutes |
| In-house synthetic analysis | `10` game minutes |
| Outsourced X-ray | `120` game minutes, including the complete off-screen round trip |
| Functioning in-house X-ray | `60` game minutes, including frozen facility travel; `+1` satisfaction on result |
| Outsourced basic laboratory testing | `60` game minutes, including the complete off-screen round trip |
| Off-site mammography choice preview | `120` game minutes |
| Off-site breast MRI choice preview | `180` game minutes |
| Off-site core-needle biopsy choice preview | `180` game minutes |
| Off-site excisional-biopsy choice preview | `240` game minutes |
| Shared character walking speed | `2` cardinal grid tiles per facility minute for patients, founder, employees, and ambient sidewalk pedestrians |
| Ambient sidewalk passersby | One scheduled every `40-90` facility minutes; at most `2` concurrently; no gameplay effects |
| Manual GLP-1 action | Available at any cash balance until its future room is built; fixed `$25` payment; `60`-minute cooldown; no daily cap, diminishing payout, XP, or FSRS |

Future imaging timing separates acquisition from interpretation. An Imaging
Technician and operational room govern acquisition. Interpretation then uses a
slower configurable external route or a faster configurable staff-Radiologist
route through the Radiology Reading Room. A result becomes clinically
actionable only after both phases complete. Existing Level 0-1 X-ray totals
remain unchanged until this phased model is implemented and deliberately
rebalanced.

The breast-service preview values are editorial simulation timings used to keep
diagnostic distractors from revealing the correct answer through missing UI
metadata. They are not assertions about real clinical scheduling or pathology
turnaround. Incorrect nonfinal choices do not perform those services; the
approved corrected-forward service remains authoritative.

The initial funding validator and tutorial fixtures preserve a worst-case route
to the Examination Room after the protected introductory patients. The current
configured operating buffer is `$0`; there is no formal minimum-cash
progression gate. Recovery patients remain available when incorrect tutorial
answers leave the player below the XP gate and remain abandonment-exempt.

### Current prototype FSRS settings

| Setting | Current value |
|---|---:|
| Adapter parameter-set identifier | `learning.prototype.fsrs6.v1` |
| Desired retention | `0.90` |
| Maximum interval | `36,500` days |
| Minimum Again delay | `30` real-world minutes |
| Interval fuzz | Disabled |

Every scored answer creates evidence only in the active campaign. Creating a
new campaign creates fresh histories; reopening an older campaign restores only
that campaign's histories. The development panel can inspect current card
state and due time. The later due-prioritized and repetition-aware encounter
selector is not part of this fixture yet.

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

- Correct first submissions award `10` current-level Learning XP immediately;
  incorrect first submissions award `2`. Both update only the decision's one
  primary concept, and neither can remove previously earned XP.
- The game has no lifetime-XP counter. Current-level XP resets only after the
  player advances to the next facility level.
- Gross encounter payment is calculated from facility level, authored question
  count, and first-submission correctness using the formulas above. Cash is
  settled once at encounter completion.
- Direct service, supply, and authored outcome expenses remain separate from
  gross payment and are shown separately when present.
- Answer quality changes that encounter's individual patient satisfaction
  through configured care effects. There is no Patient Confidence meter or
  same-day campaign-wide correctness modifier.
- Same-date remediation cannot award another clinical XP or quality bonus for
  that concept.
- Worst-case tutorial funding still covers the first Examination Room at the
  currently configured zero-dollar buffer.
- No intentional incorrect-answer strategy may have higher expected reward than
  correct play.

Exact amounts and formulas are balance values selected through simulation and
playtesting. ADR 0034 defines the current XP and payment formulas; ADR 0035
defines individual and rolling satisfaction. They amend the historical reward
relationships in ADRs 0025 and 0033.

Terminal Clinical Outcome `minor` or `major` severity is clinical-content
metadata, not an automatic balance multiplier. Each wrong final choice freezes
its authored consequence and explicit operational effects; runtime code cannot
invent a complication. It cannot override the tutorial funding guarantee,
progression safeguards, or one-review-per-node behavior. This separation is
accepted in ADRs 0030 and 0034.

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

- `100%` is the clean, capable-clinic baseline. At Front Desk check-in, a new
  ordinary patient receives the centrally configured, capped penalties for
  applicable unresolved facility dissatisfaction conditions.
- Satisfaction decays only during genuine idle waiting after a configured grace
  period. It does not decay during normal walking, active care, an expected
  service timer, off-site travel, or while that patient's chart is open.
- Care quality, cleanliness, room upgrades, amenities, staff morale, and service
  efficiency may apply explicit bounded effects.
- Below `60%`, each ordinary encounter's persisted hidden threshold determines
  when that patient decides to leave. The threshold is never rerolled on pause
  or reload, and zero satisfaction guarantees departure.
- Tutorial patients are exempt from abandonment and cannot cause an opening
  softlock.
- A patient who decides to leave cancels pending care and physically routes to
  the exterior boundary. Already submitted answers and reviews remain; no
  encounter-completion payment is awarded.
- Historical clinic satisfaction is the rolling mean of the configured number
  of completed encounters and walkouts. Active encounters do not enter or
  rewrite that historical baseline.
- The HUD layers a separately derived live facility-condition modifier over
  that baseline. Current issues lower the display only while unresolved; fixing
  an issue removes its live contribution without changing completed outcomes.
  Before the first ended encounter, a neutral `100%` presentation baseline may
  expose current pressure, but it does not count as a measured progression
  result.

Exact durations, warning bands, grace periods, satisfaction amounts, and caps
remain agent-managed prototype defaults until simulation and playtesting
support publication. ADR 0035 supersedes the abandonment scope of ADR 0028.

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
- Vending, coffee, and pharmacy values
- Limited GLP-1 side-business values: future Level 2 suite staffing,
  throughput, upgrades, and operating costs. The pre-suite manual action is
  already fixed at `$25`, once per facility hour, at any cash balance, with no
  daily cap or diminishing return; its daily count only controls sarcasm.

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

- Which current Level 0/1 temporary values should change after the first
  Melissa/husband walkthrough
- Final pilot starting cash, room/staff costs, patient payments, arrival pacing,
  expenses, and progression thresholds
- Final XP award rules after correct and incorrect answers
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
