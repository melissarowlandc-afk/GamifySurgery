# Executive Office — proposed 4×3, fixed corporate appearance

Review in existing **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

One polished administrative office: walnut/charcoal-green dual-monitor desk,
navy executive and visitor chairs, a round meeting table with two guest chairs,
filing credenza, abstract KPI board, plant, window and quiet flat rug.
Executive stand-in sits north facing south; visitor sits south facing north.
Desk shows its visitor-side face and monitor backs. Foreground armrests/rear
chair panels draw over the real sitters. The meeting chairs are empty.

Recommend **4×3** for distinct desk/meeting bays and clear door approaches.
Roadmap/catalog supplies no footprint. Owner approval is pending (`approval:
null`); runtime integration is false.

The catalog sets `room.executive_office.appearanceChanges=false`, so this proof
has **one base look** retained at every upgrade selection. Facility Level 5,
upgrade level and appearance level stay separate. No administrative behavior,
cost or staffing mechanic is implemented.

| Upgrade selection | Appearance | Furniture/layout |
| --- | --- | --- |
| 1 | Corporate base | Complete selected set above |
| 2 | Same base | Identical assets, anchors and seating |
| 3 | Same base | Identical assets, anchors and seating |
| 4 | Same base | Identical assets, anchors and seating |
| 5 | Same base | Identical assets, anchors and seating |

Fourteen legal one-tile doors: N1–N4, S1–S4, WA–WC, EA–EC. Four independent
north backing controls and bulk actions remain. Wall/edge furniture hides on
its own doors; window/KPI also hide for backing. Plant/credenza retain full
height on low backing. Rug is walkable; no pass-through exception.

Keys 1–5/arrows select upgrades while preserving art/inspection state. G grid,
R routes, A characters, P visitor, V Executive, C contacts, F base bands,
D doors, B backing, Escape reset. Native Tab/Space/Enter remains available.
Browser CSS/320px/keyboard acceptance is pending manager after Chrome launch
returned `spawn EPERM`.

**10 built-in imagegen calls, 10 selected objects, 2 source-pixel foregrounds.**
Approved `founder.01/sit-south.png` is an Executive seating stand-in;
`patient.adult.007/sit-north.png` is the visitor. Both files remain unchanged.
[Provenance and exact prompt set](assets/provenance.md).

Ten prepaint stand-ins/layout were frozen before generation. Three recorded
art fits: rug native canvas at 400 pixels/tile avoids upscale; credenza shifts
0.03T west to clear its measured east doorway; empty meeting chair is calibrated
to the common cushion rise. Occupied chair/actor anchors remain fixed.
[Art brief](ART_BRIEF.md), [reconciliation](layout-reconciliation-v2.json).

Engineering PASS: 1,280 door/backing states, 6,720 routes, 3,405,120 radius-clear
samples, 161 actual Node handler checks, 50 native render states, 19 files
byte-identical across two rebuilds. All 23 proof resources return HTTP 200 at
port 4191. The occupied render is identical at all five upgrade selections.
Native images are engineering evidence, not browser captures or owner approval.

- [Painted native view](proof/evidence/v2/native-level-1-painted.png)
- [Five selections](proof/evidence/v2/native-all-five-levels.png)
- [Commands](proof/README.md)
- [Handoff and owner questions](WORKER_HANDOFF.md)
- [Level 5 plan](../../../../docs/execplans/level5-room-design-20261008.md)

Private proof uses no campaign storage. Gameplay stays `START_GAME.cmd` → exact
`http://127.0.0.1:4173` in the usual persistent profile; saves do not transfer to
port 4191. Server/launcher and runtime/game/balance/saves unchanged. No Git,
installs, commit, push, publication or deployment. Local only; manager owns
acceptance, global handoff and GitHub checkpoint reminder.
