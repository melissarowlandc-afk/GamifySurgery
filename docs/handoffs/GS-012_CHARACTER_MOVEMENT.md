# GS-012 — Character movement

COMPLETE: owner approved final master on2026-09-13 and requested a successor
task for approved-design surfaces/attachments. Read
[successor handoff](APPROVED_CHARACTER_SURFACE_FITTING.md); older pending-review
notes below are superseded. Approved walk c9ccf24d...18c309, actions915cc7a0...fad7de9.

Latest915cc7a0501fb8df50f2a0e7b19304acbbadfa99b9243f2db796fe413fad7de9:
South clipboard+holding arms raised12; other39 action records hash-identical.
Sol rig implemented; root art/source review and geometry/browser validation
pass. Updated action preview985116B. Owner review next; local/no runtime/push.

Latest clipboard correction3b804c23aaf100cb910d62fb1d73a961c5b495324d75345e641de9503e8fbcab:
South LEFT arm foreground, RIGHT behind board; board top farther forward than
bottom (36 vs24). Sol rig implemented; root source/fourview review and independent
geometry/browser checks pass. Jump/sit hash85a5...1e1022 unchanged. Updated
action preview985724B. Owner review next; no runtime/costumes/push.

Latest clipboard review:03ffa95a9ced40ca510f3b5a99b5dbef83b0621e27f0e675a227c33970ddece1.
Left forearm supports board underside; right hand rests above, anatomically
consistent across4 views. Rig Sol implemented and root reviewed planes/art;
geometry validation passes and jump/sit records remain hash-identical. Preview
Sol changed opening state to Holding clipboard South; root rebuilt action
preview (982948B). Owner clipboard review next; no runtime/costume/push.

Latest review: remaining master actions delivered separately in
canonical-master-actions.html. Four sitting directions, four stationary
clipboard directions, eight-phase star jumps in four directions. Manifest
artifacts/character-movement/canonical-actions/preview/manifest.json SHA256
ebd077d0e38ba2650dbcbc9e55b3b4865871eec70c6acfefff74f83605dc359c.
Sol rig/preview workers implemented disjoint tools; root reviewed final art and
source and independently passed geometry/browser checks for40 poses, exact
pause and320/736 layouts. Native280x350, lossless art, quality90 guide;974686B.
Existing approved master c9cc and68 PNG assets unchanged. Next owner approval
of these actions before two-character costume proof. No runtime or push.

Latest master revision c9ccf24da87a4f89e1f464a65819d205bf0b2930950f9c60105a64c6d618c309:
South standing sleeves visible beside narrowed shared torso; E/W elbows use
posterior branch with anterior forearm flex and straighter rear swing. Sol rig
worker implemented; root reviewed full art/code and independently passed 32
phase browser/full geometry validation, exact pause and unchanged leg hash.
canonical-master-walks.html refreshed (728878 bytes lossless). Owner review
next; local only, no runtime/roster changes or push.

Latest owner correction delivered: all 8x4 walking poses retained; E/W both legs
behind torso, thumbs use common medial/anterior offset, North thumbs hidden in
artwork. Manifest SHA256 532d2d22781d44f06b941d806dfd2c033ed2d70fc929a2fac4f4cbb1a7996c26.
Gait unchanged by independent hash comparison. Sol rig worker implemented;
root reviewed source/sheets and passed full geometry/browser checks including
32 poses and exact pause. Updated canonical-master-walks preview is native,
lossless, 726282 bytes. Owner review next; no runtime or push.

## Latest milestone — plain canonical master motion review

Replaces bespoke fitting as the proposed foundation. Master geometry supplies
four eight-pose walks, South standing and seated South with independent guides.
Manifest: artifacts/character-movement/canonical-master/preview/manifest.json
SHA256: 12128590c8b0179adc9495d8e63d1a400b2e77955679c9874e79811db6439dd8.
Inline preview: canonical-master-walks.html in the current thread visual folder.
Native 240x310, lossless PNG, 730878 bytes. Sol reauthored_pilot_rig authored
master package; Sol native_preview_repair authored preview tools. Root reviewed
code and full-cycle sheets, independently passed validate-preview.mjs and
validate-canonical-master-preview.mjs, and inspected browser screenshots.
Checks cover 34 fixed-length poses, anatomy landmarks, seated anatomy, all 32
manual walk states, exact pause, resume/autoplay and 320/736 layout.

Owner motion acceptance is pending. Next milestone applies Green cardigan and
Gray braid as surfaces/attachments on identical geometry. Region metadata is
present; actual texture mapping is not implemented or proven yet. Previous
accepted pair remains a70e4915...dd79. No runtime integration, wider conversion,
commit or push. Local checkpoint; both workers held.

## Latest revision — revised anatomy, native-resolution pair review

Owner accepted Olive/Gray overshirt and rejected batch02 small arms, boxy torso,
cut crown, South thumbs and preview pixelation. Sol rig worker corrected source
profiles/renderer and rebuilt64frames. Root reviewed every cycle/head proof.
Terra preview draft failed review; Sol native_preview_repair completed native
240x310 preview and controller, retaining independent guides and source view.
Final batch manifest SHA256:
be69cfe393a8a5eeb896eb3e92d1b97efe0c53f5c673fc140ea49a06e7372d32.
Final inline task file: batch-02-character-walks.html,973706bytes,q80.
Previous preview files untouched. Root independently passed mesh8/8, both64
frame validators, all64 unchanged leg-geometry records and native64-state
browser check with pause/resume/autoplay, statics, atlas parity and320/736px.
Accepted pilot still a70e4915...dd79. Next: owner review; no runtime integration.
Workers complete/held. No commit/push; local checkpoint only.

## Delivered 2026-09-12 — four-character comparison

Two new mappings ready for owner review: Green cardigan and Gray braid.
All four characters keep both arms behind torso in every North/South walk
phase. Final batch manifest SHA256:
18439dc47d03dccdfa82dbc397a767e4a64f2e41d47f45707f43f3aebeb0c890
at artifacts/character-movement/reauthored-batch-02/two-character-preview/manifest.json.
Corrected pilot remains frozen at a70e4915…dd79 (full hash below).
Sol fitted/baked; Terra built comparison; root reviewed actual code, all full
cycles, corrected stray outlines and neighboring seated crop pixels, and
independently passed mesh8/8, both 64-frame validators, and 128-state browser
checks including exact pause, source/guide, statics and 320/736px layouts.
Final task-local inline: four-character-walks.html (956373 bytes).
Sitting is original reference only. Gray braid has no verified runtime ID.
Failed mask-audit diagnostics are not approved source coordinates.
See accepted-mapping-process.md and batch-02/sources/ART_DIRECTION.md for reuse.
Next: owner motion review of characters3/4; no game integration/wider batch.
No commit/push. Preserve unrelated dirty work; local backup checkpoint.

