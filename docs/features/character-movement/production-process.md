# Repeatable character fitting and batch production

Updated: 2026-09-11. GS-012 MOV-006 / M7.

Owner clarification, 2026-09-12: every design in both `Photos for Codex 2/Patients
or Staff or Other Characters` and `Photos for Codex 2/Founders` is approved, plus
the secretary, nurse and two additional patients created in this task. This
supersedes uncertainty about design approval. Identity/role indexing exceptions
remain indexing work, not a request to reapprove the designs. The owner approved
the reauthored-layer process for TWO motion examples before broader conversion
or game integration. Use olive jacket and gray overshirt as the comparison pilot.
Prior v2 mapping remains rejected despite technical checks.
Status: owner rejected the first two retained walking candidates; a revised
connected-limb candidate is delivered for visual review, with technical checks passed.
Not yet qualified for expanding the roster. This implements the owner's process-first direction
using [shared-character-walk-v1](character-template-mapping.md).

Owner clarification (2026-09-11): preserve and map the entire existing approved
roster, estimated by the owner at roughly 55 characters. The four-character
sample below is a pilot, not the limit of the migration. The requested preview
must show actual approved identities. The illustrative Jacket/Scrubs example
demonstrates motion only and does not fulfill that actual-art proof. Keep each
approved face, hair, outfit and body shape; fit the shared motion to its measured
body/profile rather than replacing it with the Patient 01 shape. Verify unique
identity counts before defining remaining batches; revisions and frame cells
are not additional characters.

Roster audit: the 55 private reference PNGs have unique hashes. Exactly 50
match `patients-v1` manifest `sourceSha256` fields, covering all 50 patient IDs.
The retained olive-jacket and gray-overshirt examples are `patient.adult.033`
and `patient.adult.032`. Five remaining files have no patient hash match;
one is the documented style guide. Preserve these as explicit role/identity
exceptions, not invented extra patient IDs. The 30 founder IDs are a separate
source family, including 10 nonhuman silhouettes requiring separate fit review.
The reproducible local preservation register is
`artifacts/character-movement/retained-roster/retained-roster.json`; verify with
`node tools/character-mapping/retained-roster/build-retained-roster.mjs --validate`.
It records pending members and pins the actual two-character all-direction
candidate: 32 walking frames plus South standing and sitting per identity.
The owner rejected their chunky and cut-off limbs in all directions. Prior
parent visual acceptance was premature; the register now marks both as
`repair_required` / `user_rejected`. Their rendered counts are evidence of an
attempt, not readiness. Structural source-piece/deformation repair must pass
actual animation review before extending the batch.
The replacement lives at `artifacts/character-movement/retained-mesh-spike/all-directions-v2/`
and is embedded in the existing inline preview. Both retained identities have
64 corrected walks in total; original standing/sitting and source hashes are
preserved. Root-reviewed checks reject detached components >4 opaque pixels and
wrong terminal attachment pairs. Gray E07/W02 each have one reported isolated
pixel. This revised evidence does not overwrite the owner's prior rejection or
qualify the remaining roster without visual review.
The four newer approved private foundation designs do not automatically stand
in for the owner's existing roster in the requested two-character preview.

Current execution status: owner-directed consolidation assigns all retained
character preparation, mapping and review to GS-012. GS-010 is on production
hold until retained-roster coverage is accepted. Preserve its four-character
work and outstanding Cortan receipt; they do not gate this local mapping proof.
Earlier approval-block and split-ownership notes below are historical.
Actual walking and varied-outfit process qualification remain outstanding;
GitHub backup is not required to continue.

## Fit once, reuse across poses

Keep three separate reusable inputs: the common motion template, a character's
proportion/registration recipe, and its measured artwork pieces. The template
defines the eight phases and their anatomy. The recipe fits them to the body.
The artwork pieces provide the approved face, hair, clothing, hands and shoes.
Compile pose targets and apply the recorded piece mapping for the whole cycle.
Avoid independently inventing each walking frame or repeatedly measuring the
same character for each pose.

The rejected retained pilot exposed a specific preparation failure: separate
hard-clipped limb segments with enlarged circular texture caps produce chunky
knees/elbows and clipped cuffs. The replacement candidate uses one connected
textured surface across each two-bone limb, with measured width stations and
shared joint edges. Whole hands and shoes attach beneath the actual cuffs.
Each terminal records corresponding source and target attachment pairs; mapping
a source forearm pair onto a target hand pair is an error, not an artistic fit.
Both legs overlap beneath the torso hem. Source masks must remove background
and unrelated neighboring artwork before deformation. Prepare covered garment
surfaces once per view, then reuse them through all phases.

Review the isolated donors and the complete character. Check wrists, ankles,
hips and shoulders as well as elbows/knees, at native resolution and map scale.
Triangle continuity, endpoint accuracy and alpha-component counts help locate
defects; they do not establish smooth-looking motion or visual acceptance.

