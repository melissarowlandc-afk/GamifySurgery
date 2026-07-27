# ADR 0035: Minute Simulation and Patient Satisfaction

Status: Accepted

Date: 2026-07-27

Decision owner: Project owner

Severity: RED simulation and save-model decision

## Context

The hourly prototype clock could not support readable minute-level waiting,
irregular arrivals, quarter-hour financial postings, movement, walkouts, or
the requested 1x/2x/4x pacing. Facility-wide satisfaction and a separate
confidence modifier also obscured how individual patients experienced care.

## Decision

- Authoritative facility time is stored in integer simulated minutes.
- The operating day remains 8:00 AM through 6:00 PM with continuous rollover.
- At 1x, 60 game minutes pass in approximately 60 real seconds. At 2x they
  pass in 30 seconds; at 4x they pass in 15 seconds.
- New campaigns and tutorials start at 1x. Pause and page hiding freeze all
  simulation time.
- Operational hourly rates accrue continuously with fixed-point precision and
  post visibly on `:00`, `:15`, `:30`, and `:45` boundaries, including a
  prorated first interval.
- Routine arrivals use an exact persisted `nextArrivalAtMinute` plus a
  deterministic named-stream variation. Arrival times are never rounded to
  quarter-hour boundaries and never rerolled on refresh.
- Every encounter owns persisted patient satisfaction beginning at `100`.
- Satisfaction changes only through authored or configured patient
  experiences: genuine idle waiting, correct and efficient care, incorrect
  care, upgraded rooms, staff morale, cleanliness, available or missing
  facilities, and other explicitly modeled effects.
- Satisfaction does not decay while a patient is walking normally, receiving
  active care, completing an expected service timer, travelling off-site, or
  while that patient's chart is open.
- Tutorial patients cannot walk out. An ordinary patient owns one persisted
  hidden threshold from `0` through `59` and decides to leave when satisfaction
  reaches that threshold during an eligible idle wait. At zero, leaving is
  guaranteed.
- A leaving patient cancels pending care and physically routes to the exterior
  departure boundary. Already-recorded answers and FSRS reviews remain; direct
  expenses remain; no completion payment is awarded.
- Clinic satisfaction is the equal-weight rolling mean of the most recent ten
  completed encounters and walkouts. Before the first outcome it is
  unmeasured and shown as an em dash.
- The Level 0 and Level 1 satisfaction gate uses that same rolling value and is
  incomplete while unmeasured.
- Patient Confidence and the campaign-wide daily confidence modifier are
  removed.
- The only XP counter is current-level Learning XP. It resets after advancing.
  Level 1 requires `150` XP earned toward Level 2. Existing Level 1 saves keep
  their previously displayed XP as migrated current-level progress.
- The unpublished local prototype uses save schema v5. Its v5 normalizer
  deterministically supplies newly added movement, satisfaction, timing,
  environment, and door fields while migrating schemas 1-4. Because no v5
  release has been published, these compatible additions remain in v5 for this
  integration checkpoint; the next post-checkpoint save-shape change must
  increment the schema version.

## Amendments

This ADR supersedes the hourly timing portion of ADR 0031, the abandonment
scope in ADR 0028, and the confidence/daily-modifier portions of ADR 0033.
The earned on-site X-ray rule in ADR 0031 remains current.

## Cost of changing later

Expensive. Time units and satisfaction outcomes are embedded in campaign
saves, timers, routing, finances, arrivals, progression, alerts, and tests.