## Active batch 02 and owner frontal-layer steering

Owner accepted bd090ff two pilots and authorized two additional approved designs:
patient.adult.046 green cardigan and preview-only retained.gray-braid (unmatched
runtime identity). New work isolated in reauthored-batch-02 tools/artifacts.
Sol owns fitting/bake; Terra original-mask diagnosis; root source prep/review.

Owner then required both arms behind torso in all North/South walking for all
four characters. Sol updated pilot N/S draw order; root reviewed32 frames,
reran validator, compared all64 geometry objects unchanged, refreshed inline.
Corrected pilot frozen baseline SHA256:
`a70e491593b6c772b68bb6765cd822cdb5627bd710fd4562124c270ea4acdd79`.
East/West unchanged. Batch02 continuing; no game integration or push.

## Latest 2026-09-12 — West right hand, lateral head fit, standing shoulder depth

Sol corrected both West anatomical-right arms to authored source orientation,
shifted Gray East head 3px rearward and both West heads 3px rearward, and draws
the South neutral near arm behind the torso so both shoulder seams sit evenly.
Walking depth order is unchanged. Guides share the head offsets. Four Gray
East even-phase neck blend pixels are neutralized only in head/body overlap;
alpha and approved originals stay intact. No source-head matte cleanup needed.

Root reviewed actual code, before/after poses and all 24 changed walking frames;
independent 8/8 tests and full 64-frame validator pass. All 1,024 leg fields and
40 unaffected walking image hashes match the prior candidate. Preview refreshed.
Final manifest SHA256:
`bd090ff4c1647a43c65b4ff0eda3fcbce5003525669e6c9dbe0c43ed16d0d842`.
Sol complete, owner review pending. Sitting stays original reference. No game
integration, wider conversion or GitHub push; this checkpoint is local only.

## Latest 2026-09-12 — relaxed shoulders, smaller arms and North hands

Sol reauthored_pilot_rig refined both pilot characters: uniform arm width/hand
scale reduced about 10%, South shoulder inset increased to 10px, lateral pivots
3px forward and 4px lower, and gray North arms locally reflected to match the
natural hand orientation of olive. Anatomical IDs and the left wristwatch remain
unchanged. South walking shoulders now use an explicit 79px height above the
phase hip to match the standing shoulder seam; the final fix preserves both
accepted standing neutral hashes. Sitting remains the original reference pose.

Root reviewed code and all eight full cycle sheets, reran 8/8 tests and the
64-frame validator (including 32 South shoulder-height assertions), and compared
1,024 leg fields with the previous delivered candidate: unchanged. UI checks
pass for all manual phases, pause/resume, static poses, source/guide overlays,
and 320/736px layouts. Three embedded atlases match the final packaged output.
Final manifest SHA256:
`00364c452f0f54062415cba8698977ac65760e8f2c71f2e560d73c701fb9f4e8`.
Same inline preview path. Sol is complete and holding writes. Owner acceptance
is pending; no game integration, wider conversion, commit or push. Local only.

## Latest 2026-09-12 — arm orientation, depth and neck correction

Owner requested East far-arm orientation/depth, West attachments/orientation,
South outward/backward hands and shoulders, North shoulder inset, and lateral
neck repairs. Sol reauthored_pilot_rig implemented these in the pilot only;
Terra gray_source_measurements audited chirality read-only. Local arm reflections:
East left only; West both; South both; North neither. Anatomical IDs/watch stay
unchanged. Far arm now precedes both legs. Lateral shoulders share the actual
shoulder region; front/back shoulders move inward. Original heads overlap the
new neckline directly; Olive West's old original collar flap is excluded.

Final manifest (same path below) SHA256:
`2b15ebd7303fd96eee98f608a298418cc4304b4d480968d94342ceb370262fdd`.
Root reviewed actual code, all eight full contact sheets and refreshed the same
inline preview. Independent checks: 8/8 engine tests; 64 walking frames and guides;
384 positive mesh records; 64 neck contacts; 128 shoulder checks; 64 depth checks;
16 contralateral checks; one assembled opaque component per frame; zero retained
magenta-dominant pixels; two original hashes. All 1,024 leg geometry fields match
the prior manifest. UI pause/resume, static poses, directions/manual phases,
source/guide and 320/736px checks pass; embedded atlas bytes and pins match.

Workers complete. This supersedes the prior candidate, not owner acceptance.
Game unchanged, no other characters converted, no commit/push. Next is owner
motion review. Existing original seated pose/rig-guide limitations still apply.

## Current 2026-09-12 — two approved designs, reauthored pilot delivered

This supersedes the historical rejected previews below. Owner authorized TWO
examples before wider conversion or runtime integration. All designs in both
named folders, plus secretary/nurse/two additional patients, are approved designs.
Animation acceptance remains pending. No roster-wide conversion or game change.

Built-in imagegen prepared complete per-view source surfaces for olive jacket
patient.adult.033 and gray overshirt patient.adult.032. Original identity heads
are retained; generated torso/limbs are fitted using recorded view measurements.
Sol `reauthored_pilot_rig` owns the new renderer/profiles/bakes; Terra
`gray_source_measurements` supplied read-only measurements. Root reviewed all
eight directional contact sheets, corrected view provenance, neckline masks,
overlap/registration and guide provenance, and packaged the existing inline UI.
Both workers are complete. Root made only small preview integration corrections.

Current manifest: `artifacts/character-movement/reauthored-pilot/two-character-preview/manifest.json`
SHA256: `81f6c4cb9e076ae802c60586c0dbbed4ddba1efbcc404d3f62a05f1d3ee5b2c1`.
Inline preview: `C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/retained-character-walks.html`.
Source prompts/provenance: `artifacts/character-movement/reauthored-pilot/sources/ART_DIRECTION.md`.

Root independently reran 8/8 engine tests and the preview validator: 64 frames,
64 guide files, 384 positive mesh records, one opaque connected component per
walking frame, zero magenta-dominant pixels, two unchanged original hashes.
UI checks pass eight manual phases/all views, pause/resume without a jump,
standing/sitting static behavior, source and guide modes, and 320/736px layout.
All three embedded atlas bytes match disk; preview and 68-placement manifest
pins match the manifest. This evidence does not substitute for owner art review.

