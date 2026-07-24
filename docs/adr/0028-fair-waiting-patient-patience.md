# ADR 0028: Fair Waiting-Patient Patience

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: YELLOW game-design and pacing decision

## Context

Waiting rooms and queues need consequences, but the educational game must not
pressure players to skim clinical material or allow a required question to
vanish while it is being considered. Tutorial patients must not leave and make
the opening progression impossible.

## Decision

Use the following patient-patience model:

1. Only a patient in `waiting_unopened` may leave because of patience. Their
   patience advances in facility time and is visibly communicated with a
   generous remaining-time or status display and at least one warning before
   departure.
2. Opening the chart for the first time atomically moves the patient to Active
   and cancels the waiting-departure event. If an accepted Open action and the
   departure event share a facility tick, the player action wins through a
   stable event-priority rule.
3. Once Active, the patient cannot disappear because a required result is
   pending or because the player has not yet answered an action-ready clinical
   question. The exact frozen encounter remains available until completed or
   handled by an explicit publisher-safety rule.
4. While that patient's chart is open for reading or answering, no
   player-response-delay consequence advances for that patient. Facility time
   and other patients continue unless the player selects Pause.
5. Operational result delay remains separate from reading time. A chart being
   open does not erase the operational effect of an unusually long service
   delay.
6. After visible, generous grace thresholds, long operational delays or an
   ignored action-ready Active chart may create small, capped patient-level
   satisfaction consequences. These are evaluated once per threshold, never
   per animation frame, and cannot change clinical truth, the correct answer,
   FSRS state, XP already earned, or mastery.
7. Designated tutorial patients are exempt from abandonment. Tutorial waiting
   and delay consequences cannot prevent the first examination room or create
   another progression softlock.
8. A patient who leaves before first opening receives no completion revenue,
   clinical XP, correctness consequence, review record, mastery evidence, or
   concept-presentation exposure. The concept remains eligible to return
   later.
9. The departed chart becomes a read-only Resolved/History entry labeled
   **Left before being seen**. It records only the operational timeline and
   does not reveal unanswered clinical content, the correct answer, or the
   post-completion learning summary.

Because attention now affects a gameplay consequence, the simulation owns one
persisted `attended_encounter_id`; only panel geometry and animation remain
presentation-only. Open, close, and chart-switch commands update attention
atomically under the writer lease. On refresh or device takeover, facility time
is paused while the valid attended chart is restored, or attention is cleared
at the unchanged facility tick before Resume. The attended ID may reference
only one unresolved Active encounter in that campaign; opening a Resolved or
History chart grants no exemption.

Open and departure use a compare-and-set from `waiting_unopened`: an Open
accepted at the deadline wins, but a stale Open after departure has committed
is rejected. Departure and its queue/resource cleanup are idempotent and bypass
generic clinical completion settlement.

Exact patience durations, warning thresholds, satisfaction amounts, grace
periods, and caps are versioned balance values. The player-facing indicators
must be accessible without sound and must not rely only on color.

The final departure warning must remain observable for a positive amount of
facility time at every supported speed; a batched update cannot emit the final
warning and departure as one invisible event. Operational-delay thresholds
must reference an explicit frozen service target or ETA and have a visible
warning, so the normal promised outsourced wait is not itself penalized.
Response and operational-delay accrual stop at
`resolved_summary_available`; optional summary reading and filing are never
penalized. Answer-related and delay-related satisfaction consequences share
one patient-level cap so penalties cannot stack beyond the accepted bound.

Active-patient capacity and any policy for slowing new arrivals when the Active
list grows remain separate rules.

## Consequences

- Initial waiting-room neglect matters and makes queue improvements valuable.
- Opening a chart commits the encounter to completion and protects the
  educational question from abandonment.
- Players are not punished for the time spent reading the chart currently in
  front of them.
- Waiting departures remain operational events rather than false clinical
  failures.
- The simulator must test warning clarity, worst-case tutorial funding,
  satisfaction caps, and strategies that intentionally ignore patients.
- Persisted attention state adds a small save and synchronization obligation,
  but prevents refresh or device changes from altering the rule.

## Alternatives rejected

- **Allow Active patients to leave:** increases pressure, but can erase
  educational encounters, encourage avoidance of difficult questions, and
  feel unfair during required result waits.
- **Never allow any patient to leave:** is relaxed and simple, but makes the
  Waiting queue and waiting-room investments much less meaningful.

## Cost of changing later

Moderate. Changing this policy would affect patient state transitions,
scheduled events, queue UI, satisfaction, tutorial guarantees, save
restoration, balance simulations, and end-to-end tests.
