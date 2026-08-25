# ADR 0032: Paused Build Mode, Functional Hallways, and Route Time

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: YELLOW game-design implementation of the accepted RED spatial model

## Context

Construction needs to feel like a deliberate mode rather than a permanent
menu. The owner also wants room doors and hallways to determine whether staff
and patients can reach services, with visible walking contributing to task
time. This specializes the logical grid, explicit-door, and deterministic
pathfinding model already accepted in ADR 0006.

## Decision

- The player explicitly enters Build Mode. Entering pauses facility time and
  hides or closes the working chart surface.
- Build Mode exposes room and hallway tools, rotation, placement, upgrades,
  selling, the current cash balance, grid guidance, and map zoom controls.
- Exiting Build Mode restores the pause state that existed before entry. A
  facility that was already paused does not silently resume.
- Rooms have saved orientations and explicit door locations. Rotation changes
  both the footprint orientation and door side.
- A newly placed room must use its own visible, rotated door to open into an
  already connected room or hallway. Existing rooms may accept more than one
  inbound connection, so rooms may connect directly to rooms and hallways are
  not mandatory between every pair.
- Hallways are functional walkable tiles. Placement is rejected when the
  candidate cannot join the connected Front Desk/entrance network; selling is
  rejected when it would strand a remaining room or hallway.
- Staff and patients follow deterministic logical paths. Walking between
  interaction points is visible and contributes to operational task time.
- One centrally configured movement speed applies to patients, the founder, and
  employees. Saved cardinal routes and destinations are authoritative; the
  renderer may interpolate them but may not invent locations, skip walls, or
  complete a transition independently.
- Patient arrivals and departures begin or end beyond a map-side sidewalk
  boundary. Front Desk arrival is the check-in boundary for exposing a new or
  returning chart. Off-site routes include an outbound leg, time away, and a
  return leg that reaches the Front Desk at the displayed due time.
- New and returning patients then use the same capacity order: authored Waiting
  Room chairs, valid standing room, the Front Desk, and the sidewalk. Opening a
  result-ready chart reserves an Examination Room, and that visit remains part
  of the physical itinerary before departure.
- The renderer keeps a bounded predictive route buffer at the same canonical
  speed so a late browser timer or React projection cannot create artificial
  stop-and-sprint movement. Facility-minute ticks are staged in memory and the
  complete local profile is autosaved at quarter-hour boundaries; meaningful
  commands, pausing, and explicit Save and Close remain write-through.
- The player may build multiple instances of an unlocked room definition.
- Selling is a deliberate Build Mode action with a substantially reduced,
  centrally configured refund. The Front Desk cannot be sold, and unsafe
  removal of an occupied or progression-critical dependency is blocked.
- The ordinary play view does not show the construction grid.

The prototype may use simple state-driven movement and deterministic
waypoints before every future staff task queue and animation is complete, but
connectivity and route validity must be authoritative gameplay rules rather
than decorative claims.

## Consequences

- Layout and door choices have understandable operational meaning.
- Separating placement-time entrance validation from whole-facility
  reachability keeps rotation meaningful while allowing safe later remodeling.
- The build interface can grow independently from the ordinary play layout.
- Save data must retain room orientation, doors, hallways, connectivity, and
  agent route state.
- Placement, rotation, selling, connectivity, and deterministic route tests
  are required.

## Cost of changing later

Moderate within the already accepted grid architecture. Removing functional
connectivity later would simplify play but invalidate layout balance and task
timing. Replacing the grid/path model itself remains RED under ADR 0006.

## Current amendment

[ADR 0037](0037-explicit-doors-fixed-site-and-room-cleanliness.md) replaces
room-owned doors with explicit zero-cost door objects and adds build-session
Undo and exit validation. Paused renovation and functional route time remain
current.
