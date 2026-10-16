# Character artwork to shared walking templates

Updated: 2026-09-10. GS-012 MOV-005 / M6.
Contract ID: `shared-character-walk-v1`, version 1. GS-010 agreed the architecture,
phase/reflection mapping, ownership, pilot sequence and numeric conventions below.
The complete version 1 contract is confirmed. No new raster or runtime implementation.

## Architecture

Use the same anatomical motion cycle to author every character. Fit that cycle
to the character's own body and clothing, then export complete sprite frames.
The authoring process can use a body rig and separate clothing/body pieces; the
game continues to display a finished person for each pose. Patient 01's numeric
fit is the worked example, not a universal body shape or runtime skeleton.

The appearance ID selects the character artwork. Direction selects the view.
Shared walking phase selects one of eight frames. Founders, employees, patients
and sidewalk passersby obey that same contract. Patient appearance IDs remain
separate from the random encounter names already used by the game.

## Shared motion and phase identity

Map north = back, south = front, east = right, west = left. Limb labels are
anatomical right/left, not screen right/left. All four views retain the same
phase meaning and order, looping from 08 to 01.

| Phase | Existing reference ID | Required action |
| --- | --- | --- |
| 01 | `right-stride` | Right leg and left arm forward. |
| 02 | `toward-right-passing` | Transition toward right support. |
| 03 | `right-support-passing` | Right leg straight and grounded; left knee bent passing; arms down. |
| 04 | `toward-left-stride` | Transition toward left stride. |
| 05 | `left-stride` | Left leg and right arm forward. |
| 06 | `toward-left-passing` | Transition toward left support. |
| 07 | `left-support-passing` | Left leg straight and grounded; right knee bent passing; arms down. |
| 08 | `toward-right-stride` | Transition back toward right stride. |

`phaseId` is the two-digit authoring ID; `phaseIndex` is its integer 1–8.
Preserve GS-010 inventory keys, for example
`mixed-20260910-patient-01:right-walk-1`: `{templateId}:{view}-walk-{phaseIndex}`.
Seated keys remain `{templateId}:seated-{front|left|right}` and patient exam
`{templateId}:exam-table`. These authoring IDs are not current renderer keys.

The normalized cycle position for phase p is `(p - 1) / 8`: 0, 0.125, 0.25,
0.375, 0.5, 0.625, 0.75, 0.875. Each frame holds for 1/8 of a cycle, and phase
08 wraps to 01 at 1. Both accepted fitted previews use 180 ms per frame, a
1,440 ms review loop. Use that cadence for comparable art-review animations;
it is not a new game-speed setting. Later runtime integration must explicitly
choose one common cycle duration and compare it with travel speed rather than
reuse the old two/four-frame beat interval for eight frames. A pause holds the
same normalized position and frame.

These are eight distinct poses per view: 32 walking frames per character.
Standing idle is separate from either passing pose. North/south use fore/aft
stepping and foreshortening with stable body center and foot lanes. The accepted
reference does not require lateral body sway or sideways leg spreading.

Reference sources are [the lateral fit](patient-01-fit.json) and
[the north/south fit](patient-01-north-south-fit.json), with their existing
immutable previews. Preserve their published hashes. Their historical metadata
labels predate owner reference acceptance recorded in MOV-003/MOV-004; final
clothed raster appearance remains unaccepted.

- Lateral JSON SHA-256: `5e2ab5bcb5b390acb74fb45ef63b85e83df13ebaf2db102f32e38222700dd571`.
- North/south JSON SHA-256: `7523c59921ec730ec343265e422f8b5d2c8cec5cf442504ea1f52b92ac3e50b2`.
- Lateral preview SHA-256: `8b75bcb1b717b83d219b304ecdcb51627936cb22089107704da8b1447e330b24`.
- North/south preview SHA-256: `d1b45d2796e4070b1db405424ea1478853638e42be76bf47571fc0e5dd32378a`.

