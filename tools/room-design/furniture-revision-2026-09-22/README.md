# September 22 furniture-revision candidates

Owner approved these furniture revisions on September 24, 2026 and authorized
runtime integration. The original candidate filenames are retained for provenance.

This directory records the approved proof
baseline, replacement contract, isolated furniture-only candidate proofs, and
their validation evidence. Canonical proofs and character art remain unchanged;
runtime integration is tracked in `docs/execplans/approved-room-runtime-integration.md`.

## Owner direction

- Shorten the Front Desk counter a little, while retaining its width, floor
  footprint, reception/visitor chairs, and all service and doorway behavior.
- In both X-ray and CT, replace the console fixture with a taller worktop that
  has one larger screen and a larger keyboard. Remove the desk control panel.
  Preserve the fixture's floor contact, footprint, technician approach, and
  nonblocking status.
- In both Endoscopy orientations, replace the optional rear prep cabinet with
  a taller cabinet and a larger endoscopy tray. Remove towels/sheets from that
  cabinet. Preserve its optional door/adjacency hide ownership, floor contact,
  room footprint, and all non-cabinet furniture and beds.
- Seated P01 proportions are explicitly deferred. This batch must not alter
  character artwork or character display scale.

## Replacement asset contract

The selected transparent-PNG source assets were redrawn with each fixture fully
visible, then uniformly packed from measured alpha bounds and registered ground
contacts. `candidate-metadata.json` records those measurements. No source PNG
was modified or non-uniformly scaled, and no room shell, people, or proof
controls were added to the furniture art.

| Candidate | Reference source and required view | Source/crop registration | Required visible changes |
| --- | --- | --- | --- |
| `front-desk-counter` | `Photos for Codex 2/Codex Rooms 2/GS-015/front-desk-counter-02.png`; same front-facing counter view | Existing proof maps base source `left=41`, `right=929`, `bottom=766` over its immutable two-tile desk footprint. Preserve base width and bottom registration. | Make the counter modestly shorter in apparent facade height; retain the front desk's material, silhouette family, and service-side relationship. |
| `xray-console` | `Photos for Codex 2/Codex Rooms 2/GS-015/xray-furniture-atlas-01.png`; same south-facing console view | Existing crop `(8,629,502,491)`, crop-local floor contact `(249,478)`, rendered width `120px`; proof fixture anchor `(2.45,1.75)`, footprint `(2.15,1.45,.6,.3)`, approach `(2.45,2.35)`. | Taller desk/worktop, one enlarged monitor, enlarged keyboard, no control panel. |
| `ct-console` | `Photos for Codex 2/Codex Rooms 2/GS-015/ct-furniture-atlas-02.png`; same north-facing console/observation view | Existing source box `(942,348,1510,880)`, packed size `568x532`, crop-local floor contact `(284,514)`. Preserve its existing preview anchor, footprint, and technician-behind-divider relationship. | Taller desk/worktop, one enlarged monitor, enlarged keyboard, no control panel. |
| `endoscopy-cabinet-south` | `Photos for Codex 2/Codex Rooms 2/GS-015/endoscopy-equipment-south-01.png`; South cabinet only | Existing source crop `(743,225,1396,699)`, visible bounds `(753,235,1386,689)`, floor contact `(1069.5,689)`. Current render height `80px`. | Taller prep cabinet with larger endoscopy tray; no towels or folded sheets. |
| `endoscopy-cabinet-east` | `Photos for Codex 2/Codex Rooms 2/GS-015/endoscopy-equipment-east-01.png`; corresponding rotated cabinet only | Existing source crop `(879,61,1173,739)`, visible bounds `(889,71,1163,729)`, floor contact `(1026,729)`. Current render height `120px`. | Same physical cabinet revision, rotated East view: taller cabinet, larger tray, no towels or folded sheets. |

## Candidate implementation

The candidate proofs clone the approved proof interaction models and replace
only the intended furniture frame. Non-target atlas frames are copied from the
canonical packed WebP files. The source selections are:

- Front Desk: `front-desk-shorter-03.png`
- X-ray: `xray-workstation-02.png`
- CT: `ct-workstation-01.png`
- Endoscopy South: `endoscopy-prep-south-04.png`
- Endoscopy East: `endoscopy-prep-east-02-alpha.png`

`capture-review.cjs` captures the current and candidate canvases only after
each proof's own readiness API reports ready, turns overlays off, and creates
the five-room current/candidate review selector. `validate-review.cjs` checks
all 15 room/view selections, equal native and displayed pair scale, host-state
restore/update behavior, and 320-pixel overflow.

## Explicit non-goals

No change to P01 seated/standing proportions, beds, Endoscopy occupied-bed
art, room shells, doors, paths, collisions, runtime integration, or existing
approvals is authorized by this scaffold.

## Candidate build status

`front-desk-candidate.html`, `xray-candidate.html`, `ct-candidate.html`, and
`endoscopy-candidate.html` are pending owner appearance review. Both selected
Endoscopy sources have transparent surrounds and are packed in the South and
East candidate atlases. The canonical proof and all runtime assets remain
unchanged.

Validation commands:

```text
node tools/room-design/furniture-revision-2026-09-22/validate-candidates.cjs
node tools/room-design/furniture-revision-2026-09-22/validate-interactions.cjs
node tools/room-design/furniture-revision-2026-09-22/capture-review.cjs
node tools/room-design/furniture-revision-2026-09-22/validate-review.cjs
```