The guide is an independent fitted construction envelope, not an exact contour.
Standing is the new symmetric South neutral. Sitting is the original approved
static pose, explicitly labeled; it does not qualify the new rig for sitting or
bed poses. Source comparison uses the original standing artwork. Local only.
Next action: owner reviews these two moving examples; do not batch or integrate
until that review supports proceeding.

## 2026-09-12 — v2 rejected; preparation strategy reassessed

The owner also rejected the connected-limb v2 preview: thin limb sections,
stray colors and feet appearing unattached. The technical passes below do not
qualify it. Read-only Sol `source_readiness_review` inspected four originals,
the four directional sheets and both builders; parent verified source folders
and reviewed width/attachment code. Recommend preserving approved identities
while reauthoring proper per-view layered animation artwork, including hidden
limbs and cuff overlaps, rather than further automatic flattened-cutout patches.
Prove patient/human-founder/nonstandard-body representatives before batching.
This turn made no artwork/runtime changes; only assessment/planning records.
The existing inline preview remains rejected. No worker is active on this work.

## Revised connected-limb preview — 2026-09-11

The owner rejected the prior chunky/cut-off walking art. A new two-character
review candidate replaces it in the existing inline `retained-character-walks.html`.
Terra proved the connected gray/east limb mechanism; Sol `mesh_walk_expansion`
implemented all 64 walks with whole hands/shoes, corrected cuff coverage,
removed opposite-shoe fragments and stationary hands from N/S torso donors.
Astra reviewed the renderer changes and all four directional sheets, reran
the 64-frame validator, and refreshed/checked the existing preview packaging.
Pause/resume, eight manual phases, all directions, unchanged standing/sitting,
source/guide modes and 320/736px layout checks pass. Three embedded atlases
match their files and both preview/placement manifest pins match the actual file.

Current manifest:
`artifacts/character-movement/retained-mesh-spike/all-directions-v2/all-directions-v2-manifest.json`
SHA `a4bee50d536967bc9798a2ed466b17a890c72b9f246b5bec1a8748f700e58031`.
Inline HTML SHA `89ecfb3f4ff1091be1f5805a091029d5b81efd08d925c304559a668c9b0642c5`.
Validation: 64 original targets, 2,048 mesh triangles, 256 terminal attachments,
two unchanged source hashes, four byte-identical statics, no detached opaque
components larger than four pixels. Gray E07/W02 each retain one isolated pixel.

This is owner review pending, not production approval or runtime integration.
The roster retains the prior version's `repair_required`/`user_rejected` evidence;
do not silently mark it accepted from this revision. No other roster member was
converted. Local only; no commit/push. All workers are stopped. Next action is
review of the revised inline motion; keep GS-010 held and do not poll peer tasks.

## Historical owner rejection and replaced checkpoint

The latest owner reports chunky, oddly cut-off arms and legs in all directions.
Astra agrees: prior review-candidate acceptance was premature. Current work is
a structural limb-rendering repair initially through Sol `continuous_walk_repair`,
starting with one actual retained gray-overshirt character's complete east cycle
before extending the correction. See current top ExecPlan section. Preserve the
old evidence, original designs and roster; do not advance this version to any
production batch. Historical successful numeric checks below do not override
the failed visual result.

## Latest retained-art checkpoint

Two actual retained designs (`patient.adult.033` olive jacket and
`patient.adult.032` gray overshirt) now have all four eight-phase walks and
original South standing/sitting in the inline `retained-character-walks.html`.
Source references and fitted guides are embedded, at one fixed scale/baseline.
Sol prepared artwork; Terra packaged UI and the 55-source preservation register.
Astra inspected actual frames and code and independently verified 64 geometries,
704 transforms, 141 hashes, UI pause/static/phase controls and embedded bytes.
All remain review candidates with reconstructed garment seams, not production
approval or game integration. Originals are unchanged; no commit/push occurred.
See the top of `docs/execplans/character-movement.md` for sealed hashes.
Remaining retained patients/founders and five reference-role exceptions are
explicitly pending in `artifacts/character-movement/retained-roster/retained-roster.json`.
Next: review conversion quality/effort and prepare subsequent retained batches.
GS-010 remains on hold; no peer-task polling or signoff required. Older
partial/rejected implementation notes below are historical.

## Consolidated owner-facing task (2026-09-11)

GS-012 now owns the entire existing-character mapping proof and necessary art
preparation. GS-010 is held for later new designs. This supersedes split
ownership and cross-task waits below. Do not message or poll peer tasks.
Sol `finish_mapping_demo` is implementing a local retained-art stride/passing
pilot; full directional eight-frame/standing/sitting proof and roster coverage
follow actual art review. Retain the existing Cortan job and its authorization
boundaries, but its seated-image recovery does not block independent local
mapping. See the active ExecPlan for current ownership and acceptance.

Updated: 2026-09-11. **Status: directional motion references accepted;
rendered-character fitting pending; pause/arrival source behavior validated,
awaiting game build and live playtest; shared authoring contract agreed with
GS-010 including the numeric addendum; M7A numeric mapping/batch tool validated,
synthetic lateral and north/south mapping proofs accepted; actual art process
qualification still pending.**

**Approval resolved, 2026-09-11:** the owner confirmed Cortan approval in both
tasks. GS-010 has resumed its Sol worker on the prepared Marisol seated-left V2
correction, then retains ownership of Patient 01's actual walking proof. The
approval covers the informed four-character/142-pose resident private workflow
at https://cortan.taile197db.ts.net, derivatives, corrections, mirrors and
downloads, with no local uploads. Earlier pending-approval notes are historical.
GitHub backup is optional for continuation and has not been requested.

## MOV-006 current checkpoint — process before more designs

Latest owner correction (2026-09-11): the actual approved roster, estimated at
roughly 55 identities, must be preserved and mapped. M8's illustrative costumes
looked acceptable but did not satisfy the requested real-character example.
GS-010 received this correction. Terra's read-only audit and Astra's manifest/
source-plan review distinguish 55 private reference PNGs from 50 patient and
30 founder runtime IDs; their one-to-one source linkage remains unresolved.
Neither count alone proves design approval. Preserve both source libraries.
The next demonstration must use two linked existing approved identities,
followed by batches across the rest of the roster; the newer Patient 01/02
technical pilot is not automatically a substitute for that existing roster.
Keep approved appearance and proportions; share the gait rather than imposing
one character's body dimensions. No actual walking art is accepted yet.

