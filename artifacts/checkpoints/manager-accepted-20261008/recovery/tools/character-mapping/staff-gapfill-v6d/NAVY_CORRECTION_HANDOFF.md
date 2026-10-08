# staff-gapfill-v6d.008 navy correction handoff

The manager-requested correction is complete. Surgeon 008 now uses the existing
surgeon navy on its scrubs and cap across standing and seated S/E/W/N. This is
one deterministic palette correction, with zero regeneration or imagegen calls.
All seven final worker validators PASS, exit codes `[0,0,0,0,0,0,0]`.

The other thirteen identities were already accepted by the manager and their
104 pose PNGs are byte-identical. Final verification of this correction and a
fresh browser gallery run belong to the manager. Runtime integration remains
outside this lane and `runtimeReady:false` is retained.

## Measured palette and preservation

Reference: `level3-roster-v2.006/stand-south.png` in the existing runtime art.
Reference SHA-256:
`bc852b0dbc8b761f208c0dfd897182454709a7fd79a0b6c7a161b2ba5d4e9348`.

Measurement scans raw RGBA8 uniform-interior pixels, excluding protected ink and
the meaningful-alpha silhouette boundary. It uses 10,750 existing reference
pixels and 11,897 original 008 standing-south pixels.

| Palette | Median RGB | Median HSV |
| --- | --- | --- |
| Existing surgeon navy | 36, 63, 118 (`#243f76`) | 220.3125 / 0.6923076923076923 / 0.4627450980392157 |
| Original 008 blue | 31, 75, 162 (`#1f4ba2`) | 219.8507462686567 / 0.8113207547169812 / 0.6352941176470588 |
| Corrected 008 navy | 36, 63, 118 (`#243f76`) | 220.2439024390244 / 0.6923076923076923 / 0.4627450980392157 |

The same measured transform applies to all eight poses: hue +0.46175373134329334
degrees, saturation x0.8533094812164579, value x0.7283950617283952. Relative
brightness shading is retained, subject only to RGB integer rounding. The mask
selects original alpha >=13, hue 210–235, saturation >=0.35, maximum RGB channel
>64, and pixels inset from the alpha-13 silhouette by one pixel. All other RGBA
values are untouched. This includes all original alpha bytes, dark ink, boundary
pixels, skin, hair, moustache, shoes, transparent RGB and alpha-1 source noise.

An independent validator recomputes the palette measurements and RGB formula
without calling the production recolour function. It verifies every pixel, PNG
non-IDAT metadata, dimensions, anchors, bounds, normalization transforms, history
hashes, 104 other poses and all 56 native source/provenance files.

| ID | Role | New regenerations | Deterministic corrections | Changed RGB pixels | Style concern |
| --- | --- | ---: | ---: | ---: | --- |
| staff-gapfill-v6d.008 | Surgeon | 0 | 1, eight poses | 73,821 | Brighter-blue concern resolved; navy matches the reference median and visually matches the role sheet. Manager verification pending. |

| Pose | Changed RGB pixels | Alpha / unselected RGB / protected ink / silhouette boundary differences |
| --- | ---: | --- |
| stand south | 11,897 | 0 / 0 / 0 / 0 |
| stand east | 7,868 | 0 / 0 / 0 / 0 |
| stand west | 7,993 | 0 / 0 / 0 / 0 |
| stand north | 13,942 | 0 / 0 / 0 / 0 |
| sit south | 8,064 | 0 / 0 / 0 / 0 |
| sit east | 6,703 | 0 / 0 / 0 / 0 |
| sit west | 6,675 | 0 / 0 / 0 / 0 |
| sit north | 10,679 | 0 / 0 / 0 / 0 |

Independent relative-shading violations: **0**. Canvas remains 160x320, axis X80,
floor Y287, standing-south height246. Contacts remain S235/E248/W248/N249.

## History and current review

The immutable transform specification is
[corrections/008-navy-palette-v1.json](corrections/008-navy-palette-v1.json), SHA-256
`0676c33981f57f368b8a24a90b0bf237abaf3dcedd1551ead6a2affdbd38bb6a`.
Per-pose before/after hashes and exact counts are in
[navy-palette-results.json](../../../artifacts/character-statics/staff-gapfill-v6d/validation/navy-palette-results.json).

Artifact `corrections/008-navy-palette-v1/history/` retains the original eight pose
PNGs, package manifest/proofs, staging/alpha/visual/comparison manifests, prior
validation and manager browser evidence: 88 files bound by `history-receipt.json`.
A separate `history/tools/history-receipt.json` binds the previous handoff,
README, visual notes, contact ledger and palette/codec implementation. Do not
rerun the one-time `prepare-navy-correction.mjs` or overwrite either history.

