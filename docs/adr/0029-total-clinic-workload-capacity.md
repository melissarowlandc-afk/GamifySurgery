# ADR 0029: Total Clinic Workload Capacity and Arrival Backpressure

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: YELLOW game-design and simulation decision

## Context

ADR 0028 protects every opened Active educational encounter from ordinary
patient abandonment. Without a separate workload limit, a player could open
every Waiting chart, accumulate an unbounded Active list, and bypass the
intended queue-management pressure. A hard Active-only limit would instead risk
preventing the player from opening a Waiting patient before that patient leaves.

## Decision

Use one visible total clinic-workload capacity with fair arrival backpressure:

1. `clinic_workload_occupancy` is derived from the number of encounters in
   `waiting_unopened`, `active_action_required`, or `active_pending_result`.
   Opening a chart is count-neutral. A terminal
   `resolved_summary_available` encounter no longer consumes workload capacity;
   optional summary reading or filing cannot block new patients.
2. Routine patients are admitted only while occupancy is below the current
   `routine_workload_limit`. When it is full, the game pauses routine arrivals
   before a patient is instantiated or enters Waiting. No arrived patient is
   made impossible to open by an Active-only limit.
3. The player sees the current workload, limit, and accessible text such as
   **At capacity - new routine patients are paused**. The display explains what
   counts and which facility capabilities can improve the limit. It does not
   rely only on sound or color.
4. Rooms, functioning staff, upgrades, and other explicitly published
   operational modifiers may change the effective limit. Exact contributions
   and values belong to the campaign-pinned balance release.
5. A fall in capacity cannot evict, hide, or abandon an existing encounter. The
   clinic may temporarily show **Over capacity** and blocks routine admissions
   until occupancy or capacity recovers.
6. Published `critical_reserved_slots` remain unavailable to routine arrivals.
   An eligible tutorial or progression-critical patient may use capacity up to
   `routine_workload_limit + critical_reserved_slots`. If the reserve is
   occupied, the guarantee remains deterministically pending rather than being
   discarded or left to chance.
7. Tutorial patients retain ADR 0028's no-abandonment protection. A
   progression-critical patient who leaves before first opening does not
   satisfy the required encounter guarantee; a replacement opportunity remains
   guaranteed.
8. Terminal encounter completion or a pre-open departure releases workload
   atomically and exactly once. Waiting patience continues while the clinic is
   full, and opening a Waiting chart does not free capacity.

Physical waiting-room seats, a room's occupant capacity, and task or diagnostic
service capacity are separate concepts. They must not reuse
`clinic_workload_capacity` as though they were the same limit.

## Deterministic arrival behavior

The simulation owns one routine-arrival gate/countdown. When routine capacity
is full, it pauses the remaining facility-time delay before clinical selection,
patient instantiation, or random identity draws. It does not accumulate hidden
patients or elapsed arrivals. When capacity becomes available, the countdown
resumes once; after an admission, the following interval is scheduled from that
actual admission. There is no catch-up burst.

The save preserves the gate's remaining ticks, blocked state and start tick,
stable event/operation ID, and any already-consumed randomness provenance.
Occupancy and effective capacity are derived and revalidated rather than stored
as independently mutable counters.

At the same facility tick, terminal/departure transitions and capacity
recalculation precede admission gates. Each admission performs an atomic
capacity check, and writer-lease, expected-revision, and idempotency rules
prevent duplicate or over-capacity arrivals.

## Consequences

- Opening every chart does not create infinite workload: occupancy stays full,
  routine intake pauses, and new revenue opportunities wait for resolution.
- Patient questions remain protected without forcing the player to race an
  interface-imposed Active limit.
- Capacity upgrades have a direct, understandable management benefit.
- Temporary staff or room outages can create visible pressure without deleting
  patients.
- The simulator must test capacity deadlocks, burst arrivals, intentional
  open-everything behavior, tutorial guarantees, and every lifecycle
  transition.

## Alternatives rejected

- **Hard Active-chart limit:** simple, but can prevent opening a Waiting patient
  and make abandonment feel caused by the interface rather than the player's
  management.
- **Unlimited Active patients with only penalties:** flexible, but creates
  overwhelming lists, weakens capacity upgrades, and is difficult to balance
  or restore safely.

## Cost of changing later

Moderate. This rule affects arrival scheduling, queue displays, facility and
staff modifiers, tutorial guarantees, save restoration, seeded randomness,
balance simulation, and end-to-end tests. It does not change the clinical
knowledge or FSRS content models.
