# GS-026 employee expansion candidate packager

This additive pipeline packages and locally integrates 25 employee identities. The active local registry now contains 153 identities, 1,224 cardinal poses, 30 clipboards, and 1,254 assets. The original 128 registry records and all 1,054 original PNG bytes remain pinned and unchanged. The new 200 PNGs live under the separate `gs026-employee-expansion-v1` public root. This integration is not remotely published and is not recorded as owner art approval.

The frozen pre-expansion registry and provenance snapshots are stored under `baseline/` and pinned by `base-runtime-hash-ledger.json`, so a fresh checkout can reproduce and validate the additive composition. Do not recapture the baseline from the expanded active registry.

Rebuild and validate in this order:

1. `node tools/character-mapping/gs026-employee-expansion-v1/build.mjs`
2. `node tools/character-mapping/gs026-employee-expansion-v1/build-review.mjs`
3. `node tools/character-mapping/gs026-employee-expansion-v1/validate.mjs`
4. `node tools/character-mapping/gs026-employee-expansion-v1/promote.mjs`
5. `node tools/character-mapping/gs026-employee-expansion-v1/validate-promotion.mjs`

The composer accepts only the frozen 128-record baseline or its exact own 153-record expansion. It refuses to overwrite unrelated future registry additions.

A complete source bundle contains `assets/<id>-cardinals-v1.png`, a prompt record, and either `-tool-output-provenance.txt` or `-provenance.md`. The prompt record is normally `-exact-prompt.txt`. Identities 002–013 instead have candid `-reconstructed-prompt.txt` records derived from their batch template because the exact submitted strings were not retained; manifests label these `reconstructed-from-batch-template-not-exact-tool-input`. The PNG order is standing S/E/W/N followed by seated S/E/W/N. Extraction finds eight alpha-separated figures and row gaps from the artwork; it rejects overlaps, principal-figure clipping, missing figures, and ambiguous large detached components. It never repaints, thresholds, mirrors, or deletes source pixels. It records small nonprincipal pixels that meet a derived cell boundary; 008 has two alpha-13 pixels on an internal boundary while its principal figure and the source image edge remain unclipped.

All eight poses use the same whole-body scale calibrated to a 246-pixel standing-South visible height, then align to axis 80 and floor 287 on a 160x320 canvas. The builder initially estimates seat contacts only to draw review lines. These estimates remain `pending-parent-authorship-and-review` and cannot authorize runtime promotion. To author them, inspect `proofs/<id>/<id>-seat-contact-2x-dark.png`, add final output-canvas y coordinates for all four directions under `seatContacts.<id>` in `config.json`, rebuild, and review the line under the pelvis/upper thigh rather than at the hands, clothing hem, or feet.

Review evidence stays under `artifacts/character-statics/gs026-employee-expansion-v1`. The accepted roster is locally integrated; hiring uniqueness and any remote publication remain separate milestones.