The original built-in source remains blue and byte-identical, source SHA-256
`5081be85b64dfdeed8cc2aa19979e32f029b0af0fff3caead9856f4989fd2604`.
The package, per-pose and staging manifests record the derived RGB correction
separately. The source-review page shows the immutable native source; the main
008 card explains its corrected package. No new source provenance is invented.

Current rebuilt and inspected proofs:

- [All eight original / existing navy / corrected poses](../../../artifacts/character-statics/staff-gapfill-v6d/corrections/008-navy-palette-v1/before-reference-after.png)
- [Surgeon existing-left / new-two-right sheet](../../../artifacts/character-statics/staff-gapfill-v6d/comparison/surgeon-old-and-new.png)
- [Fourteen-identity overview](../../../artifacts/character-statics/staff-gapfill-v6d/review/owner-overview-stand-south-sit-east.png)
- [Main gallery](../../../artifacts/character-statics/staff-gapfill-v6d/review/index.html)
- [Eight corrected poses on dark background](../../../artifacts/character-statics/staff-gapfill-v6d/packages/008/full-poses-dark.png)
- [Contact overlay](../../../artifacts/character-statics/staff-gapfill-v6d/worker-review/contact-overlays/008.png)
- [Authentic south-facing chair proof](../../../artifacts/character-statics/staff-gapfill-v6d/placement-qa/008-front-desk-chair-placement.png)
- [Corrected 008 whole-catalog nearest comparison](../../../artifacts/character-statics/staff-gapfill-v6d/comparison/008-all-catalog-nearest-six.png)

Gallery, overview, all seven role sheets, style/full-pose boards, nearest boards,
contact overlays and chair proofs were rebuilt. Correction proofs, 008 light/dark
poses, surgeon sheet, overview, contacts, chair and both nearest boards were
inspected with `view_image`. The other 104 accepted poses retain their original
inspection evidence and exact PNG bytes. Worker QA receipts are rebound.

The manager-authored `review/manager-roles-existing-left-new-right.png` and
`validation/gallery-browser-results.json` are preserved historical evidence of
the original batch, with bright-blue 008. Use the rebuilt surgeon sheet above
for current review. `validation/browser-revalidation-needed.json` records the
fresh-run requirement; the worker does not claim a new browser PASS.

## Validation and owned changes

The final independent checks cover roster/alpha/anchor/source replay, placement,
worker/static gallery review, near-duplicates, raw palette preservation, runtime
baseline preservation and syntax (28 modules). All seven PASS with exit 0.
Near-duplicate checks recompute 3,990 catalog and 32 existing-role comparisons,
91 within-batch pairs and seven new same-role pairs: **zero flags**. Catalog
minimum RMSE 41.540485534915966; within-batch minimum 50.65658776941163. The
accepted clinical/runtime catalog remains at 285 identities, with prior 265
identities/2,150 PNGs and accepted v6b art preserved.

[HANDOFF.md](HANDOFF.md) contains all seven exact command/stdout/exit records and
the complete fourteen-identity table. Complete stdout/stderr is in
[worker-validation.txt](../../../artifacts/character-statics/staff-gapfill-v6d/validation/worker-validation.txt)
and its JSON receipts. Node experimental warnings appear in captured PowerShell
stderr while all process exit codes are zero. One exploratory inline syntax
probe omitted the required VM flag and failed before running or writing; the
actual final syntax validator uses `--experimental-vm-modules` and PASSes.

New tools: raw PNG codec, palette helper, one-time history preparation,
independent palette validator, proof builder and correction specification.
Updated tools: packager, roster replay validator, review notes/binder/validator,
validation collector, README and handoffs. Updated artifacts: eight 008 poses,
package/staging/alpha/review manifests, rebuilt review boards and validation.
The owned-lane inventory is `validation/final-lane-files.json`; the program plan
has an append-only correction Progress note with its own hash receipt.

Sol executed directly; no subagents, Git, installs, web, external messages,
clinical edits, runtime integration or writes in v6b/v6c lanes. All artifacts are
LOCAL ONLY. No game launcher, browser profile, origin or save changed. Manager
owns common handoff, final acceptance, integration and GitHub checkpoint reminder.

Manager next action: inspect the actual correction and final receipts, rerun
`node tools/character-mapping/staff-gapfill-v6d/validate-gallery.mjs` (prepared 44
page/viewports), and record acceptance. No new design decision remains.
