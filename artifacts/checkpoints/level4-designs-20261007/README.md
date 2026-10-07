# Level 4 room designs: recovery archive (2026-10-07)

These are design-only previews Claude Code made at the owner's direction on
2026-10-07, under the GS-015 room-review process. None of this is in the game
yet. Log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
("Level 4 room design" and the "ready for owner review" entry).

## What it covers

- **MRI Room** (4×4): glass control window, every element re-oriented
  compared with CT, never dimmed. Stand-in art, layout and art brief.
- **Pediatric Waiting** (4×4), **Pediatric Examination** (3×3, table
  north-south) and **Wound/Ostomy Clinic** (3×3, side-view recliner):
  stand-in art and art briefs.
- `CODEX_ART_HANDOFF.md`: the combined art handoff for Codex.
- **Layouts** live in `tools/room-design/touchup-2026-10/lab/design-rooms.js`.
  The copy here matches the one in `room-touchups-20261007`. You view them in
  that archive's touch-up lab.
- **Call Room removal** (owner decision): Claude-only patches for three docs.

## Contents

- `files/`: full copies of the Claude-created design files, including the
  stand-in generators `make_level4_standins.py` and `mri/stand-in/make_standins.py`
  and the PNGs they produced.
- `recovery/patches/`: Claude-only doc patches. Each rebuilds its live doc
  byte for byte (`recovery/patch-verification.json`).
- `evidence/`: review sheets and stand-in contact sheets.
- `manifest.json`: SHA-256 of every archived file.

## Not included

- `tools/room-design/level-4/mri/assets/` and `mri/proof/`. Codex created
  these after Claude's brief, as final MRI art and proof work. They are not
  Claude's.
- `radiology-reading/runtime-promotion/`, which is already in
  `room-touchups-20261007`.
- Room definition IDs in the previews are placeholders (`room.mri`,
  `room.pediatric_waiting`, `room.pediatric_examination`, `room.wound_ostomy`).
- There are no runtime, balance, save or clinical changes.