## Per-character fitting record

The following is an authoring handoff, not a new saved-game schema. It must
describe the actual selected sources and final artwork rather than inferred
completeness from filenames.

| Record | Required meaning |
| --- | --- |
| Identity and source | Stable visual-template ID, source view, source path/hash, dimensions, independent/reflected lineage and acceptance state. |
| Proportions | Observed head/torso/garment/shoe envelopes; estimated shoulder, hip and limb joints; fixed segment lengths; anatomical near/far identity; uncertainty for hidden anatomy. |
| Registration | Target frame size, body ground origin, source axis/floor, one fixed isotropic scale and translation per view, units and rounding. |
| Pose geometry | Reference version/hash, phase 01–08, joints/pivots, support foot and contact, passing-foot lift, intentional body bob, occlusion order and projected ground. |
| Source pieces | Donor/crop identity and hash, pivot in crop coordinates, mask/overlap policy, reconstructed hidden surfaces and permitted rigid transforms. |
| Export | One selected frame per direction/phase, output hash, frame/cell reference, reflection permutation if used, dimensions/alpha/bounds and review state. |

Measure each approved character before fitting it. Transfer phase semantics and
relative motion to those proportions while retaining segment lengths in the
correct anatomy space: lateral 2D for the side reference, latent 3D for the
north/south reference. Projected 2D lengths may foreshorten; declared local
projection transforms differ from arbitrary full-body or per-pose scaling. Support
feet stay on their authored ground; bent passing legs must remain reachable and
bend forward. Resolve a reach or clothing conflict in the fitting definition
before exporting the cycle. Do not stretch a limb or rescale each pose to fit
its current bounding box.

Preserve head/face, hair, outfit, palette, shoe shape and body width. A long coat
needs its own overlap/hem treatment so walking legs and swinging arms remain
readable. Source images often hide a far arm or covered torso; newly created
hidden surfaces must be explicitly recorded and reviewed. They cannot be
recovered faithfully by cutting visible pixels alone.

Patient 01's approved reference uses 128 by 192 cells with body origin (64,181).
Its lateral fit has scale 171/893 and source axes east 228 / west 232; its
north/south fit uses 171/898 and axes south 238 / north 238.5. Source floor edge
is 941 in both. These are Patient 01's measured registrations, not batch-wide
constants. Keep every frame in a view registered together, then check size
continuity while turning. North/south sole contact Y may differ with projected
depth; body origin (64,181) does not force every sole to the same image row.

### Coordinate and raster conventions

Image coordinates are continuous distances in pixels from the top-left canvas
edge, with X rightward and Y downward. Pixel column/row `(i,j)` occupies
`[i,i+1) × [j,j+1)` and has center `(i+0.5,j+0.5)`. Alpha bounding boxes are
min-inclusive/max-exclusive edges. The reference's inferred joint points are
continuous authoring coordinates, not indices of required opaque pixel centers.
Keep the published floating coordinates; do not add a blanket half-pixel shift.

Use the reference's fixed registration and inverse:
`frameX = 64 + (masterX - sourceAxisX) * scale`,
`frameY = 181 + (masterY - 941) * scale`; solve these equations in reverse for
native-master coordinates. Native pixels, frame pixels and latent authoring
units remain separately labeled. Any padded donor canvas must record its offset
from the original source before applying this transform.

Keep joints and transforms continuous until the export operation actually needs
an integer placement. For the shared target-space convention use nearest-integer
rounding `floor(value + 0.5)` (ties toward positive infinity), once at that
placement boundary. Record any different source-tool sampling or rebase rule;
never silently alternate rounding policies. A single nearest-integer placement
can differ from its ideal by at most 0.5 target pixel on each axis. This is a
quantization allowance only, not permission for anatomy/sole drift, successive
rounding accumulation or changing scale. Native-rounding errors must be converted
through the declared scale before comparison in frame pixels.

