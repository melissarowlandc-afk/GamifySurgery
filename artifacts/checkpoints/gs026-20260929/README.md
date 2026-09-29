# GS026 archival checkpoint — 2026-09-29

This directory is a scoped archival backup of the completed GS026 employee
coverage milestone, the directional standing-still bounce milestone, and the
minute-boundary performance fixes. It is intentionally stored outside the live
application tree so restoring it cannot make new tests discoverable or change
the runnable beta workspace.

The owner reviewed the completed 25-person roster on September 29, 2026 and
said it “looks good.” Earlier source records retain their historical labels;
this note records the later owner acceptance without rewriting provenance.

## What this archive preserves

- The 25 accepted employee source sheets, prompt records, provenance sidecars,
  frozen baseline, hash ledger, and additive build/validation pipeline. The
  rejected employee 005 white-coat source is excluded.
- All 1,254 active runtime PNG files: 1,054 frozen original assets plus 200
  employee-expansion assets.
- The active 153-identity registry, runtime provenance manifest, catalog,
  focused tests, three completed ExecPlans, and final proof screenshots.
- Task-coherent still rendering and bounce source files.
- Recovery-only excerpts for task code embedded in shared files. These excerpts
  are documentation for a careful manual integration; they are not an automatic
  patch and must not be applied blindly.

## Restore limits

This is **not a clean-build or deployable repository snapshot**. The live dirty
tree contains concurrent room, Periop, alert, clinical, service, and persistence
work. Several GS026 and performance changes share files with that work, so those
files are represented only by precise recovery excerpts under `recovery/`.

Restoring `files/` over an arbitrary checkout will not necessarily compile.
Integrate the catalog, appearance, persistence, reducer, type, index, renderer,
and view-model changes deliberately against the destination branch. Preserve
save compatibility and rerun the listed focused tests and project checks.

## Deliberate omissions

- `artifacts/character-statics/gs026-employee-expansion-v1/` (about 58 MB of
  reproducible review output).
- Inactive or historical walking experiments and walk registries. Runtime uses
  directional standing stills and requests no walking art.
- Rejected employee 005 white-coat art, other rejected/private generation
  material, raw photos, proprietary inputs, and ignored local browser profiles.
- Unrelated room, clinical, Periop, alert, service, retail, and UI work.
- Whole copies of shared `appearance.ts`, `persistence.ts`, `reducer.ts`,
  `types.ts`, `index.ts`, `FacilityScene.ts`, `viewModels.ts`, and
  `retail-operations.ts`.

## Integrity and recovery checks

From the repository root, verify every archived file:

```powershell
$checkpoint = 'artifacts/checkpoints/gs026-20260929'
$manifest = Get-Content "$checkpoint/manifest.json" -Raw | ConvertFrom-Json
foreach ($entry in $manifest.files) {
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath "$checkpoint/$($entry.archivePath)").Hash.ToLowerInvariant()
  if ($actual -ne $entry.sha256) { throw "Hash mismatch: $($entry.archivePath)" }
}
```

After manually integrating the archived source and runtime files, the additive
asset pipeline is checked in this order:

```powershell
node tools/character-mapping/gs026-employee-expansion-v1/build.mjs
node tools/character-mapping/gs026-employee-expansion-v1/build-review.mjs
node tools/character-mapping/gs026-employee-expansion-v1/validate.mjs
node tools/character-mapping/gs026-employee-expansion-v1/promote.mjs
node tools/character-mapping/gs026-employee-expansion-v1/validate-promotion.mjs
```

The manifest records archive paths, original repository paths, purpose, byte
size, and SHA-256. `recovery/SOURCE_HASHES.json` records the shared source files
from which the excerpts were taken. There is no automatic apply script.
