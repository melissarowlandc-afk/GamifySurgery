# North/south appearance projection: proof contract

Updated: 2026-09-10. GS-012 MOV-006 / M7.
Status: N1 v7 preparation and N2/N3 actual synthetic rendering proof accepted
for the declared fixture. Character artwork and production acceptance remain pending.
The accepted motion templates and completed lateral binding remain unchanged.

## Proposed approach

Test one fixed appearance piece per anatomical segment and source view, with
its visible length driven by the accepted projected joint endpoints. This can
reuse the character's prepared artwork across the eight phases. It is an
approximation for projected appearance, not a reconstruction of a volumetric
body or of hidden clothing surfaces.

Use prepared projected variants if a bounded compositor proof cannot reproduce
this mapping, or if the later artwork pilot shows unacceptable distortion.
Do not prepare separate repainted frames merely to make the numeric proof pass.

## Continuous mapping contract

For each source piece, record its immutable source/crop/mask provenance, two
measured source-local joint anchors a0 and a1, width, pivot and overlap rules.
Its rest length L0 is the distance between those anchors; its along-axis unit
vector is u0 = (a1-a0)/L0. The cross-axis vector is v0 = (-u0.y, u0.x).
Calibrate the source against its character/view fit once; do not change these
declarations by phase. Front and back use their explicitly declared artwork.

Select the exact pinned target by character, cardinal/asset view and phase.
Read native projected endpoints P0 and P1 from its permitted anatomical paths.
Let L = distance(P0,P1), u1 = (P1-P0)/L and v1 = (-u1.y,u1.x). For a local source
point q, the intended continuous mapping is:

```text
T(q) = P0
     + u1 * dot(q-a0, u0) * (L/L0)
     + v1 * dot(q-a0, v0) * s_perp
```

Start with s_perp = 1. A different width calibration must be fixed per approved
piece/view and separately justified; it is not a per-phase fitting control.
The declared source pivot p maps to T(p), which equals P0 only when p = a0.
Use positive scales and explicit source orientation, never an implicit flip.
Reject zero spans and incompatible or missing fit/source declarations.

The target's latent-3D anatomy, projected native points and registration define
the intended motion and remain authoritative. The ratio L/L0 is derived, never
a free artistic parameter. A source pose may already be foreshortened, so the
ratio is not automatically restricted to values below one. It must follow the
calibrated source and accepted target, with observed visual limits recorded.

## Installed-operation boundary

The captured schema exposes integer image/layer dimensions and rotation. It
does not establish resize order, pivot behavior, alpha treatment or sampling.
No arbitrary affine-matrix operation has been proved.

Image-axis resizing followed by rotation can implement this mapping directly
when the source kit has a declared canonical rest axis along an image axis.
A tilted source rest axis requires a proved basis transform or one reviewed
source normalization step. Resizing the raw image axes of a tilted limb is
not equivalent to scaling along that limb. Preserve original artwork and
record the preparation transform and any new sampling.

First compare the candidate operation's desired continuous transform with its
actual integer dimension parameters. Recompute pivot compensation using those
actual parameters, then apply the existing single nearest-integer placement
rule. Report dimension quantization and placement error separately. Derive
their bounds from source dimensions, anchors and the selected transform; do not
reuse the lateral rounding allowance or invent a visual acceptance tolerance.
Measure interpolation, alpha and seam behavior from actual synthetic pixels.

## Agreed N1 quantization and operation proposal

GS-010 and GS-012 agreed to anchor the realizable resize map at the proximal
joint. The candidate kit has separate front/back definitions for both sides of
upper arm, forearm, thigh and shin: 16 immutable sources. Use native heights
H0=192, anchors a0=(W0/2,16), a1=(W0/2,176), rest length L0=160, and deliberately
off-anchor pivot p=(W0/2+3,31). Candidate widths are 28, 24, 34 and 30 respectively.
These are procedural fixture dimensions, not character measurements.

For each selected target, compute Hq=floor(H0*L/L0+0.5) and sy=Hq/H0. Let R
rotate source +Y onto (P1-P0)/L. Keep the ideal map above as the reference, but
the declared map using actual integer dimensions is:

```text
T_actual(q) = P0 + R * diag(1, sy) * (q-a0)
```

This preserves T_actual(a0)=P0 before final placement rounding. Compensate the
resized source's actual canvas center using T_actual(p); do not pin T_ideal(p)
and consequently displace the articulation joint. Record signed pivot error
T_actual(p)-T_ideal(p) and distal error T_actual(a1)-P1, plus the separate final
placement error. For this fixture the analytic dimension-rounding bounds are
abs(sy-L/L0)<=1/384, distal error magnitude<=5/12 native pixels and pivot error
magnitude<=5/128 native pixels. These precede sampling and final placement;
they are neither pixel acceptance tolerances nor a proved sampler convention.