Continuous reflection about frame X=64 is `x' = 128 - x`; the corresponding
discrete image reflection maps column `i` to `127 - i`. Use the actual image
width for a different canvas. Keep this coordinate rule separate from the
anatomical phase permutation.

Raster shoes target **geometric** sole/contact coordinates. Lateral targets are
`joints.{left|right}.shoeContact/shoeHeel/shoeToe`; north/south targets are
`joints.{left|right}.contact/heel/toe`, relative to that foot's `projectedGround`
and lift. North/south `renderContact/renderHeel/renderToe` are preview-only
stroke-inset centers and must not position raster soles. Hand/shoe silhouettes
must keep their source shapes; vector line-cap widths are not raster bounds.
Projected walking soles may lie below frame Y=181 while remaining valid in the
128 by 192 canvas. Maintain transparent perimeter and inspect bounds; do not
crop valid depth motion to force the old idle max-opaque-row 180 rule.

Observed/estimated source confidence is separate from acceptance tolerance.
Strict shared rules are phase/support identity, fixed registration and anatomy
space, correct direction and complete unclipped frames. Record actual landmark,
contact and seam deviations in native and frame units in the pilot. Donor-specific
art-fitting allowances remain unset until the representative pixels are inspected
and both tasks agree them; an uncertainty range or arbitrary percentage cannot
automatically pass the art. This pending measurement does not prevent preparing
the representative proof, whose purpose includes settling those tolerances.

### Existing numeric fields to consume

Select the reference phase with array index `phaseIndex - 1`, then use:

| View | Frame targets | Native targets | Anatomy lengths and ordering |
| --- | --- | --- | --- |
| East/right | Lateral `phase.east` | `phase.east.nativeMaster` | `rig.segmentLengths` / `nativeSegmentLengths`; view `renderingOrder` |
| West/left | Lateral `phase.west` | `phase.west.nativeMaster` | Same declared lateral anatomy; view `renderingOrder` |
| South/front | North/south `phase.south.frame` | `phase.south.nativeMaster` | `rig.segmentLengths3D` and `phase.south.latent`; `phase.south.visibility` |
| North/back | North/south `phase.north.frame` | `phase.north.nativeMaster` | `rig.segmentLengths3D` and `phase.north.latent`; `phase.north.visibility` |

The lateral view records `joints`, `headEnvelope`, `torso`, `phaseBob`, near/far
identity and the native equivalents. Its `observedSilhouette` and
`inferredAnatomy` distinguish measurements, estimates, rest landmarks and lengths.
North/south frame/native blocks record `body`, `joints`, ground/lift and projected
bob; `observedSilhouette`, `inferredFit`, `rig.body` and `rig.latentCoordinateSystem`
provide the source/latent context. Use the explicit units on scalar fields.
The accepted Patient 01 projection is vertical 0.88 / depth 0.22; it is authored
stylization, not a calibrated camera or a measured PNG body depth.

Keep Patient 01's independent left/right masters. For characters with a declared
approved reflected view, a plain raster flip swaps anatomical near/far identity;
use the existing half-cycle permutation 01↔05, 02↔06, 03↔07, 04↔08. Reflecting
labeled numeric joints instead preserves the phase and requires near/far layer
reordering. Do not add a second runtime flip to an already exported view.

## Representative proof and expansion

Agreed GS-010 sequence: validate its numeric compositor mechanics, then fit
Patient 01 right/east stride 01 and passing 03 using the approved head and
character-specific torso/limb pieces. Review both at source and map scale for
identity, opposing arms, planted support, knee bend, seams, clipping and stable
registration. The two poses test the widest stride and bent-knee construction.

The five donor preparation pieces become torso + approved head + twelve
articulated limb pieces: upper arm/forearm/hand and thigh/shin/shoe on each side.
They are not five rigid final layers. GS-010 measures donor-local pivots, rest
vectors, crops, overlap corridors and bounds only after those donor pixels exist,
then records target endpoints, transforms and layering. Coats may add garment
pieces or masks. Its installed compositor's actual pivot, clockwise rotation,
fixed-canvas, alpha, clipping and rebase behavior remain subject to the rectangle
proof. The donor and that proof do not exist yet.

