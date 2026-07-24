# ADR 0027: Transparent Capability-Based Result Timing

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: YELLOW game-design and pacing decision

## Context

Multi-step patients need time for laboratory, imaging, consultation, and other
results to return. Making every step immediate would weaken the management
loop and the value of facility services. Opaque or highly random waits would
make the game feel arbitrary and could leave the player unsure whether
anything is happening.

The accepted patient-chart lifecycle already supports Active patients who are
waiting for one or more scheduled results.

## Decision

Use transparent, capability-based facility-time delays:

1. An authored encounter waits only when a result or operational step is
   clinically or operationally meaningful. The runtime does not insert filler
   delays between every question.
2. Clinical content identifies the result gate, exact approved result payload,
   readiness rule, and permitted service routes. Clinical truth and the
   displayed result never depend on turnaround time, staffing, room quality, or
   operational turnaround randomness. Approved clinical template variation
   remains governed separately by the frozen content model.
3. The campaign-pinned balance release supplies stable result/service
   definitions, base turnaround times, route modifiers, and display rules.
4. An approved outsourced route is slower and may have different cost or
   revenue consequences. A functioning in-house capability with eligible staff
   and capacity is faster. Current queue congestion may affect the timing
   resolved when the service is scheduled.
5. The Active chart names what is pending and shows the best current estimated
   completion in facility time. Approximate estimates are labeled as such.
   Sound is never required.
6. The action-required `!` and text label appear only when the next player
   action is ready. A passive result arrival that does not yet satisfy the
   authored gate does not create a false action alert.
7. Manual Pause and the accepted hidden-page pause stop facility-time result
   progress. No result advances from real-world time while the game is closed
   or hidden, and no hidden-time catch-up occurs.
8. At service scheduling, the runtime freezes the chosen route, applied
   modifiers, effective integer duration, scheduled facility tick, and due
   facility tick. ETA is derived from the due tick minus the current facility
   tick; it is not maintained by a second countdown clock.
9. Prototype turnaround is deterministic and stored as versioned balance
   values. A later balance release may enable small, bounded, seeded
   operational variation through its own named random stream. It draws once at
   scheduling and persists the resolved output. Variation still cannot alter
   clinical truth or block essential content.

A gate may wait for one result, all listed results, or an explicitly authored
subset. Result delivery and gate completion use the atomic and idempotent
lifecycle behavior in ADR 0026.

If a presentation requires an internal capability with no permitted fallback,
the encounter is ineligible until that capability exists. If an approved
outsourced fallback exists, the encounter may proceed through the slower
route.

Capabilities therefore have explicit route semantics: **hard required** means
the presentation cannot be outsourced, while **in-house preferred with
approved fallback** permits the outsourced route. A later explicit interruption
or breakdown may reschedule a result only through a versioned rule that records
the old and new timing; unrelated room or staff changes do not silently
recalculate an already scheduled service.

## Administration and tuning

The content editor selects result types and gate behavior without entering
timing numbers into clinical prose. The balance configuration owns the timing,
cost, capacity, queue, and route modifiers through stable identifiers.
Publication validation rejects missing result types, impossible gates, unsafe
route combinations, or a required presentation that has neither an available
capability nor an approved fallback.

Exact durations, costs, revenue effects, queue capacities, and future variation
bounds remain tunable. Tutorial waits must be short enough that the player has
something useful to do and cannot become stuck waiting for the only patient.

## Consequences

- Results connect clinical cases to facility construction, staffing, queues,
  outsourcing, and upgrades.
- Players can understand why a patient is waiting and approximately when to
  return.
- The content and balance systems remain separated: clinical authors control
  meaning, while balance authors control operational time.
- The simulator and playtests must detect boring dead time, misleading
  estimates, impossible gates, and internal services that are never worth
  building.

## Alternatives rejected

- **Immediate results:** simpler and faster, but removes much of the management
  value of diagnostic services and multitasking.
- **Opaque or substantially random waits:** adds unpredictability, but obscures
  causality and makes pacing harder to understand or balance.

## Cost of changing later

Moderate. The scheduled-event architecture can support other timing policies,
but changing the player-facing model would require case-flow, tutorial,
balance, ETA, facility-upgrade, simulation, and usability revisions.
