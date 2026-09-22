# Synthetic north/south projection adapter

This local-only adapter prepares an unexecuted procedural ComfyUI graph for the separately gated north/south projection strategy. It reads numeric JSON and the captured node schema. It does not read character images, contact Cortan, run a model, or qualify artwork.

Build once from the repository root:

```powershell
node tools/character-pose-process/north-south-projection-build.mjs
node --test tools/character-pose-process/north-south-projection.test.mjs
node tools/character-pose-process/north-south-projection-validate.mjs
node tools/character-pose-process/north-south-projection-validate.mjs --seal v3
```

The build creates missing outputs exclusively, verifies byte-identical immutable outputs on a repeat run, and refuses any changed existing output. It pins the frozen synthetic baseline target artifact, captured schema and compiler fingerprint, creates a truthful synthetic N/S registration recipe through the frozen compiler, and emits 18 canvases with 36 declared outputs. Every source limb uses a vertical 160-pixel rest span in a 192-pixel transparent source. Width stays fixed; height is the single half-up-quantized along-axis scale. Placement anchors the proximal endpoint and is quantized once.

The graph uses `ImageScale(nearest-exact, crop=disabled)` before the previously measured zero-display-size `AddLayer` rotation. ImageScale intrinsic-alpha preservation, pixel-center sampling and resized-center interaction remain unproved until a separately reviewed synthetic Cortan run. The depth policy is synthetic evidence only: far leg, far arm, fixed torso plate, near leg, near arm. Its fixed plate is `(x=90,y=300,width=300,height=400,z=300)` on the 448×1024 canvas; analytical receipts require positive transformed opaque-primitive intersection with the plate for every one of the four limb depth groups in every baseline phase. It is not garment or character approval. Hands, feet, head, torso artwork, hidden surfaces and real donors remain unsupported.

Validation is read-only by default. `--seal vN` writes a new versioned TAP receipt, validation report and checksum manifest exclusively after observing a nonempty passing test run; it never refreshes or overwrites evidence.
