# Character pose process: offline M1 adapter

This tool compiles an explicit piece-to-target recipe into an **unexecuted,
procedural-only** ComfyUI graph. M1 does not contact Cortan, load an image, run a
model, submit a prompt, or claim a rendered proof. Its purpose is to make the
proposed compositor mechanics concrete enough for review before M2.

## Recipe interface

The recipe fixes a `448x1024` document and top-left edge coordinates (`x` right,
`y` down, max-exclusive bounds). Every synthetic piece declares:

- a canonical numeric source definition and its
  `canonical-numeric-definition-sha256` hash;
- full source crop, donor-local pivot and rest vector;
- source offset, proximal/distal overlap, anatomy/lineage, and layer order.

Every target binds one known piece to a flat phase identity and supplies
proximal/distal endpoints. It also declares the corresponding pivot target,
clockwise rotation, and proposed placement. Validation recalculates all three,
rejects any length change, preserves their float values in the proposal, and
quantizes only `AddLayer.x/y` with `floor(value+0.5)`. This is the adapter edge
for GS-012's target-only records; the adapter does not reproduce gait fitting or
IK. A future private-art recipe will additionally need verified image bytes and
measured donor pivots. M1 has no such mode and rejects resident/private
references recursively.

`sourceOffset` is present to make the eventual donor mapping explicit, but M1
requires `{x:0,y:0}` because procedural sources are full-canvas definitions.
The future resident adapter must apply and verify a nonzero donor/source offset;
it cannot merely carry the field as unused metadata.

The fixture uses asymmetric two-rectangle procedural sources for seven separate
cases: control, positive and negative rotation, signed clipping, noncentral
pivot compensation, opaque alpha, and transparent alpha. Each piece is first
composited on its own explicit transparent canvas. Those composites are placed
with real `AddLayer` nodes on a `448x1024` document created from a transparent
`1x1` layer through `LayersFromBoundingBoxes` with `crop_to_content:false`.
`ImageCompositor` produces the image and transparency mask (`1=transparent`),
and two `SaveImage` nodes use only the owned
`synthetic/pose-process-proof-v1/` prefix.

The captured object-info bytes are pinned by SHA-256
`3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a`.
The emitter hard-codes a no-loader/no-model whitelist: `EmptyImage`,
`SolidMask`, `LayersFromBoundingBoxes`, `AddLayer`, `ImageCompositor`,
`MaskToImage`, and `SaveImage`. It validates required inputs, unknown inputs,
literal types/ranges/options, references, output socket types, and save paths
against that capture. Caller-supplied class names cannot enter the graph.
Socket-typed inputs must be graph references, compositor state must be exactly
`{}`, bounding-box JSON and canvas identity are fixed, the graph must be acyclic,
and every node must feed one of the two declared saves. The CLI rejects unknown
or duplicate flags and extra positional arguments.

## Commands

Run from the repository root. These commands perform local reads and writes
only:

```powershell
$proof = 'Photos for Codex 2\Codex Patients or Staff or Other Characters 2\mixed-batch-2026-09-10\pose-process-proof-v1'
node --test tools\character-pose-process\index.test.mjs
node tools\character-pose-process\cli.mjs validate-recipe --recipe "$proof\fixture-recipe.json" --schema "$proof\parent-evidence\node-schemas.json"
node tools\character-pose-process\cli.mjs emit --recipe "$proof\fixture-recipe.json" --schema "$proof\parent-evidence\node-schemas.json" --output "$proof\a-new-proposal-name.json"
node tools\character-pose-process\cli.mjs validate-graph --graph "$proof\a-new-proposal-name.json" --schema "$proof\parent-evidence\node-schemas.json"
```

`emit` and `ledger-init` use exclusive creation and refuse an existing output.
Use a new reviewed filename rather than overwriting evidence.

The durable ledger uses an expected revision and expected state hash. Append
acquires an exclusive lock, rereads the on-disk ledger, rejects stale or
conflicting expectations, validates the event against prior events, writes and
fsyncs a temporary complete state, then renames it into place. An event input
may contain only `{ "event": ... }`; an embedded old ledger can never replace
newer progress.

```powershell
node tools\character-pose-process\cli.mjs ledger-validate --ledger "$proof\ledger-output.json"
node tools\character-pose-process\cli.mjs ledger-append --ledger "$proof\ledger-output.json" --event "$proof\a-new-event.json" --expected-revision 1 --expected-sha <current-state-sha256>
```

Ledger events carry an actual job ID/status, nullable measured queue/execution/
download durations, explicit operator preparation/review intervals with actor,
type and measurement source, correction parent/reason, output hashes/review
states, and piece-use/reuse evidence. Unknown metrics stay `null`. Summary
totals include only recorded values. In existing ComfyUI histories,
`execution_success.timestamp - execution_start.timestamp` measures server
execution only; it does not establish queue, download, operator effort, or
savings. Unrelated historical operations are not benchmarks.
Piece reuse totals count only `execution` events with `succeeded` status. Review
or proposal records cannot manufacture reuse, and a second duration for the same
job/category is rejected rather than counted twice.

## What M2 must prove

The installed schemas declare clockwise rotation, signed placement, native
size for width/height zero, stable `z_index`, and transparency masks where one
means transparent. They do not prove runtime center-pivot behavior,
rotation/clipping/rebase behavior, retained fixed canvas size, alpha polarity in
actual pixels, or interpolation. These are labeled hypotheses in the emitted
proposal. A later reviewed synthetic M2 submission must measure them before any
private raster assembly. The M1 proposal and ledger both remain explicitly
unexecuted.

The schema also states that `AddLayer.mask` multiplies an image's existing
alpha. The procedural source composites are binary-alpha, so passing their
transparency output back as the layer mask is suitable for this mechanics probe.
The same pattern could square fractional alpha and must not be assumed safe for
future antialiased resident pieces without a separate check.
