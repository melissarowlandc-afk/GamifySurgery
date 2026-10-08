# staff-gapfill-v6d

Generation and packaging handoff for fourteen staff identities, exactly two per
assigned role. No runtime integration. Manager accepted thirteen identities and
requested a navy correction for 008. That correction is complete; its final
verification and a fresh manager browser run are pending.

IDs are `staff-gapfill-v6d.001` through `.014`, with imaging technician,
phlebotomist, laboratory technician, surgeon, OR nurse, pharmacist and repair
person occupying consecutive pairs in that order. Each identity has standing
and seated south/east/west/north frames: 112 transparent PNGs on the established
160x320 canvas, body axis X=80, floor Y=287 and standing-south visible height 246.

Built-in imagegen availability was confirmed before work. All art came from that
tool: fourteen standing identity sheets, fourteen eight-pose sheets and one
targeted native correction for 005. There is no procedural character art,
mirroring, thresholding, pixel cleanup or repainting. Packaging uses the
unchanged GS026 extractor/normalizer also used by v5 staff. The manager-authorized
008 revision then applies a deterministic, measured RGB palette correction to
all eight extracted poses. A lossless raw PNG codec retains every alpha byte,
protected outline and unselected RGB value; the native sheets remain immutable.
Canvas code extracts/scales/composites bitmap pixels and draws review annotations.

See [NAVY_CORRECTION_HANDOFF.md](NAVY_CORRECTION_HANDOFF.md) for the correction
history, measured existing navy RGB 36/63/118, independent audit and exact output.

Existing role uniforms were inspected before generation: all sixteen eligible
looks, at least two per role. Exact eight-pose composites are in `references/`
under the artifact root. Uniform cues follow those role pools; recent accepted
v6a/v6b sheets control the cohort style. Two identities wear glasses (14.3%).

## Review artifacts

- [Main gallery](../../../artifacts/character-statics/staff-gapfill-v6d/review/index.html)
- [Fourteen-identity overview](../../../artifacts/character-statics/staff-gapfill-v6d/review/owner-overview-stand-south-sit-east.png)
- [Seven role comparison sheets](../../../artifacts/character-statics/staff-gapfill-v6d/comparison/roles.html)
- [Role overview](../../../artifacts/character-statics/staff-gapfill-v6d/comparison/per-role-old-and-new-overview.png)
- [Accepted v6a/v6b style and all normalized poses](../../../artifacts/character-statics/staff-gapfill-v6d/review/manager/index.html)
- [Whole-catalog comparison](../../../artifacts/character-statics/staff-gapfill-v6d/comparison/all-catalog.html)
- [Contact gallery](../../../artifacts/character-statics/staff-gapfill-v6d/contact-review/index.html)
- [Authentic Front Desk chair proofs](../../../artifacts/character-statics/staff-gapfill-v6d/placement-qa/index.html)
- [008 original / existing navy / corrected eight-pose proof](../../../artifacts/character-statics/staff-gapfill-v6d/corrections/008-navy-palette-v1/before-reference-after.png)
- [Per-identity handoff, concerns and exact output](HANDOFF.md)

The browser validator is prepared for the manager: 22 pages at desktop and phone
sizes (44 page/viewports), with 42 images in the main gallery. It was not run by
this worker. The manager's prior PASS covers the original batch; the revised
navy package needs a fresh manager run. Review files use local artifact links;
no game server, origin, profile or campaign storage was changed.

## Validation

Run from the repository root. All seven checks passed on the corrected package:

```powershell
node tools/character-mapping/staff-gapfill-v6d/validate-roster.mjs --require-complete
node tools/character-mapping/staff-gapfill-v6d/validate-placement-qa.mjs --require-complete
node tools/character-mapping/staff-gapfill-v6d/validate-worker-review.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-all-catalog-comparison.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-navy-correction.mjs
node tools/character-mapping/staff-gapfill-v6d/runtime-baseline.mjs
node --experimental-vm-modules tools/character-mapping/staff-gapfill-v6d/check-syntax.mjs
```

Exact command/exit/stdout/stderr logs:
`artifacts/character-statics/staff-gapfill-v6d/validation/worker-validation.txt`
and `.json`. The Node experimental warnings are informational; PowerShell
captures them as NativeCommandError records even though every exit code is zero.
The worker sandbox blocks Node child-process spawning and `.ps1` script-file
execution. Validators were launched directly from PowerShell; no policy or
sandbox settings were changed. `record-worker-validation.mjs` collects their
separate stdout/stderr/exit files without spawning processes.

Manager-only browser command:

```powershell
node tools/character-mapping/staff-gapfill-v6d/validate-gallery.mjs
```

No dependencies were installed. No Git or web commands were run. No clinical
content, selection weights or demographic selection logic was added.

## Rebuilding review artifacts

Do not rerun `setup-v6d.mjs`: it is a historical intake scaffold and refuses to
overwrite existing modules. Do not regenerate prompts or overwrite immutable
source/provenance/history files. The complete exact native requests are already
saved with each stage, including the one correction.

If the manager explicitly changes authored contact candidates, follow the same
staff order before binding new review receipts:

```powershell
node tools/character-mapping/staff-gapfill-v6d/bind-worker-contacts.mjs
node tools/character-mapping/staff-gapfill-v6d/build-roster.mjs
node tools/character-mapping/staff-gapfill-v6d/build-placement-qa.mjs
node tools/character-mapping/staff-gapfill-v6d/build-roster.mjs
node tools/character-mapping/staff-gapfill-v6d/build-comparison.mjs
node tools/character-mapping/staff-gapfill-v6d/build-style-review.mjs
node tools/character-mapping/staff-gapfill-v6d/build-qa-atlases.mjs
node tools/character-mapping/staff-gapfill-v6d/build-navy-proof.mjs
```

Review altered proofs before recording any fresh acceptance. `bind-worker-review`
records worker QA only and must follow actual inspection. Manager approval and
append-only runtime integration belong to a separate milestone. Source paths in
provenance retain the built-in tool's native local output; repository copies are
byte-exact. Pose validation replays extraction against the native sources and,
for 008 only, the recorded palette transform against the frozen original poses.
Do not rerun `prepare-navy-correction.mjs`; it refuses to overwrite history.
