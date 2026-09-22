# Offline character fit-target compiler

This Node-core tool compiles a complete, measured character recipe into 32 numeric authoring targets: eight phases for east, west, south and north. It reads JSON and contract text only. It has no image, network, model, compositor, runtime or game integration code.

Targets keep `view` in cardinal language while their contract output keys use the existing asset vocabulary: east→`right`, west→`left`, south→`front` and north→`back`. For example, phase 1 east is `<templateId>:right-walk-1`.

Every result is `target_only` and `authoring_target_pending_raster_review`. A successful compile proves numeric reachability and registration, not raster quality, donor validity, source-image integrity, runtime readiness or owner approval. Source image hashes in `lineage` are declared recipe inputs; GS-010 must verify actual raster and donor bytes before composition.

## Recipe interface

A complete recipe contains:

- `identity`: one stable template/output key. A changed display name is not a fit.
- `references`: repository-relative contract/reference paths with verified SHA-256 values.
- `evidence`: each measured or estimated fitting group, its source and uncertainty.
- `lineage`: independent source declarations for each view, or an explicitly approved reflection with the shared 01↔05, 02↔06, 03↔07, 04↔08 permutation.
- `lateral`: frame, per-view source registration, head/torso envelope, hidden joint centers, fixed 2D limb lengths, geometric shoe dimensions and compact motion parameters.
- `northSouth`: frame, registration, fixed latent-3D limb lengths, stable lanes, head/torso dimensions, projection, geometric shoe dimensions and motion parameters.
- optional `donorContract`: when present, every piece must declare a unique key, source path/hash, crop-local pivot, overlap policy and permitted rigid transforms. The compiler never discovers or invents donor data.

Missing measurements stay in a batch as `pending_measurement`; they are not defaulted from Patient 01. The Patient 01 recipe is a worked input derived from its accepted numeric references.

## CLI

Run from the repository root:

```text
node tools/character-mapping/cli.mjs compile --recipe docs/features/character-movement/recipes/patient-01.json
node tools/character-mapping/cli.mjs check --recipe docs/features/character-movement/recipes/patient-01.json
node tools/character-mapping/cli.mjs batch --manifest docs/features/character-movement/batches/first-existing-four.json
node tools/character-mapping/cli.mjs batch --manifest docs/features/character-movement/batches/first-existing-four.json --member mixed-20260910-patient-01
```

Outputs live under `artifacts/character-movement/mapping-pipeline/worker-runs/`. The dependency fingerprint covers canonical recipe bytes, verified motion/reference bytes, and compiler/math source. Each output is stored at `<outputKey>/<fingerprint>/targets.json`. Existing verified bytes are reused; a changed dependency selects a new immutable directory; tampered output fails. `.partial` files expose interrupted writes to `check`, while a safe compile rerun replaces or removes its own partial file without changing older runs.

The tool rejects symbolic links and Windows junctions anywhere in input, reference, output-file or partial-file ancestry. This keeps a lexical in-root path from redirecting reads, removals or writes elsewhere. CLI commands also reject unknown options, unexpected positional arguments and paths that escape their declared roots before compilation begins.

Batch manifests reject duplicate identity/output keys and compile only named members. `--member` may narrow a run but cannot add an identity outside the manifest. Pending rows are reported with blockers and produce no targets. CLI output records local tool time separately from manual/raster work, which remains unmeasured because the tool performs none.

Persisted batch summaries omit per-run `written`/`reused` disposition so their bytes and fingerprint stay stable on ordinary reruns. The returned CLI result reports those values under `invocationDispositions` instead.
The batch fingerprint always includes the compiler code fingerprint, including batches whose selected members are all pending measurement.

## Validation

```text
node --test tools/character-mapping/compiler.test.mjs
```

The tests cover Patient 01 regression against all 32 accepted targets, deterministic output and cache reuse, changed anatomy and compiler dependencies, fixed 2D/3D lengths, support geometry, invalid inputs, reflection/path/duplicate safety, stale/tampered/partial outputs, safe interrupted-batch resumption and a clearly synthetic hundreds-entry capacity run.