Characters with compatible proportions may share a calibrated fit profile,
but membership requires actual measurements and silhouette review. Similar
clothes or a matching name do not establish the same body geometry. Record
explicit overrides for body, garment and view differences. Reuse a confirmed
profile rather than introducing another body shape without a production need.

## Production stages and evidence

| Stage | Concrete input/output | Advancement requirement |
| --- | --- | --- |
| Intake | Stable visual ID, approved directional sources/hashes, required pose inventory, fit classification | All required views and identity provenance present; missing views remain explicit. |
| Fit | Character recipe with observed/estimated measurements, anatomical lengths, silhouette envelopes, registration and garment coverage | Numeric reachability, support, phase, units, projection and bounds checks pass. |
| Prepare pieces | Approved head plus torso/limb/garment donors, measured crops/pivots/rest vectors and occlusion rules | Native pixels and hidden-surface reconstructions reviewed; actual compositor mechanics proved. |
| Representative mapping | Stride 01 and passing 03 with target overlays and native/map proofs | Correct identity, silhouette, opposing limbs, planted support, bent knee, seams and shoes; measured deviations reviewed. |
| Full cycle | All eight phases, contact sheet, review animation and all four directions | Distinct poses, 08→01 closure, stable scale/grounding and coherent turning; no pose-by-pose repair masquerading as reusable mapping. |
| Batch acceptance | Complete manifest, per-character review evidence, export hashes and measurements of effort | Every required asset accounted for, failed members held, unchanged inputs reproducible and shared process issues resolved. |

Numeric target completion never means artwork completion. Raster technical QA
never substitutes for identity/silhouette/motion review. Neither status means
the game has loaded the new assets. Runtime integration is a later explicitly
coordinated step and preserves the pause/floor/chair/bed behavior from MOV-004.

## Existing characters: adapt or selectively rebuild

Start with the approved designs and keep immutable originals. Test whether the
body can follow the template while retaining its head scale, limb lengths,
clothing and shoe shape. Reuse sound directional artwork. Reconstruct only
occluded surfaces or unsuitable pieces where needed, with explicit provenance.

| Observation from the proof | Action |
| --- | --- |
| Existing silhouette and pieces fit with stable transforms | Keep the design and use its recipe for all poses. |
| Far arm, covered torso, inner limb or independent shoe is missing | Prepare and review the missing donor surface once; keep the rest. |
| Coat or garment crosses multiple joints | Add garment pieces or masks and test their overlap through the cycle. |
| Repeated seams or silhouette failures require independent repainting of most phases | Revise the source/piece construction into a rig-ready version of the same identity, then rerun the proof. |
| A source view is incorrectly oriented or inconsistent with the approved identity | Hold that view and make an explicitly reviewed replacement; preserve the rejected source. |

Do not decide to remake the entire existing roster from numeric output alone.
Compare the actual conversion effort and visual result against a representative
source rebuild. A broad remake is justified only by repeatable evidence of a
structural problem; it is not a cleanup of old files or a change of character
identity. Current legacy atlas families remain separate migration batches.

The consolidated owner-facing proof starts with two retained reference designs,
identified alongside their originals. The newer four-character/142-pose package
remains useful prior work, not a substitute for this roster. The walking mapping
proof does not automatically qualify the distinct seated/exam pipeline.

## Batch operation, caching and selective redo

Use an explicit manifest of stable IDs and recipe versions. Begin with the
two-character proof; expand across the retained roster only after
the representative method passes. Subsequent batch size follows measured
review capacity and correction rates. Hundreds of characters are a scale target,
not one unchecked production request.

Each output must identify its source, fit, motion and compiler dependencies by
hash. Keep versions immutable. Reuse an output only after its bytes and current
dependencies match. A changed fit invalidates its dependent targets; a changed
donor invalidates dependent composites; a changed common motion/compiler can
invalidate all affected members. Rebuild affected members without modifying
accepted originals or unrelated batches. Resuming an interrupted batch must
verify existing output rather than trusting that a filename exists.

Missing measurements are a separate `pending_measurement` result. Failed geometry
does not trigger an invented replacement measurement. Failed art remains held
with its reason and evidence. Never advance a whole batch merely because its
successful members passed. Preserve partial valid work and report remaining
members explicitly.

## What makes the method ready to scale

Record measured results for each pilot and batch:

- Source/measurement setup time and actual human intervention, distinguished
  from unattended processing and tool elapsed time.
- Number of generation jobs, deterministic composites, corrections and failed
  attempts; identify which pieces/recipes were reused without alteration.
- Time to add the next character and to redo a changed character or phase.
- Automated failures, visual defects and their root cause: recipe, donor,
  compositor, registration or runtime mapping.
