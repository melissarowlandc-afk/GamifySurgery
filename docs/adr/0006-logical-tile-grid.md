# ADR 0006: Logical Tile Grid

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The top-down facility must support visible expansion, room construction, doors,
fixtures, staff and patient movement, queues, cleaning, maintenance, and
reproducible saves on both desktop and phone. Physical room size must remain
separate from room upgrade Levels 1-5.

## Decision

- Represent facility space as an orthogonal grid of integer logical
  coordinates independent of screen pixels.
- Define each room's physical shape through a footprint mask. A room's
  footprint and physical size are separate from its upgrade level.
- Give doors, fixtures, interaction points, walls, and walkability explicit
  logical positions.
- Store room placement using stable definition identifiers, logical
  coordinates, orientation, and compatible footprint information rather than
  rendered pixel positions.
- Use deterministic A* pathfinding over the walkability grid for staff and
  patients.
- Resolve equal-cost path choices deterministically so repeatable saves and
  seeded tests do not depend on incidental iteration order.
- Recalculate paths when relevant walkability changes or a route becomes
  invalid, not on every animation frame.
- Keep authoritative placement, access, and route rules in the pure TypeScript
  domain layer. Phaser presents the resulting state.
- Permit map bounds to expand without requiring an infinite world.

Exact visible tile size, room dimensions, allowed rotations, initial map bounds,
expansion shape, and costs remain later visual and balance decisions.

## Benefits

- Construction validity and room access are clear on mouse and touch devices.
- The model matches the large-pixel visual direction.
- Placement, walking distance, queues, cleaning, and maintenance share one
  spatial language.
- Facility layouts and paths can be saved, migrated, simulated, and replayed
  reproducibly.
- Footprint masks can support varied room shapes without unrestricted geometry.

## Risks and limitations

- Grid placement is visually more rigid than unrestricted construction.
- Large facilities with many moving agents require route caching and
  performance testing.
- Footprint and door rules need strong validation to prevent unreachable rooms.
- Phone construction controls still require dedicated interaction design.

## Alternatives considered

1. Unrestricted placement with generated navigation meshes.
2. An abstract graph of connected rooms with mostly decorative movement.

## Cost and maintenance

The spatial model has no direct recurring tool cost. Development and
maintenance burden is moderate and includes placement validation, deterministic
route tests, map migrations, and phone interaction testing.

## Cost of changing later

Very expensive. A different spatial model would rebuild construction, room
placement, doors, fixtures, collision and access rules, walking, queues, map
serialization, save migration, touch controls, balance definitions, and many
tests. Existing campaign layouts might not migrate cleanly.
