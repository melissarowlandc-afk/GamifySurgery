# Level 4 approved art promotion

M2 promotes the October 8 approved MRI, Pediatric Waiting, Pediatric Examination
and Wound/Ostomy designs. It does not register room definitions or add gameplay.
The current public build catalog therefore still excludes all four rooms.

Run from the repository root, in dependency order:

```powershell
node tools/room-design/level-4/runtime-promotion/promote.mjs mri
node tools/room-design/level-4/runtime-promotion/promote.mjs pediatric-waiting
node tools/room-design/level-4/runtime-promotion/promote.mjs pediatric-exam
node tools/room-design/level-4/runtime-promotion/promote.mjs wound-ostomy
```

Append `--check` to any command for a read-only reproducibility/hash check.
Pediatric Examination references the promoted Pediatric Waiting front-armrest
mask, so Waiting must already have been promoted. No image processing, image
generation, proof build, dependency install or browser operation occurs.

The promoter verifies every hash in the room's approval receipt before copying
the approved PNGs byte for byte. It also pins the native armrest/backless-stool
manifests, reused source bytes, measured anchor metadata and current actor
presentation contracts. Sources and hashes are recorded in each room's runtime
JSON. The active `proof/design-rooms.js` records supersede stale coarse layouts.

Outputs:

- `apps/player/public/art/rooms/level4-v1/<slug>/`: 30 native PNGs in total
  (MRI 9; Waiting 9 including two front masks; Examination 6 including its
  backless stool; Wound/Ostomy 6 including its native backless stool).
- `apps/player/src/art/level4/<slug>.json`: native dimensions, anchors, preload
  paths, source paths and SHA-256 hashes.
- `apps/player/src/facility/level4/<slug>.json`: exact floor primitives, resolved
  native furniture placement, draw/support contacts, owner segments, native
  foreground bindings, active solids, measured base clearances and fine routes.

Prepared sprites use the approved painter's measured alpha anchor, rather than
the nominal rectangle's transparent padding. Reused atlas crops, derived front
masks and complete backless stools keep their frozen crop/placement contracts.
Source rectangles, render scales and floor/hip/painter contacts stay distinct.
The MRI table retains its approved bore clip; its patient is seated facing west
and its operator is seated facing north. No example actor identity is exported.

## Navigation and future actor binding

`packages/balance-config/src/approved-level4-room-layouts.ts` exports the physical
room navigation and named support approaches. These exports are presentation
contracts, not room definitions. Every room is locked to orientation 0. MRI and
Waiting have 16 legal one-tile doors; Examination and Wound/Ostomy have 12.
Approved owning-fixture threshold exceptions remain explicit. Optional props,
native front masks and attached sitters share their source door ownership.

Integer walking anchors, standing approaches, static hip contacts and painter
grounds are separate. `approachRoutes` supplies clear world-coordinate walking
knots from each door to each visible standing approach, at 0.05-tile resolution
with the approved 0.18-tile actor radius. Seating occurs only after walking.
Fixed chair bases remain physical blockers even when a conditional integer
passage is needed around a narrow gap. M5/M6 must consume these fine knots when
binding movement; interpolating coarse grid centers through the fixed chairs
would lose the approved clearance. M2 does not change the gameplay pathfinder.

`waitingAnchors` remains empty until M5 implements family reservation. The nine
Waiting supports are five ordinary actor seats plus four child stools, not nine
patient admissions. Both navigation/support data restrict the stools to children
under 10; ordinary seats allow children or parents. Examination has one child
table, one provider stool and one parent chair. The complete clinician draws
above the complete backless stool. Parent/side-chair native front masks draw
above the actual attached sitter.

Future runtime actors use their real character identities and the existing
`supportRole`, `supportId` and `supportRoomInstanceId` seam. Their age/height and
pose-source registration must follow the approved presentation contracts;
example proof actors are not templates for replacing actual patients/staff.
See the M2 handoff in `docs/execplans/level4-launch-plan-20261008.md` for exact
roles, support IDs, validation results and the manager's M3 QA campaign checks.

The focused room/scene tests verify native bytes, anchors, contacts, clip and
foreground order, age eligibility, visibility and catalog exclusion. The domain
matrix checks every door using the existing grid graph and independently checks
the exported fine paths against active solids and measured bases. Browser/zoom
acceptance remains with the manager after M3 enables QA placement.
