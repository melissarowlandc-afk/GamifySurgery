# Level 4 rooms — art handoff to Codex

Prepared by Claude Code, 2026-10-07, at the owner's request. Layouts, door
rules and routes are designed and validated; only the painted furniture is
missing. Coordination record: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`.

## Message to paste to Codex

> Please paint the Level 4 room furniture from Claude's art briefs.
> Rooms approved for painting: **[owner: list the rooms you approved, e.g.
> MRI, Pediatric Waiting, Pediatric Exam, Wound/Ostomy]**.
>
> For each approved room, follow its brief exactly (sizes, anchors, camera,
> style, what to reuse):
> - MRI Room — `tools/room-design/level-4/mri/ART_BRIEF.md` (10 pieces)
> - Pediatric Waiting Room — `tools/room-design/level-4/pediatric-waiting/ART_BRIEF.md` (7 pieces)
> - Pediatric Examination Room — `tools/room-design/level-4/pediatric-exam/ART_BRIEF.md` (5 pieces)
> - Wound/Ostomy Clinic — `tools/room-design/level-4/wound-ostomy/ART_BRIEF.md` (5 pieces)
>
> Use built-in image generation in the established GS-015 / Level 3 style.
> Save each original, its exact prompt and provenance under that room's
> `assets/` folder (same pattern as `tools/room-design/level-4/radiology-reading/assets/`),
> plus transparent processed PNG/WebP files named exactly as in the brief
> under `assets/processed/`. Do not overwrite the stand-ins, do not change
> the layouts, and do not integrate anything into the game, balance or saves.
> When done, tell Claude Code which files are ready; Claude fits them into
> the preview, re-runs the door/route validator and shows me before/after.

## What each brief covers

| Room | Size | New pieces | Reused approved art | Lighting |
| --- | --- | --- | --- | --- |
| MRI Room | 4×4 | magnet (side view), table empty + occupied, console, operator chair, coil cabinet, Zone IV sign, scan light, lockers, comfort cart | step stool (touch-up) | never dimmed |
| Pediatric Waiting | 4×4 | aquarium, kids' table, kid stool, toy chest, book bin, animal prints, kids' clock | waiting bench, west-facing armchair | normal |
| Pediatric Examination | 3×3 | north–south exam table, infant-scale counter with sink, growth chart, animal print, toy bin | rolling stool, west-facing armchair | normal |
| Wound/Ostomy Clinic | 3×3 | side-view treatment recliner, exam lamp, ostomy supply shelving, dressing cart, hygiene sign | rolling stool, sink, privacy curtain, biohazard bin | normal |

## Shared rules (in every brief)

- Same elevated-front orthographic camera and painted pixel-art finish as the
  approved rooms; dark outlines, light from the upper left, faint contact
  shadow only; transparent background; one object per image; native ≥ 240 px
  per tile.
- No logos, brand names, media characters, readable text (except "MRI" /
  "ZONE IV" on the MRI sign), and no wounds, blood or body detail.
- Every wall section stays a legal door: wall items hide for their doorway;
  floor-standing back-wall furniture stays full height on a low wall.

## After the art arrives (Claude)

1. Fit the art into `tools/room-design/touchup-2026-10/lab/design-rooms.js`,
   re-run `node tools/room-design/touchup-2026-10/validate.cjs`.
2. Owner reviews and approves each painted room.
3. Runtime integration with Codex: room definitions, prices, staff and
   services are Codex's; Claude wires the approved art and layout.