The proposed installed chain is explicit ImageScale with nearest-exact sampling,
width W0, height Hq and cropping disabled, followed by native-size AddLayer
(width=height=0) with rotation and placement. N2/N3 now establish its measured
behavior for this binary-alpha fixture, as recorded below. Keep image, alpha
and mask dimensions and transforms aligned;
do not attach an original-size mask to a resized piece without a proved matching
operation. Keep the existing M1/B1 contracts and gates unchanged.

N1 has 16 baseline phase canvases, one genuinely changed north/south registration
case and one mechanics/control canvas: 18 fixed 448x1024 canvases, 36 proposed
image/mask outputs. The existing B1 registration fixture changed only lateral
registration. Compile a new synthetic N/S fixture through the existing compiler;
verify actual N/S registration and geometry differ, not merely artifact identity.

Targets specify separate arm and leg orders but no cross-class ordering. For
this synthetic proof only, declare and pin: far-leg, far-arm, fixed test torso
plate, near-leg, near-arm. Resolve each class from its target visibility array;
reject missing or inconsistent arrays. This policy tests declared order changes
and does not accept production garment or body occlusion.

## Minimum proof before character use

- One asymmetric, nonsquare transparent source with a noncentral pivot and
  markers along and across its rest axis. Cover the smallest and largest
  projected spans and a nonzero rotation; verify anchors, width and pivot.
- The same sources through all eight north and all eight south phases, with
  immutable source/anchor/width declarations and per-phase transform receipts.
- Overlapping arms and legs following the target's separate far-to-near
  visibility arrays, including their order changes in both views. Establish
  their relation to torso and garment layers explicitly.
- A changed registration fixture, fixed native canvas, clipping controls and
  alpha/mask checks. Keep numeric, sampler and visual observations distinct.

Begin with the four supported arm/leg segment types. This does not qualify
hands, shoes, head, torso, coats, chairs or beds. They retain their own shape,
attachment and occlusion requirements. Complete clothed loops and all four
pilot outfits still require review and measurements of setup/correction effort.

GS-012 owns the numeric contract and motion review. GS-010 owns the proposed
compositor extension, synthetic operation proof and eventual source preparation.
Add a separate declared projection strategy; preserve lateral scale-one checks
and keep north/south emission gated until the new proof passes. No private-art
processing authorization follows from this planning document.

## Frozen N1 implementation checkpoint

GS-010 implemented this contract as a separate local projection strategy.
Terra accepted its source semantics, and Astra independently checked package
hashes, the saved test receipt and all 136 target mappings in the actual graph.
N1 v7 has the agreed 18 canvases and 36 outputs. Its controls include isolated
zero-rotation resizes to heights 116 and 194, in addition to the no-resize,
rotated, off-center and signed-clipping cases. All baseline depth groups have
positive primitive overlap with the fixed test plate at (90,300), size 300x400.
Reported clipped primitive areas are sums, not union areas or pixel counts.

The graph and exact selected evidence pins are recorded in the
[execution plan](../../execplans/character-movement.md). N1 remains frozen.
Source alpha is binary, so the result cannot automatically establish partially
transparent donor behavior. Keep actual pixel observations separate from the
analytic bounds above.

## Accepted N2/N3 synthetic rendering observations

GS-010's single procedural render of the exact N1 graph produced all 36 declared
448x1024 outputs. Its parent decoded those originals and reviewed native boards,
analytical overlays and eight ordered, distinct phases in each directional GIF.
Terra reviewed the analyzer math; Astra matched saved execution and output records
to the frozen graph and verified the text/code evidence pins. GS-012 did not
independently inspect image bytes. The final parent receipt, exact pins and
measured values are in the execution plan.

The isolated controls support the nearest-exact row rule
`floor((destinationY+0.5)*sourceHeight/destinationHeight)` for this fixed-width
kit, with zero alpha/hidden-RGB mismatches in 14,756 comparisons. Rotation
predictions use the discretely resized source's alpha-weighted pixel-center
moments, actual image center and quantized placement. Centroid component
residuals are below 0.000487 pixels. The clipped control is excluded from
full-source centroid comparison. The N3 axis residual is actual minus expected,
with angle measured from down toward positive x; its sign is opposite the
earlier parent angle convention and the residual magnitudes agree.

Sixty-eight opaque interior samples support the four named depth relations
across all 16 baseline phases plus the changed registration case. Opaque RGB
differs from requested values by up to one channel level even without resize;
the responsible stage is unisolated and rotated rounding differs. No constant
color correction follows. Grayscale masks invert alpha within one quantization
level, not exactly. Rotations introduce fractional alpha; no cleanup is qualified.

These are fixture observations. They qualify neither fractional-alpha source
donors nor hands, shoes, garments, hidden anatomy, seams or production art
tolerances. The next proof uses actual prepared character pieces and complete
clothed cycles under GS-010's existing processing approval condition. No further
synthetic implementation or render is requested at this checkpoint.
