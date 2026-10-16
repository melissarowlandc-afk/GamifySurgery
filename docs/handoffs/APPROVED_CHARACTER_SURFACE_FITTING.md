# Approved character surface fitting — successor task

Owner explicitly approved the complete current master pose review on 2026-09-13
and requested a new task dedicated to fitting already approved character designs.
GS-012 master-body task is complete. This handoff supersedes earlier pending
review notes and the historical per-character crop/mesh fitting process.

Successor task: Approved character surface fitting,
01a09b55-147e-72f0-b413-e8b6827c7287 (local saved Gamify Surgery project).

## Workspace and approved baseline

Repository: C:/Users/Kyle Kent/Projects/GamifySurgery, branch beta. Many unrelated
dirty/untracked files exist. Read AGENTS.md and inspect status; preserve others.
These master artifacts are local/uncommitted; no GitHub backup was requested.

- Master walk/stand source: tools/character-mapping/canonical-master/.
- Master action source: tools/character-mapping/canonical-actions/.
- Walk manifest: artifacts/character-movement/canonical-master/preview/manifest.json
  SHA256 c9ccf24da87a4f89e1f464a65819d205bf0b2930950f9c60105a64c6d618c309.
- Action manifest: artifacts/character-movement/canonical-actions/preview/manifest.json
  SHA256 915cc7a0501fb8df50f2a0e7b19304acbbadfa99b9243f2db796fe413fad7de9.
- Contract: docs/features/character-movement/canonical-master-contract.md.
- Review controls: tools/character-mapping/canonical-master-preview/ and
  tools/character-mapping/canonical-actions-preview/.

Approved: eight walking phases in four directions, standing South, seated four
directions, eight-phase star jumps in four directions, clipboard holding four
directions. Body scale matches despite walk240x310/action280x350 canvas padding.
All characters means founders, patients, employees and sidewalk passersby;
map-up is North. Pause freezes exact pose/orientation. Ordinary floor stops face
South; seats use seated poses. Patient-bed poses were discussed earlier but no
bed-pose artwork is included in these approved manifests; do not invent approval.

Walk E/W legs are behind torso; far arm behind legs. N/S walking arms behind
torso. Elbows flex anatomically forward, never backward. Thumbs medial/anterior,
North thumbs hidden. Clipboard South: anatomical LEFT arm in front of board,
RIGHT behind; E/W board top farther from torso than bottom. South hold is12
units higher, intentionally owner-approved. Preserve this view-specific pose.

## New task scope

Convert approved clothing/skin/face details into surface artwork on the master;
hair and clothing extensions become attachments at named anchors/layers.
Motion, anatomy, hand orientation, proportions and all pose transforms belong
entirely to the master. No character-specific joints, limb resizing, gait,
foot repairs, head repositioning or source-sprite deformation exceptions.
Retain identities, palettes, clothing patterns and recognizable approved details.

Current implementation has master geometry and material-region metadata, plus
neutral renderers. A working local-coordinate texture/attachment pipeline is
NOT implemented yet. Build and prove it; do not mistake palette replacement or
metadata for actual reusable texture mapping. Walk and action renderers have
separate drawing code; any shared rendering refactor must preserve the approved
neutral pixels/geometry before adding identity layers.

Start with TWO approved identities: Green cardigan and Gray braid. Prove both
use the exact same underlying master pose/geometry, then present motion/standing/
sitting/jumping/clipboard review. Owner approval precedes wider batch conversion
or integration into gameplay. Do not redesign the roster or create new identities.

Sources (immutable):
- Photos for Codex 2/Patients or Staff or Other Characters/exec-0b03b9bb-45a8-4d1a-a785-7654d39c0478.png
  Green cardigan, patient.adult.046.
- Photos for Codex 2/Patients or Staff or Other Characters/exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png
  Gray braid, prior preview ID retained.gray-braid.
Owner says all designs in Photos for Codex 2/Patients or Staff or Other Characters
and Photos for Codex 2/Founders are approved, plus secretary/nurse/two patients
created earlier in GS-012. Preserve originals and discover exact catalog records
before assigning production IDs; do not assume every generated intermediate is
an approved source. Historical reauthored-batch-02 mappings were rejected and
must not become the new body rig.

## Required proof

Delegate implementation per standing user AGENTS instructions; use a new fitting
ExecPlan. First inventory actual master render paths and design references,
then implement one reusable surface/attachment system and two costume records.
Include pattern-following through rotation, attachment bounds/depth, head/neck
continuity and exact pose hashes. Show neutral overlay/source comparisons at
native scale. Check all approved actions, exact pause and absence of clipped
hair, detached feet, stray pixels, reversed hands or private anatomy offsets.
Automated geometry checks supplement visual review; never call them aesthetic
approval. Batch size and generalization should be demonstrated before hundreds.

Prior root independently validated40 action poses,32 walk frames, preserved
approved assets, native previews and exact pause. No commit, push or deployment
was performed. Remind owner that a GitHub push is backup, not a prerequisite
to continuing locally; push only after explicit instruction.