The latest owner request is to establish efficient, robust mapping for hundreds
of characters before making more designs, then adapt/remake existing characters
one batch at a time. Exact wording is under MOV-006 in the movement review.
The [production process](../features/character-movement/production-process.md)
records intake, one reusable fit per body/profile, measured artwork pieces,
representative poses, complete cycles, immutable batches, selective redo and
actual effort measurements. Preserve identities/originals; selectively rebuild
missing or unsuitable surfaces only when pilot evidence supports it.

Current seam status: B1/v2 is technically accepted for offline synthetic lateral
binding. Terra reviewed semantics and final guard/schema/test-receipt cleanup;
Astra reviewed the actual diffs and independently checked 48 saved graphs,
384 actual limb-layer mappings, exact kit reuse, all 195 v3 text/code entries
and all 156 frozen numeric files. Each of the three profiles has eight distinct
poses in both side views, with 96 unique save prefixes. GS-010's final actual
test receipt records 25 passes and zero skips. Astra caught a first-build
output-directory regression; GS-010 corrected exactly one line and proved
fresh compiler output has the accepted baseline bytes. Astra verified that
replacement, syntax, baseline hash and all 194 unchanged other v3 entries.

Final selection is the v3 validation/checksum evidence plus the explicit
builder override in parent-evidence/binding-v2-output-root-fix-addendum.json.
Current builder SHA is
`12b94dcee57adc20f6fe247a7a51225c6d53fa97fe7fbc635edd3eabc6d5b696`;
the old v3 builder entry is historical. Exact report/addendum pins and reviewed
error bounds are in the execution plan. No GS-012 B1 implementation, image or
network operation occurred. Real donors and N/S emission remain gated.

Current walk checkpoint: GS-010 implemented the separate strategy in the
[north/south projection proposal](../features/character-movement/north-south-projection-proposal.md).
Frozen N1 v7 is technically accepted for local, unexecuted synthetic preparation.
Terra reviewed actual source semantics; Astra verified all 71 text/code hashes,
the 10-pass/zero-skip receipt and the saved graph independently: 18 fixed canvases,
36 outputs, 136 target limb mappings, seven isolated controls and 16 reused
source images. All eight north and eight south phases use the actual resized
proximal-joint map, with separate dimension and final placement error. A new
fixture changes all 16 N/S registration/native records. Fixed torso plates now
overlap every tested depth group. Exact pins and reviewed errors are in the plan.

Selected prepared-graph SHA is
`a1c65208d2f6264786d6ad0fa53ad963ad19a91309efe0936b1eaa0d5e602e4a`;
checksums-v7 SHA is
`0538537aaddf1faa87be64f6ac2f638026c3ba392bfd336c00c0ef2a51426dee`.
The package remains frozen under north-south-v1. N2 execution and N3 analysis
are now technically accepted for this bounded synthetic fixture. GS-010's Sol
worker completed the runner/analysis; its parent independently decoded the 36
original PNGs and reviewed the boards and eight-phase GIFs. Terra accepted the
analysis math and limits. Astra verified text/code pins and independently matched
the actual request/history graph and all 36 output records to frozen N1. The one
recorded job is `48396b34-2fb8-400d-a39f-e096ac055fe3`, with 11,209 ms execution
and 1,717 ms download time; operator/queue time and savings remain unknown.

Pure-control alpha and hidden RGB match the discrete resize prediction in 14,756
comparisons. Rotation centroid residuals are below 0.000487 pixels; 68 interior
samples establish the four declared depth relations across 17 cases. Opaque RGB
can differ by one channel level even without resize, and rotations introduce
fractional alpha. Mask inversion is within one level, not exact. These are
fixture observations, not production tolerances or a global color correction.
The binary-alpha fixture cannot qualify partly transparent donors, seams,
garments, hidden anatomy or clothed-character appearance.

The authoritative receipt is parent-evidence/north-south-run-parent-final-review.json,
SHA `b63c7d1abe85063c663ef6b84ce6b742e463dc0f130e70b49aefa3ab8c59a7ff`.
Exact N2/N3 pins and scope are in the execution plan. Acceptance was sent to
GS-010; all workers are idle and no further synthetic implementation/render is
requested. GS-012 did not execute GS-010 tools, read/hash images or perform jobs.
The next proof is actual Patient 01 and then the other three outfits, with
measured preparation and correction effort. The owner resolved GS-010's private
Cortan approval question on 2026-09-11; see the current checkpoint above.

Separate art status from GS-010: production-poses-v2 has five parent-accepted
standalone frames (Patient 01 side seats and exam; Patient 02 front/left seats).
GS-012 reviewed only its JSON receipt and manifest/checksum-report hashes.
Furniture placement, exam-table occlusion, embedded-chair handling and runtime
integration remain pending. The batch still needs all 128 walks, eight seats
and one exam frame. This package does not qualify the walking mapping process.

M7A is complete, local and uncommitted. Terra `mapping_contract_audit` performed
read-only preflight and the tool seam audit. Sol `correct_side_walk_preview`
implemented `tools/character-mapping/`, the Patient 01 recipe, first-four manifest
and hardening. Astra read the source/diffs, reproduced and returned defects,
then independently ran 14 passing Node tests (zero skipped) and 8,809 additional
assertions. No qualifying implementation milestone was retained without worker
delegation. Astra's writes were planning/handoff, independent review evidence
and one permitted tiny integration correction: moving the batch recipe's linked
ancestry check before its first read. The full acceptance run passed again after
that correction; current parent evidence pins the amended source, while Sol's
evidence and the earlier parent result are preserved as history.

All 32 Patient 01 targets exactly reproduce 2,480 compared reference points and
592 scalars; maximum difference 0 against a 0.0001 numerical rounding allowance.
Native/frame roundtrip error is at most 0.000009466 frame pixels. Enlarged body
dimensions recompute geometry. Repeated/selected/interrupted batches, invalid
inputs, stale/tampered outputs and actual Windows junctions are covered. The
synthetic 300-character / 9,600-target test took 4.077 seconds in the final parent run;
manual/raster efficiency remains unmeasured. All 16 protected source/reference
hashes match the M7 baseline, including M5 pause/arrival work.

Commands and evidence:

