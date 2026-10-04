# Preferred character movement recovery checkpoint — 2026-10-04

This compact archive preserves the owner-selected movement treatment as a
recovery artifact. It is not a full clean checkout, deployment, release, or
claim that the shared dirty worktree belongs to this task.

The archive stores current task-coherent presentation sources and the dedicated
browser proof, while `recovery/FacilityScene.preferred-bounce.patch` preserves
the renderer-only delta against the captured baseline. The live renderer is a
mixed shared file, so it is deliberately not copied or staged whole.

## Restore

1. Start from a compatible checkout with the exact baseline hash recorded in
   `recovery/SOURCE_HASHES.json`.
2. Verify each file listed in `manifest.json` with SHA-256 before restoring.
3. Copy the `files/` payloads to their recorded original paths. Apply the
   `FacilityScene` patch only when the baseline hash matches; otherwise review
   its small motion-only hunks and integrate manually.
4. Run the focused presentation, route, art and Phaser browser checks recorded
   in the copied plan before merging.

The archived preview HTML is the owner-selected 1x speed comparison. It embeds
existing project art for local review and does not fetch network content.

## Deliberate exclusions

No owner saves, browser profiles, screenshots, traces, build output, package
stores, `.env` files, generated source inputs, raw art inputs, or unrelated
shared work are present. The original GS026 art and still-rendering archive
remains in `artifacts/checkpoints/gs026-20260929/`.
