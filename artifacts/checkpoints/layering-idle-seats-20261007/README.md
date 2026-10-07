# Recovery-bed layering, front-door threshold, idle staff seats and seat ease: recovery archive (2026-10-07)

The owner asked for each part of this work in chat, approved the idle-staff
plan (own room only; even mix of sitting, workstation and standing) and then
said "push to GitHub". Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
(2026-10-07 Claude entries for recovery-bed sitters, idle staff seating and
the seat ease-in).

## What it changes

1. **Recovery beds.** A patient seated on a recovery bed no longer draws
   entirely over it. While a bed is occupied, the part of the bed just below
   the seat line paints in front of the sitter, so the legs hang behind the
   bed and the seat stays on the mattress. Eight masks (one per bed), each
   kept clear of its bedside monitor, reuse the existing side-chair split.
2. **Front door.** The Front Desk entrance threshold strip moved from the
   south-wall foreground layer to its own floor-level layer, so people walking
   through the front door draw on top of it. Jambs and wall lip unchanged.
3. **Idle staff.** Idle employees split time evenly between sitting on a free
   chair in their room, standing or sitting at the room's workstation, and
   standing elsewhere in the room (17 spots across 11 rooms; rotated
   endoscopy and phlebotomy layouts included). Spots another employee stands
   on or walks to are skipped. Reception, radiologists and GLP-1 NPs keep
   their fixed posts. Existing amenity/break/training trips are unchanged.
4. **Seat ease.** Sitting down, standing up and stopping at a furniture post
   glide over 180 ms (ease-out) instead of snapping. Jumps over 1.5 tiles
   still snap. Presentation only; depth, routes and saves are unchanged.

## Contents

- `files/`: complete copies of the six new files that are wholly this work
  (`employee-idle-spots`, `staffIdleSupports`, `characterSeatSettle`, each
  with its test).
- `recovery/patches/`: unified diffs of only Claude's hunks in nine shared
  files. Each baseline was rebuilt by reversing exactly these edits from the
  live file; `recovery/patch-verification.json` records that `git apply` of
  each patch to its baseline reproduces the live file byte for byte.
- `manifest.json`: SHA-256 of every archived file.
- `validation/results.json`: tests, typechecks, simulation and browser QA.

## Restore

Copy `files/` over the repository root. Then apply each patch:

```
git -c core.autocrlf=false apply recovery/patches/<file>.patch
```

Patches need surrounding code compatible with the shared tree at this
checkpoint (including other sessions' uncommitted side-chair, room and
staff-domain work). If a hunk no longer applies, re-apply it by hand from the
patch text.

Not included: other sessions' concurrent uncommitted work in the same files,
the owner's saves, and Claude's local QA harnesses under `.local-dev/`.
No clinical content, save-schema, income or timing rule changes.