- Final accepted frame counts and remaining holds. Unknown cost/time fields
  remain unknown rather than defaulting to zero.

The process qualifies for additional designs after the full intended retained
roster has an explicit coverage/exception record, required poses pass review,
exceptions are resolved, repeat/export and selective redo work, and the owner
accepts coverage and conversion effort. Two successful examples do not prove
all designs compatible. A synthetic hundreds-entry tool
benchmark proves only numeric processing capacity. It cannot establish art
quality, production cost or manual scalability.

For subsequent designs, GS-010 should supply approved directional masters and
rig-ready separable surfaces consistent with the qualified body/garment profiles.
New design variations that break those profiles get a small compatibility proof
before joining a batch. Keep the recognizable design; make source preparation
predictable.

## North/south projection is a separate production requirement

One rigid flat limb piece cannot cover every north/south pose. The shared rig
keeps anatomical lengths fixed in latent 3D, while the projected 2D lengths
change as limbs move toward/away from the camera. For the accepted Patient 01
targets, the native projected forearm spans approximately 96.95 to 146.13 pixels
through the cycle. This expected foreshortening is much larger than numerical
rounding and must not be concealed by loosening a rigid-length check.

The current GS-010 translate/rotate-only adapter proves lateral mechanics. A
north/south binding must explicitly identify its projection strategy for each
limb/view/phase: a calibrated projection/deformation method tied to the fixed
latent rig, or reviewed prepared projected variants with explicit coverage and
reuse. Prove any chosen compositor operation before using it on character art.
Head and torso can retain their existing rigid envelope/bob rules.

Prefer a reusable, calibrated appearance kit if the projection proof supports
it. If variants are necessary, record how many are needed and how much work
they require; a pile of independent phase repairs does not demonstrate an
efficient reusable process. The full north/south loop and varied-outfit trials
must pass before the method qualifies for roster expansion. A lateral-only
proof is insufficient. The compiler's numeric publication/length allowances
remain separate from artwork fit tolerances and projection strategy.

GS-010 confirmed this limitation. The later lateral binding must also account
for the compiler's two four-decimal frame rounding stages and final native
endpoint rounding. For the pinned implementation, the agreed conservative
length-error bound is `sqrt(2)*0.0001/scale + sqrt(2)*0.0001` in native pixels,
plus at most `0.00005` when comparing to a rounded native length scalar. Bind
this policy to the compiler fingerprint and test changed proportions and
registrations. It is a numeric target-reading allowance, never a donor seam,
silhouette or north/south foreshortening allowance.

The separate N/S proof uses deterministic per-segment appearance projection.
Keep each source's anchors and width fixed, and derive its along-limb mapping
from the accepted native endpoints. See the
[north/south projection proposal](north-south-projection-proposal.md) for the
source-basis equation, pivot handling, integer resize boundary and required
synthetic controls. N1 v7 local preparation is accepted: all eight north and
eight south phases reuse 16 fixed sources, with actual resized transforms and
separate dimension/placement errors. The saved package has 18 canvases and
36 outputs including registration and isolated mechanics controls. Terra
reviewed semantics; Astra checked all 71 text/code hashes, the 10-pass test
receipt and all 136 target mappings in the saved graph independently.
The subsequent N2 render and N3 analysis passed their bounded synthetic review.
GS-010 independently checked all 36 original PNGs and visual boards; Terra
reviewed the analyzer math and Astra verified the execution/graph/output records.
The fixture supports nearest-exact resize, actual-center rotation, signed
fixed-canvas clipping, registration and the declared depth relations. Pure-control
alpha matches its discrete prediction; RGB can drift by one channel level even
without resizing, masks invert within one level, and rotations create fractional
alpha. These observations do not define art tolerances or a color correction.
The binary-alpha fixture alone does not qualify partially transparent donors.
Clothed-character quality and manual effort remain pending, and the lateral
binder retains its separate scale-one contract. N1/N2/N3 are frozen; actual donor
mapping is the next proof rather than another synthetic implementation milestone.

## Ownership and current next action

GS-012 owns shared motion, numeric fitting/compiler checks, batch preflight and
motion review. GS-010 owns source/piece preparation, measured donor mapping,
compositing, visual-art evidence, asset packages and its existing processing
approval handling. Coordinate each shared file seam before integration.

Current work: Sol completed the offline fit-target compiler and hardening after
Terra's read-only preflight. Astra reviewed the actual source, independently ran
14 passing Node tests and 8,809 additional assertions, and verified all 32 Patient
01 targets exactly against the accepted references. Compile/check, selective
batches, repeated/resumed output reuse, invalid inputs, linked paths and changed
dependencies are checked. All 16 protected files stayed unchanged. A synthetic
300-recipe / 9,600-target run took 4.077 seconds; this measures numeric capacity
and does not measure character preparation or artwork throughput.