- `node artifacts/character-movement/mapping-pipeline/parent-validate.mjs`
- `artifacts/character-movement/mapping-pipeline/parent-review.json`
- `artifacts/character-movement/mapping-pipeline/parent-tests.tap`
- `artifacts/character-movement/mapping-pipeline/worker-validation-m7a-hardened.json`
- `tools/character-mapping/README.md` for compile/check/batch CLI usage.

The accepted target artifact is
`artifacts/character-movement/mapping-pipeline/parent-runs/mixed-20260910-patient-01/5da58c99ef43e60b192fd8b2e71ab5eea7a27701ea262a66684e1b7635f37dda/targets.json`.
SHA-256: `f5c016d0575d0e22d0a6cbed5c12707b55076864a892924a3fa3ae169564f05c`.
Dependency fingerprint: `5da58c99ef43e60b192fd8b2e71ab5eea7a27701ea262a66684e1b7635f37dda`.
First-four batch fingerprint: `96a5ba85f7081cfda300ca2d3b1c03ca0a95f0b0aaea61c97b7942d11d49d764`.
It has one complete numeric recipe and three explicit measurement blockers;
all targets remain `target_only` and pending raster review. Earlier candidate
hashes/evidence are historical and must not be selected for integration.

Exact accepted paths, hashes, unit/view conventions and evidence were sent to
**GS-010 — Patients and employees** with the native task tool. GS-010 owns all
raster sources, donors, jobs, compositor adapter and its approval handling.
It independently verified the amended artifact/dependency pin and confirmed
all 32 target records retain identical canonical bytes. Its M1 offline adapter
passed its own parent review (17 tests, 22 package hashes); no actual compositor
or character raster acceptance follows from that offline result.
The nonprivate procedural mechanics probe and lateral synthetic binding are
now technically accepted, with their boundaries recorded above. The bridge pins
artifact bytes and dependency hash, selects the exact outputKey, resolves native
endpoint paths without another gait solver, preserves phase/cardinal/asset-view/
registration and declared lineage, and reconciles layers with far/near ordering. Actual donor
crops/pivots/masks cannot be supplied by this numeric compiler.

Important N/S limitation from Terra's numeric follow-up: GS-010's current rigid
2D donor adapter cannot use one fixed limb crop for every north/south pose. The
fixed latent-3D anatomy foreshortens in projection; the accepted P01 forearm
targets vary from about 96.95 to 146.13 native pixels. GS-010 has received this
condition. Require an explicit reviewed projected-variant strategy or proved
projection/deformation method tied to latent/native targets before N/S binding.
Do not hide the variation with a loose length tolerance. Reconcile small
lateral numerical rounding separately. Full-direction process qualification
and its actual setup/reuse cost remain pending.
GS-010 confirmed the N/S condition and agreed to a separate, compiler-pinned
lateral numeric rounding bound based on the actual solve2/nativePoint stages.
See the production-process document for the formula; do not apply it to donor
fit/shape/seam acceptance or to north/south foreshortening.

GS-010 reports its existing private-art processing condition remains unresolved
after considering the owner's new proceed instruction. Its existing question
covers Patient 01, Patient 02, Marisol Vega and Caleb Ellis plus derived pose/body
parts at Cortan (`https://cortan.taile197db.ts.net`) for the 142-pose scope,
corrections, mirrors and downloads, using images already resident there and JSON
instructions only. The recorded automatic rejection of Marisol alignment was
before submission for missing trusted destination/private-payload authorization;
GS-010 retains the pending informed question and is not duplicating it. Do not
treat numeric/synthetic tooling as resolving that private-image boundary.

Next action: receive GS-010's actual procedural/binding evidence, then review
Patient 01 east 01/03 once its existing condition is resolved, followed by all
eight phases/independent views and Patient 02's coat, Marisol's outfit and
Caleb's uniform. Measure preparation/corrections/reuse before expanding designs.
GS-010 has now reported successful M2 synthetic compositor job
`bb0d4b1d-4921-4cf1-8fd2-50fd908ba5fe` in its mixed batch's
`pose-process-proof-v1/m2-run-001/`. Its parent verified the receipt/history and
six audit hashes, 448x1024 canvas, signed clipping, +30/-30/+45 degree rotations,
noncentral pivot and mask polarity, with centroid residual at most 0.0241 native
pixels. History execution was 1,084 ms and observed download 71 ms. These are
synthetic mechanics observations, not donor/art acceptance tolerances. A local
Windows-subfolder correction resumed the same job; no second submission,
private inputs, model or uploads. Final packaging is complete; GS-010's Sol is
now implementing B1, the narrow offline synthetic binding seam. GS-012
acknowledged without running network commands or reading private images.

Terra's read-only final M2 metadata audit verified:

- `m2-final-validation.json` SHA
  `27479b66494ff40ba393e37d4c41e7942776a2bcdaaaee247da3627061082eb7`.
- `m2-final-checksums.json` SHA
  `452805c52920b95e397c2b053722fc76d4a5e038883e1583b136f3c732f4061f`.

Both are in
`Photos for Codex 2/Codex Patients or Staff or Other Characters 2/mixed-batch-2026-09-10/pose-process-proof-v1/m2-run-001/`.
The final report contains 25 named true checks and 11 passing tests; Astra read
it directly. Queue/operator time remains unknown. GS-012 did not independently
read/hash PNG bytes; those are covered by GS-010's parent evidence. The fixture
reports an alpha/mask inverse within one quantization level, not exact inversion.
Do not infer unknown sampler configuration, donor pivots or artwork tolerances.
Terra will perform B1's semantic audit after GS-010 provides stable code/tests;
its scope and acceptance are in M7 of the execution plan. GS-010 owns all B1
implementation, and GS-012 must send corrections to that task rather than edit
its files.

No final rendered-character proof or readiness for hundreds is claimed. All
work remains local/uncommitted; no game build/server/browser/save/asset operation
occurred for M7A. Keep the overall GS-012 task open.

## Current scope and decisions

