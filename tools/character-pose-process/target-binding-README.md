# Offline target binding seam

This seam selects one record from the hash-pinned GS-012 target artifact and
binds explicit procedural pieces to native endpoint references. It copies target
identity, phase, registration, coordinate-space, lineage and rendering-order
metadata into the resolved record. It does not read image bytes, discover donor
parts, solve gait, rescale pieces or support private/resident sources.

Each piece declares a canonical numeric source definition and hash, full crop,
crop-local pivot and rest vector, zero applied source offset, overlap, anatomical
side/part, rendering group/order, proximal/distal target paths, and the frame
segment scalar used for the rigid-length check. Endpoint values are dereferenced
from `geometry.nativeMaster`; callers never retype them.

The implemented graph path is limited to synthetic east/west targets on a fixed
448×1024 canvas. North/south targets retain their visibility data in the source
artifact but graph emission refuses them until a separately reviewed projection
strategy exists. All image input kinds remain unsupported.

The endpoint residual bound is pinned to the accepted compiler precision:
`sqrt(2)*0.0001/scale + sqrt(2)*0.0001`. An additional 0.00005 native pixel is
used only when comparing the artifact's rounded native segment scalar. These are
numeric parsing bounds, not donor, seam or art tolerances. Emitted transforms
always use scale 1.

From the repository root:

```powershell
node tools\character-pose-process\target-binding-cli.mjs inspect --request patient01-right-walk-1-unbound-request-v3.json --output unused.json
node tools\character-pose-process\target-binding-cli.mjs resolve --request synthetic-right-walk-1-request-v3.json --output phase01-resolved-copy.json
node tools\character-pose-process\target-binding-cli.mjs emit --request synthetic-right-walk-1-request-v3.json --output phase01-graph-copy.json
node --test tools\character-pose-process\target-binding.test.mjs
```

The CLI reads requests and writes exclusive JSON only inside
`pose-process-proof-v1/binding-v1/`. Unknown or duplicate flags, extra
positionals, linked paths, output traversal and overwrites fail. The saved
phase 01/03 outputs are unexecuted procedural graph proposals; no Cortan call is
part of this tool.

## Binding v2 coverage

`target-binding-v2-build.mjs` uses the existing GS-012 `compileRecipeFile` API
and its actual code fingerprint to compile three explicitly synthetic numeric
fixtures: baseline, a different limb ratio, and a separate registration change
covering scale plus source axis/floor. Their lineage points to hashed numeric
definition JSON and never claims measured patient anatomy.

`target-binding-v2-generate.mjs` saves 48 unexecuted graph proposals: three
fixtures, east and west, and all eight phases. These files are saved local
evidence; they are not checked in or executed. Each fixture uses one identical
eight-piece kit throughout both lateral cycles: both anatomical sides of upper
arm, forearm, thigh and shin. The target determines far/near groups. Head, torso,
hands, feet, image sources, private donors and north/south graph emission remain
unsupported.

Output prefixes include fixture, view and phase. All transforms use scale 1 and
one `floor(value+0.5)` placement quantization. The endpoint bound is compiler
pipeline rounding evidence, `sqrt(2)*0.0001/scale + sqrt(2)*0.0001`; the rounded
native scalar residual is checked independently against `0.00005`. Neither is
an art or seam tolerance.

```powershell
node tools\character-pose-process\target-binding-v2-build.mjs
node tools\character-pose-process\target-binding-v2-generate.mjs
node --test tools\character-pose-process\target-binding-v2.test.mjs
node tools\character-pose-process\target-binding-v2-validate.mjs
node tools\character-pose-process\target-binding-v2-validate.mjs --seal
```

The validator is read-only by default. `--seal` exclusively creates the
versioned final report and checksum evidence and refuses an existing output.
Every schema, test-entry, tool and evidence path is checked against the full
repository route before it is read or written.