Use [the compiler README](../../../tools/character-mapping/README.md), the
[Patient 01 recipe](recipes/patient-01.json), and the
[first-four manifest](batches/first-existing-four.json). Run commands from the
repository root. The first batch reports one complete numeric fit and three
`pending_measurement` entries; it does not imply four mapped characters.
Independent evidence is
`artifacts/character-movement/mapping-pipeline/parent-review.json`.

GS-010 has received the owner's exact proceed/process-first instruction and
confirmed ownership of the actual representative raster proof.
Its art lead assessed the existing Patient 01 head/face/outfit as reusable;
hidden far arm/hand, covered torso and inner-leg/shoe surfaces need declared donor
reconstruction. No existing evidence justifies remaking a whole approved design.
The actual conversion effort and final decision still require the raster trial.

The boundary between tools is explicit: GS-012's compiler produces fitted target
joints, phase/view identity, fixed registration and layer/depth data. GS-010's
`tools/character-pose-process/` adapter binds actual measured pieces to those
targets and emits compositor nodes; it must not duplicate the gait solver.
Actual source/donor hashes are checked by that art pipeline. The numeric compiler
verifies its local reference dependencies but labels image hashes as declarations
because it does not read image files.

The executable target-to-piece binding layer now connects the two tools for
the accepted synthetic proofs. Bind by immutable artifact hash and exact
output key; resolve native joint paths rather than copying coordinates. Carry
cardinal and asset views, phase/timing, native canvas/registration, declared
reflection lineage and reconciled depth/layer order. Reject a mismatch before
compositing. A synthetic binding test is useful evidence; it cannot validate
unmeasured donor pivots or the final character silhouette.

GS-010 considered the new proceed instruction and reports that the existing
automatic rejection still requires its pending private-source/destination
approval before private character/donor processing at Cortan. It has not retried
that rejected operation and is not repeating the question. Its offline adapter
and a normally reviewed nonprivate procedural rectangle render have succeeded
under the safer-alternative provision. Passing that test cannot
authorize private-image processing or qualify mapped character art.

GS-010 reports actual synthetic compositor job
`bb0d4b1d-4921-4cf1-8fd2-50fd908ba5fe` completed with 1,084 ms execution and
71 ms observed download time. Its parent checked the fixed canvas, signed
clipping, positive/negative rotations, noncentral pivot and mask polarity;
observed centroid residuals were at most 0.0241 native pixels. These fixture
observations are not future artwork tolerances. Its evidence package is finished,
and the subsequent offline artifact-binding proof is accepted below. No private
image, model or upload was used in that synthetic render.

Terra verified the final validation/checksum-report hashes and reviewed their
numeric evidence; Astra read the final validation report. It records 25 true
checks, 11 passing tests and one job resumed after a protocol correction.
GS-012 did not independently inspect the PNGs. The fixture's alpha/mask inverse
is within one quantization level; do not turn it into an exact inversion rule,
sampler assumption or donor/art tolerance. Final evidence is under the GS-010
mixed batch's `pose-process-proof-v1/m2-run-001/`; exact report hashes are in the
GS-012 execution plan and handoff.

The corrected binding proof covers all eight phases in both side views for
three synthetic profiles, including different arm/leg ratios and independent
registration changes. Terra accepted its semantics, and Astra independently
checked all 48 saved graphs and 384 actual limb-layer mappings against native
endpoints, rotations, placement and drawing order. Each profile reuses one
unchanged complete eight-piece kit through its cycle. All six profile/view
combinations have eight distinct emitted poses. The final guard/schema/validator
cleanup passed review with 25 tests and zero skips in GS-010's actual receipt.
Astra found a first-build output-directory regression; GS-010 corrected it and
proved fresh output matches the accepted baseline. The B1 package is technically
accepted with its explicit one-file override; numeric proof files are unchanged.
Real donor fit and north/south projection still require their own acceptance
evidence. Exact final pins and the override are recorded in the execution plan.

The N/S synthetic execution is recorded as one job with 36 outputs. Its 11,209 ms
server execution and 1,717 ms download are measured tool intervals; queue time,
operator time and production savings remain unknown. The final peer receipt and
GS-012's scoped acceptance are pinned in the execution plan. No additional
synthetic work is requested. The next actual-character proof retains GS-010's
existing private-art processing condition; no pending question is duplicated.

The art lead will record immutable graph/source/output hashes, job IDs,
queue/execution/download timing where observed, actor-tagged preparation/review
intervals, correction lineage/reasons, output selection state and piece reuse.
Unknown values stay null; total elapsed time is not operator time. Actual pilot
measurements and the final adapt/rebuild decision remain pending. New design
expansion stays on hold.