The owner includes founders, patients, employees, and sidewalk passersby in
"characters" and wants a shared movement appearance. Map-up is north.
[MOV-001](../features/character-movement-review.md#mov-001)
records the first east/west arm/leg observation, four main poses with at least
one intermediate per transition, and the shared-body-versus-sprites question.
The owner agreed to the shared-template direction with "Okay sounds good".
This starts the isolated base-walk preview in
[the execution plan](../execplans/character-movement.md). The source-level
pause/arrival change is now validated under M5 below. Final rendered artwork
and live game visual acceptance remain pending; the running build is unchanged.

The owner has now clarified both neutral moments: arms down at the sides;
the previously leading leg straight with its foot planted, while the trailing
leg swings through with a slightly bent knee. The supporting and passing legs
swap for the second half of the cycle. MOV-001 records both poses explicitly;
do not ask the owner to clarify this again.

## Repository and preservation

- Actual repository: `C:/Users/Kyle Kent/Projects/GamifySurgery`.
- At intake: branch `beta`, HEAD
  `40638f677b674bc59f74f6742d55c8dda027bae1`, extensive shared uncommitted changes,
  including character art, manifests, renderer, session, domain, and tests.
- Read applicable AGENTS instructions, this handoff, the observation record,
  and fresh status on resume. Preserve unrelated changes and existing saves.
- GS-010 owns roster generation; its
  [handoff](PATIENT_EMPLOYEE_CHARACTERS_HANDOFF.md) is the coordination source
  for new character assets. GS-011 owns the broader playthrough inbox. GS-012
  does not edit the PM board or take over those scopes.
- Canonical owner play remains `START_GAME.cmd` and exactly
  `http://127.0.0.1:4173` in the intended persistent browser profile. Coordinate
  a separate test session or suitable test time before disruptive validation;
  do not reload, rebuild, restart the server, switch origins/profiles, or reset
  the owner session to investigate.

## Work and evidence

Terra `inspect_movement_animation` completed the bounded read-only review of
current gait selection and character rendering, with no edits or test runs.
Astra reviewed the actual selector, atlas resolvers, neutral-pose assertions,
scene rendering seam, and legacy builder rationale. Current code selects four
beats; founders/generic actors reuse idle for neutral, while authored patients
have a dedicated neutral image. All use finished full-character bitmap frames.
The source findings are recorded under MOV-001 and support recommending a
common authoring pose template exported to the current sprite approach.

During intake, only this handoff and the movement observations document were
created. No game tests or owner-session playtest have been run for MOV-001.
The source inspection does not reproduce the owner's live visual defect.

The subsequent neutral-pose clarification required only a small direct update
to these two discussion records. No worker was needed for that documentation
update, and it did not change the source findings or start implementation.

### M1 isolated motion study

The owner agreed to the shared-template direction; Astra wrote
`docs/execplans/character-movement.md` before delegating new preview-only paths.
Terra `side_walk_preview` produced the first fragment and its display copy.
Its readback/syntax checks passed, but parent source review and a new isolated
headless Chrome run found `shoulder is not defined`, zero rendered SVG paths,
and incorrect limb geometry. This first draft was not technically accepted
or delivered as a reviewed visual result. Evidence:
`artifacts/character-movement/initial-preview-review.json`.

Sol `correct_side_walk_preview` completed the bounded correction in the same
two new preview files and its scoped QA report. Both workers are complete;
no implementation writer remains active. Parent QA used inline content in a fresh headless
context with all requests blocked; it does not open a game URL, use the
owner's browser profile, change the running build, or start a server. The
nine-path source/launcher baseline is recorded in
`artifacts/character-movement/protected-runtime-baseline.json`.

The corrected preview's canonical/display SHA-256 is
`4cf509ce2a0d579aad1eff38d04cf2ebb8489a2a02a9496cac9680dd7e933e75`.
Sol's final report is `artifacts/character-movement/sol-preview-review.json`.
Astra independently passed 585 focused assertions on that exact hash, including
all eight poses, actual rendered limb lengths, support/passing/opposition,
mirrored directions, half-cycle symmetry, manual/keyboard/loop/play/pause,
reduced-motion initial/change behavior, and 320/736 responsive layouts.
The parent reviewed five light/dark screenshots and rechecked the final
visible right-limb dashes and foreground description contrast. Parent evidence
and screenshot paths are in `artifacts/character-movement/parent-preview-review.json`.
No runtime errors or external requests occurred, and all nine protected hashes
match the pre-preview baseline. No game suite, game build, or owner playtest
was run. The owner subsequently said the motion study looks great and asked
whether its body proportions match the actual characters. Treat that as
positive acceptance of the gait reference, not a claim that its body dimensions
or final character appearance have been fitted or accepted.

### MOV-002 proportion and asset-contract review

Terra `inspect_movement_animation` completed the bounded read-only follow-up;
no files were changed by the worker. Astra reviewed the actual approved GS-010
v2 directional board and current founder/patient side-idle atlases. The preview
uses illustrative fixed geometry, while the art has larger heads and fuller,
more varied silhouettes. Current metadata records cells, crops and anchors,
not shoulder/hip/elbow/knee landmarks. There is no numeric appearance-fitting
proof. Reuse the accepted gait relationships while fitting the skeleton to the
art's real proportions; do not distort the art to match the diagram.

GS-010's original side A/neutral/B and upper-body-fixed pilot could not satisfy
MOV-001. It has now confirmed eight distinct lateral sprites per direction,
full opposing arm swing and two distinct passing poses plus four transitions.
Both earlier lower-limb pilots are finished and preserved as trials, not final
MOV-001 art. Front/back A/B and seated/exam stay separate. Full resident
processing approval remains; do not repeat that approval question. GS-010 owns
its art, jobs and private packages; GS-012 does not edit its planning or approvals.

Native coordination message was successfully sent on 2026-09-10 to
`01a08b00-fdd3-7000-a2a1-087d22139a9c` — **GS-010 — Patients and employees**.
It requests a shared eight-pose lateral/arm contract and precise ownership,
preserves existing processing approval and completed/in-flight work, and
requests no generation, upload or queue operation. GS-010 replied with the
contract alignment and requested Patient 01 joint fitting from its approved
448 by 1024 right/left idle masters. GS-012 confirmed the ownership split using
the native task message tool. M2 in the active plan records exact source/output
paths, acceptance and validation. Sol `correct_side_walk_preview` completed
the new numeric JSON, vector preview and worker evidence. No private raster
edit/copy/upload/render, Cortan job, runtime change or atlas edit is authorized
for GS-012. Astra has viewed both masters and checked their independent-view
manifest/registration; source landmarks and hidden anatomy are distinguished.

### M2 Patient 01 numeric/vector reference

The final data are `docs/features/character-movement/patient-01-fit.json`, with
the canonical fragment `patient-01-fitted-walk.html` in the same directory and
an identical thread visualization copy. The fit uses measured alpha/silhouette
evidence plus explicit estimates for hidden joints, head/torso proportions and
fixed limb lengths. Every phase/direction has native 448 by 1024 geometry as
well as frame 128 by 192 geometry, source-pixel lengths/lift/bob, uncertainty,
near/far identities and floor registration. Head/torso translate rigidly with
bob. Frame scale is fixed at 171/893 with floor edge (64,181); no per-phase fit.

Parent review found and returned support-knee length, shoe stroke grounding,
hand reach, profile width, dash visibility and native-unit issues; Sol corrected
them. Final worker checks pass (2,446 assertions). Astra independently passed
3,191 assertions and visually reviewed all main poses in both directions plus
320 light and 736 dark captures. Evidence/scripts/screenshots are under
`artifacts/character-movement/patient-01-fit/`. All 13 baseline hashes match;
zero runtime errors or network requests. No runtime/atlas, private raster,
processing job, server, browser profile, game build or save was changed.

- Fit SHA-256: `5e2ab5bcb5b390acb74fb45ef63b85e83df13ebaf2db102f32e38222700dd571`.
- Preview/display SHA-256: `8b75bcb1b717b83d219b304ecdcb51627936cb22089107704da8b1447e330b24`.

Labeled coordinate mirroring retains phase/anatomical identities and reorders
near/far layers. Plain raster reflection changes anatomical interpretation and
needs +4 phases for this symmetric gait; it is not pixel equivalence between
the independent approved masters. ±2 frame-pixel shoulder separation is a
schematic visibility offset. Both feet use one schematic ground line; the idle
far-shoe depth/stagger and final clothing width stay with GS-010's art review.
Technical acceptance is separate from final raster or owner appearance approval.

GS-012 sent GS-010 the ready specification/preview/evidence paths, native field
usage, hashes and limitations via the native task tool on 2026-09-10. Delivery
does not imply acceptance by GS-010 or the owner. The worker is complete; no
implementation worker remains active. All GS-012 work is local/uncommitted.

### MOV-003 north/south reference (technical review complete)

The owner explicitly requested the same proportion-fitted approach for a natural
eight-pose north walk and eight-pose south walk. North currently sways side to
side; south legs only go in and out. Exact wording is recorded in
`docs/features/character-movement-review.md#mov-003` and was sent to GS-010.
M4 in the existing plan owns this continuation; do not start another task.

Terra `inspect_movement_animation` completed read-only preflight. Parent reviewed
the two-pose selector, direction-aware founder/patient resolvers, generic v3
left-facing walk fallback and front/back procedural horizontal-leg offsets.
This source evidence is not a live reproduction. Parent viewed the independent
approved Patient 01 standing/front and back masters. GS-010 confirmed their
paths/hashes and the same numeric/vector versus raster ownership split.

Sol `correct_side_walk_preview` completed M4 in new
`patient-01-north-south-fit.json`, `patient-01-north-south-walk.html` and
`artifacts/character-movement/patient-01-north-south/worker-*` paths only, plus
the identical thread visualization copy. Head/torso centerline stays stable;
feet step in consistent lanes with latent sagittal knee/arm motion and explicit
front/back depth projection, rather than lateral splay. Frame and native master
coordinates/units, projected ground, uncertainty and facing/anatomy must agree.
Parent baseline covers 18 source/runtime/previous-reference files; all original
13 M2 baseline hashes still matched at intake. Parent owns independent checks
under the corresponding `parent-*` prefix. Preserve all delivered lateral files.

GS-010 reports private-art processing paused by its new automatic approval
rejection and is handling its own remaining-work/approval proposal. It requested
this separate numeric/vector work continue. Do not call raster tools, try to
bypass that block, or ask an extra approval question in GS-012. GS-010 owns all
private art/masks/jobs and shared atlas/runtime integration remains deferred.

M4 final reference has eight distinct phases in both views, stable head/body X,
torso widths and foot lanes, about four frame pixels of vertical rise, opposing
arms, straight support and bent/lifted passing legs. Latent 3D segment lengths
are fixed; the authored vertical 0.88 / depth 0.22 projection foreshortens them.
Same anatomical phase is projected for north and south, with south anatomical
right on screen-left and north anatomical right on screen-right. No raster
mirroring or source-view substitution is implied.

Use `phase.south` or `phase.north`, then `.frame` for 128 by 192 coordinates or
`.nativeMaster` for inverse-registered 448 by 1024 points. `.latent` holds
unprojected 3D anatomy. Frame/native `footLift` and `projectedFootLiftY` are
positive upward in explicitly declared pixel units; `latentFootLift` stays in
its named authoring units. Native `projectedUpwardBobSourcePixels` includes the
vertical projection. Body radii, shoulder Y and all point coordinates are
converted. Stable registration is scale 171/898, floor edge 941 to frame181,
source X axis238 front / 238.5 back to frame64. Keep projected ground depth for
each heel/toe/contact; (64,181) is the body ground origin, not every sole row.

Parent source/visual review returned boot width and coordinate/unit corrections
to Sol. The final worker validator passed 2,572 assertions and independent
parent validator passed 3,976. Astra inspected original source pixels read-only,
numeric observations, actual implementation and ten screenshots covering every
phase in both views, plus narrow/light and desktop/dark layouts. No browser
errors/requests; all 18 baseline hashes match. No game build or game test suite.

- Fit SHA-256: `7523c59921ec730ec343265e422f8b5d2c8cec5cf442504ea1f52b92ac3e50b2`.
- Preview/display SHA-256: `d1b45d2796e4070b1db405424ea1478853638e42be76bf47571fc0e5dd32378a`.

Reports/scripts/screenshots are under
`artifacts/character-movement/patient-01-north-south/` with `worker-*` and
`parent-*` ownership. Canonical JSON/HTML are in
`docs/features/character-movement/`; display copy is
`C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/patient-01-north-south-walk.html`.
Sol's bounded implementation is complete. No worker remains active. Approximate
silhouette fitting and authored projection do not establish final clothed raster
appearance or owner acceptance. All GS-012 work remains local/uncommitted.

The native task message tool delivered the final M4 paths, hashes, evidence,
coordinate/registration usage, exact owner wording and MOV-003 record to
GS-010 on 2026-09-10. Delivery does not imply its visual acceptance, initiate a
raster job, or change its separate approval handling.

### MOV-004 pause/arrival runtime behavior (source validated)

The owner accepted the north/south reference and added exact pause freeze plus
floor/chair/bed resting rules. Exact wording and interpretation are in MOV-004
of the movement review. M5 in the existing plan is the authoritative bounded
runtime scope; earlier reference-only source prohibitions do not prevent this
new owner-requested behavior change. Preserve the running canonical game/build
and all accepted reference/private-art files.

Terra completed read-only preflight; Astra reviewed the actual scene, route,
view-model and bitmap contracts. Before M5, time froze but gait selection
switched walkers to idle on pause and paused redraws still synchronized routes
and recomputed poses. Founder and patient arrival poses could override an
unfinished interpolation tail. Parent product decision follows the owner's
floor rule: stationary floor actors use south/front idle, retaining activity
labels and domain task timing. Existing semantic chair/exam-table poses apply
only after logical and rendered arrival.

Terra completed the bounded implementation in FacilityScene plus the new pure
presentation helper/behavioral tests named in M5. Parent captured pre-change
source/test baselines and protected hashes under
`artifacts/character-movement/pause-arrival/parent-*`. GS-010 was notified of
this exact runtime-versus-art ownership. It retains all private art/jobs and
atlas production; no unfinished eight-frame raster is integrated here.

Parent returned the initial helper-only scene tests. Terra supplied a real
FacilityScene harness; Sol `correct_side_walk_preview` then completed the
bounded coverage correction for multiple keyed actors, actual roster reorder,
build-only/repeated pauses, furniture arrival, callback timing, cleanup and
actual bitmap/fallback rendering. Sol found and fixed initial horizontal facing
for an actor first appearing during pause. Astra reviewed the actual baseline
diff and tests and added a three-line founder missing-location/resume case.

M5 technical acceptance is complete. Independent parent checks passed 7 files /
52 tests, player typecheck, and boundary/launcher checks (875 tracked paths).
All 25 protected source/reference files in the final preservation report match.
Exact commands, code hashes and limits are in
`artifacts/character-movement/pause-arrival/parent-review.json`.

Runtime ownership consists of `apps/player/src/facility/FacilityScene.ts`, new
`characterMotionPresentation.ts`, `characterMotionPresentation.test.ts` and
`characterPauseArrival.test.ts`. Snapshots freeze the last displayed world
anchor, facing, pose, appearance and rendering representation. Paused/build
redraws cannot advance routes; resume discards pause-spanning delta. Per-key
phase offsets survive reorder. Floor stops use front idle; semantic seated/exam
poses apply only after logical and visible arrival. No persisted data is added.
Both workers are complete. Changes are local/uncommitted and not loaded into
the running game. No build/server/browser/save/asset operations occurred; live
visual playtesting remains for the next coordinated game build.

The native task message tool delivered this M5 behavior contract, owned paths,
validation and evidence location to GS-010 on 2026-09-10. Delivery does not
constitute visual acceptance, start a raster job or alter GS-010's approvals.

### MOV-005 shared character-template mapping

The owner explicitly requested coordination with GS-010 to work out mapping
characters onto the shared walking templates. Terra `mapping_contract_audit`
performed the bounded read-only audit of identity/atlas/pose seams; Astra reviewed
the actual code, numeric references, reflection and preview timing. GS-010
confirmed agreement through native task replies and its art-plan section
`shared-walking-authoring-contract`. The parent-owned contract is
`docs/features/character-movement/character-template-mapping.md`, ID
`shared-character-walk-v1`, version 1.

Use the same eight anatomical phases in all directions, fit each character's
own proportions/garments, and bake full-character sprites. Preserve existing
inventory IDs while adding authoring phase IDs 01–08. Current GS-010 batch is
four characters ×32 walking frames +12 seated +2 exam =142; this does not
upgrade the old founder/patient/generic roster or add runtime compatibility.
New 128×192 employees need an explicit authored-art identity/atlas seam; current
generic staff/civilians are 160×240. No runtime files changed in M6.

The contract records donor ownership, appropriate anatomy spaces, geometric
shoe contacts rather than preview stroke centers, fixed registration/inverse,
pixel-edge/center/rounding semantics, normalized phase timing and exact reference
field lookups. The existing previews both use 180 ms per phase; future game
cadence remains an explicit integration decision. Source uncertainty is separate
from tolerance; donor-specific art allowances need measured pilot review.
GS-010's five donor preparation pieces later become torso/head plus twelve
articulated limb pieces. Their donor-local measurements do not exist yet.

The agreed next artifact is Patient 01 east stride 01 and passing 03 with
provenance, segment mappings, target overlays and native/map proofs. GS-010
first handles its numeric compositor and donor proof after its pending art
approval. Review together before the full east loop, independent west and
front/back, and then Patient 02's coat and employee uniforms. All source art,
processing, masks and packages remain GS-010-owned. GS-012 owns motion, fitting
review and future explicitly coordinated renderer mapping. Four reference and
four M5 code/test hashes remain unchanged. This work is local/uncommitted.
GS-010 explicitly confirmed the complete numeric addendum with no conflict and
no further version 1 design confirmation needed. Its lead independently checked
the four hashes, two clocks and all 32 view/phase field lookups. M6 is complete;
donor-specific art tolerances remain part of measured representative-pilot
review. No extra approval question, private-art job, source upload, build or
browser action occurred.

## Next action and lifecycle

M5 implementation and parent review are complete. Preserve the active game
session; check pause and arrival visually after the next coordinated build.
M6 is complete; review GS-010's representative raster interpretation when
delivered. The owner has accepted the north/south
motion reference.
Neither this preview nor any technical handback is final raster or
owner playtest acceptance.

Review GS-010's first rendered Patient 01 walk using the delivered fitting data
before roster expansion/eight-frame art integration. Final rendered-character acceptance and
owner appearance/playtest review remain pending; the numeric reference alone
does not complete GS-012.
The existing preview is preserved. Display copy:
`C:/Users/Kyle Kent/.codex/visualizations/2026/09/10/01a08bf5-7fc2-7572-8909-8fbc532daecd/character-walk-preview.html`.
Keep refinements under the existing MOV records and plan. GS-012 owns the new
M1/M2/M4 reference and validation files and the four coordinated M5 source/test
files above. Other shared game/asset paths require exact coordination before
any subsequent integration milestone.
Normally use one named write-capable worker at a time; review actual changes
and validation, then obtain owner visual/playtest acceptance.

The discussion record and handoff are local and uncommitted. An observation or
intermediate milestone does not close GS-012. Once the owner agrees the overall
task is complete, standing authorization covers scoped audit, commit, GitHub
backup push, remote verification, handoff update, and archival. No additional
"push to GitHub" phrase is required. Backup is separate from deployment or merge.
