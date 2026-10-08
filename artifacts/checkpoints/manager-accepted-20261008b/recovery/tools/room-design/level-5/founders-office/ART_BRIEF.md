# Founder's Office — base-room art brief

2026-10-08. **Proposed layout; owner review pending.** The room category and
functional-plus-appearance upgrade direction are accepted, but no footprint or
individual appearance tier is defined. This 4×4 isolated base-room candidate
does not approve them or implement a game room.

Roadmap: `docs/features/facility-levels-and-clinical-release-points.md:182–190`.
Accepted upgrade direction: `docs/execplans/gs038-all-room-upgrades.md:459,465–466`.
Exact future footprints remain deferred at roadmap lines 265–275. See
`docs/execplans/level5-room-design-20261008.md` for the full inventory trace.

## Layout before painting

At 120 proof pixels per tile: warm light-oak plank floor, muted teal lower north
wall, cream above, established dark-green trim. Central-left desk faces south;
the real `founder.01` south seated still sits on an approved south-facing swivel
chair behind it. A real adult visitor sits west in the approved waiting armchair
to the desk's southeast, behind its front armrest layer. Their legs hang down.
No footrest, clinical patient pose, stool or pediatric occupant is introduced.

Permanent central furniture does not enter a doorway. All 16 one-tile wall
sections are independently usable doors; clear perimeter walking routes reach
both standing seat approaches. North bookcase hides for N1/WA, plant for N4/EA,
wall print for N2; no pass-through exception is needed. Floor-standing bookcase
and plant retain full height when north backing lowers the wall. Wall art hides
on its own backed section. Stand-ins and footprint JSON remain saved as the
prepainting design evidence.

## Camera, style and safe content

Established GS-015 elevated-front **orthographic** view: facing north into the
room, horizontal furniture edges, modest visible top surfaces, no isometric
diagonals. Painted pixel-art finish, clear dark outlines and restrained texture,
light from upper left. Match approved Pediatric Exam/Wound furniture scale and
Level 3 office objects. Transparent background, one object per image, native
resolution sufficient for at least 240 pixels per tile; prepared target 480.
Only faint contact shadow. No room shell painted into an object.

No people embedded in furniture; use existing real character stills. No logos,
brand names, readable text, seals, diplomas with writing, media characters,
wounds, blood or exposed clinical body detail. Book spines and wall art have
only blank color shapes. No clinical content or gameplay effect is authored.

## Four new pieces

| File | Proposed native canvas / render size | World anchor | Description |
| --- | --- | --- | --- |
| `founder-desk` | 720×432 / 1.50×0.90 tiles | final floor bottom center (1.45, 1.82) | Straight-front light-oak desk with slim legs, one shallow drawer unit and small brass pulls; uncluttered top, a closed blank notebook and a small plain white mug. No monitor, signage or extra chair. Worktop target is the approved approximately 80 px rise at 120 px/tile; inspect actual generated leading edge before final registration. Initial stand-in used floor (1.45, 2.02); measured art reconciliation moved it 0.20 tile north without changing footprints, doors or seats. See `layout-reconciliation.json`. |
| `office-bookcase` | 384×600 / 0.80×1.25 tiles | floor bottom center (0.52, 0.35) | Slim light-oak freestanding bookcase, varied muted teal/cream/ochre blank books, a plain ceramic bowl; short feet. Upright front, no readable spines. |
| `office-plant` | 312×456 / 0.65×0.95 tiles | floor bottom center (3.45, 0.35) | Calm leafy indoor plant with unequal broad leaves, warm cream cylindrical pot. Single isolated plant, no flowers or extra objects. |
| `office-print` | 312×202 / 0.65×0.42 tiles | actual alpha top center (1.50, −0.68) | One slim oak-framed abstract landscape: muted teal hills, pale cream sky and small ochre circle; graphic shapes, no caption or text. |

Reused without repainting: approved south-facing Reading Room chair and its
recorded foreground cutoff; approved west-facing Waiting armchair and approved
Pediatric Waiting front-armrest mask; real `founder.01` south and
`patient.adult.007` west stills. Record original paths, approvals, all source
hashes, source rectangles and native transforms in the provenance receipt.

## Layering, preparation and acceptance

Founder chair → real founder → chair foreground → desk, ordered by physical
floor lines. Visitor chair → real visitor → matching front armrest mask. Register
hips to actual cushion points. Furniture and character aspect ratios stay
uniform; no global character scaling changes. Desk, chair and visitor retain
the clear approach routes. Dotted seat-contact links are explicitly separate
from walkable routes and do not assert walking through furniture.

Use built-in image generation, one call per piece. Preserve each returned
original unchanged under `assets/originals`, the exact request under
`assets/prompts`, and tool receipts, source and processed SHA-256 values under
`assets`. Crop transparent margins and uniformly downsample only; no semantic
painting with code, no stretched fit or hidden source replacement. Keep generated
transparency. Any rejected generation remains versioned with its reason.

Save `proof/index.html`, the inherited Level 4 controls and diagnostics, Node
validators, actual-native-render evidence, `validate-browser.cjs` and
`capture.cjs`. Owner art approval and runtime integration remain separate.