The pilot handoff contains provenance, segment mappings/transforms, target-joint
overlays, native alpha-composited views and 128 by 192 proofs. GS-012 reviews
motion/geometry with GS-010 before extending the construction method.

Once these work, review a full eight-frame loop, then all four directions and
turning consistency. Fit Patient 02's long coat and the two employee uniforms
separately before broader roster expansion. Inspect a contact sheet and an
animation; distinct file hashes alone do not prove useful distinct poses.

GS-010's current new-character inventory is 128 walk frames (four characters ×
four directions × eight poses), 12 seated and two patient exam poses, in addition
to the delivered idle/UI foundation. These counts describe required assets;
they do not claim final frames exist. The four-character batch does not update
the existing founder/patient/generic roster by itself.

## Runtime handoff and acceptance

Astra reviewed the current source after Terra's bounded read-only audit:

- `characterArt.ts` has only `walk-a`, `walk-neutral` and `walk-b` moving poses.
  `lateralGaitCycle.ts` selects four side beats and two front/back beats.
- `characterBitmapArt.ts` resolves founder v4, authored patient v1 and generic
  v3 through different paths. Founder/patient cells are 128 by 192, floor 181;
  generic staff/civilians use 160 by 240, floor 220. The current generic walk
  assets are left A/B with runtime mirroring, including for vertical movement.
- The current authored-patient selector recognizes 50 existing catalog IDs;
  the new review IDs and authored employees require an explicit catalog/asset
  mapping. Do not equate a patient name with an atlas cell or force new IDs into
  that fixed range. Existing manifest mirror history is provenance; selected
  final export metadata must state exactly which views are already reflected.

Later runtime work must add the eight-phase selector and exact direction/frame
mapping together with complete assets. Preserve cycle duration independently
of frame count, stable per-actor phase offsets and direction-change semantics.
Every actor family must select its correct identity and view in all eight
phases, with no idle frame substituted for a walking pass. Define and validate
complete fallback coverage as well as authored characters.

Retain MOV-004: any pause freezes the displayed anchor, facing, exact selected
frame/flip and representation; resuming cannot consume paused elapsed time.
Floor arrival is south/front idle; chair/bed poses begin only after logical and
visible arrival. Use the focused presentation/arrival tests for that future
integration and add phase, asset-completeness and per-family mapping checks.
Animated in-game review at the canonical owner origin remains a separate step.

GS-012 owns common motion, fitting review, this contract and later coordinated
selector/renderer integration. GS-010 owns character art, donor surfaces, masks,
processing, fitting evidence for its output pieces, packages and atlas
production. Coordinate exact shared source ownership before integration, with
one runtime writer. No source-art processing is initiated by this document;
GS-010 handles its existing pending production approval in its own task.

## Review state

Terra `mapping_contract_audit` completed the read-only contract audit. Astra
inspected the actual selector, resolver/types, registrations, phase IDs,
reflection data and the two preview clocks. GS-010 confirmed agreement through
two native task replies and recorded its side in
[the art authoring contract](../../execplans/create-mixed-character-walk-seated-exam-poses.md#shared-walking-authoring-contract).
Its requested clarifications are incorporated here. GS-010 explicitly confirmed
the numeric addendum with no conflict and no further design confirmation needed
for version 1. It reported independent verification of all four pinned hashes,
both clocks and all 32 view/phase field lookups. Astra separately confirmed the
four reference hashes and matching eight-phase identities. No game source, art,
save, build or browser state changed in M6. The four M5 source/test hashes remain
unchanged. Donor-specific fitting allowances will be settled from the pilot;
the version 1 authoring handoff is complete and local/uncommitted.
