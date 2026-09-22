# North/south synthetic compositor runner (N2)

This fixed-purpose runner is prepared for one synthetic-only Cortan probe. It pins the accepted N1 graph (`a1c65208...e602e4a`), its 18 canvases, 674 nodes, 36 declared SaveImage outputs, eight procedural classes, captured schema, manifest, transform receipts, and the N1 adapter source bytes. It has no loader, model, private/resident raster, upload, URL, graph, class, or output-prefix override.

The current package is **unexecuted**. It proves runner validation and fake-fetch state handling only. It does not prove ImageScale sampling, alpha behavior, north/south pixels, garment behavior, private-art reuse, operator effort, or savings.

From the repository root:

```powershell
node tools/character-pose-process/north-south-runner.mjs --validate-only
node --test tools/character-pose-process/north-south-runner.test.mjs
node tools/character-pose-process/north-south-runner-validate.mjs
```

The one future submission command, only after separate parent release, is:

```powershell
node tools/character-pose-process/north-south-runner.mjs --execute
```

If a clean own receipt exists and polling or downloading is incomplete, resume the same job with:

```powershell
node tools/character-pose-process/north-south-runner.mjs --resume
```

`--execute` rechecks all eight live node schemas and requires an empty queue. It writes the exact request and attempt marker before POST, stores the raw response before parsing, and never retries an uncertain submission. `--resume` requires the immutable own request, attempt, raw response, and receipt. Both poll only the received prompt ID for at most 45 seconds per invocation. Only the 36 declared SaveImage PNGs may be downloaded; every image must retain its declared remote prefix and have a strict 448x1024 PNG IHDR. Windows subfolder separators are normalized only for comparison and are forwarded unchanged to `/view`.

Server execution time will come only from the own history's `execution_start`/`execution_success` timestamps. Download time uses a local monotonic clock. Queue time, operator time, and savings stay null unless separately measured. The ledger counts 16 canonical numeric source definitions and 143 procedural source uses; these are synthetic mechanics counts, not art reuse.
