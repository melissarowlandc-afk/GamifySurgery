# ADR 0037: Explicit Doors, Fixed Site, and Room Cleanliness

Status: Accepted

Date: 2026-07-27

Decision owner: Project owner

Severity: RED facility spatial and save-model decision

## Context

Room-owned single doors prevented flexible renovation and imaging-control
layouts. The visual refinement also needs a stable future-sized world,
room-level fixture variants, and cleanliness that affects patients without
turning the HUD into a resource spreadsheet.

## Decision

- Use one configurable fixed buildable site, initially `72 x 32` logical
  tiles. Zoom reveals existing site area and never creates or purchases land.
- The entrance is the bottom-center anchor. The sidewalk is the absolute
  bottom world edge. Camera bounds never reveal overscroll.
- A displayed zoom of 10% fits the complete permitted top, left, and right
  extents. Default framing stays near the entrance. After deliberate panning,
  zoom preserves the selected view.
- Doors are stable, explicit, zero-cost build objects placed on valid shared
  wall segments. Internal doors may be placed, moved, and removed in paused
  Build/Renovate Mode.
- The exterior entrance door is explicit, protected, and fixed for Levels 0
  and 1.
- A room is operational only when required access is valid. Imaging rooms
  require a patient-facing door and a separate internal door on a shared wall
  with an Imaging Control Room. Ultrasound has no exemption.
- Build/Renovate Mode permits temporarily invalid work. Done/Save
  remains selectable; an invalid layout opens a modal listing every access
  problem and keeps the player in Build Mode until all are corrected. Door
  rules are taught in the tutorial.
- The condensed construction desk places Build Mode, available money, Undo,
  and Done/Save in its top bar. A second row exposes Rotate, Place Door,
  Remove Door, and Build Hallway in that order. Rotate is available only while
  a not-yet-placed room footprint is selected. Place Door emphasizes eligible
  wall segments for direct selection; Remove Door highlights the doors that
  can be clicked to remove. The interface does not expose implementation-style
  fractional or named wall-slot controls.
- Build Hallway is a persistent construction toggle. Clicking places one
  hallway tile and dragging paints an orthogonally connected run without
  requiring the tool to be selected again between tiles. It remains active
  until explicitly toggled off; each accepted tile records its own cost and
  build-session Undo step.
- The complete invalid-layout explanation is a page-level modal above the
  facility renderer and construction desk, rather than a dialog trapped
  inside the Clinical Desk stacking context.
- Clicking an existing room selects it and opens the compact room inspector
  beside the room catalog. The inspector shows the room name, upgrade level,
  upgrade cost and benefits, and sale refund. Upgrading requires confirmation
  that states the current and next level, exact cost, and every configured
  functional, satisfaction, upkeep, and visual effect.
- One build session spans entry through Done/Save. Stepwise Undo
  covers room and hallway placement, movement, rotation, upgrades, sales, and
  door changes. A full cancel restores the entry snapshot. There is no Redo.
- Furniture and equipment are not independently movable in the current
  prototype. Room definitions and upgrade levels own fixed fixture layouts;
  upgrading replaces them with more polished visual variants.
- Early room names and footprints are Examination Room (`3 x 2`), Bathroom
  (`2 x 2`), and Waiting Room (`4 x 3`). Do not prefix them with “Small.”
- A room owns persisted cleanliness from `0` through `100`. Patient use and
  bounded litter events reduce it. Founder cleanup restores it. Patients
  experience the cleanliness of rooms they use.
- Cleanliness appears through room art and compact labels, not as another
  top-HUD resource. Levels 0 and 1 do not generate infection or clinical harm
  from cleanliness. Later staff may automate cleaning.
- The Level 1 advancement checklist requires a functioning X-ray installation
  rather than a redundant separate Imaging Control Room checkbox. A
  functioning X-ray still validates the control room, both required doors, and
  applicable staffing. Imaging Technician remains an explicit teaching goal.

## Amendments

This ADR replaces the embedded single-door portion of ADR 0032 while keeping
paused Build Mode, functional connectivity, route time, and partial room
resale. It refines the Level 0-1 progression record without removing the
Imaging Control Room unlock or operating requirement.

## Cost of changing later

Expensive after campaigns contain renovated facilities. Doors, map bounds,
room fixtures, cleanliness, routing, and Undo state all participate in saves
and validation.
