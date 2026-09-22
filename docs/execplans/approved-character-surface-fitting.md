# Approved character surface fitting

> SUPERSEDED: Owner rejected the raster retry as visibly distorted and approved
> a layered-artwork-first pilot. Neither vector nor raster fitting is accepted.
> See layered-character-pilot.md. Preserve these files as history; the previous
> fixed silhouette constraint does not govern the new pilot.

## Owner correction — source-faithful retry
The owner rejected the simplified vector fittings. Technical motion checks did
not establish the required appearance. The approved artwork must retain its
painted/pixel texture, expressive face, hair, shading, garment construction and
recognizable detail in the final render. Abstract drawing primitives are not an
acceptable substitute for the actual source look.

Current milestone: source-derived raster surface/attachment proof for Green
cardigan standing South, compared directly with the immutable source. Establish
appearance before extending through motion or fitting Gray braid. Preserve the
approved master and existing unrelated work. Sol owns bounded renderer/source
investigation and subsequent assigned implementation; Astra owns raster asset
direction, visual acceptance, plan and integration review. Built-in ImageGen may
produce source-faithful material assets, but a generated complete posed sprite
alone is not proof of reusable mapping. No new per-character anatomy or motion.
Earlier technical completion notes below are historical; the visual result is
rejected, not pending approval. Source/master manifest pins were reverified at
the start of this retry. AGENTS.md and current dirty tree were reread.

Chosen implementation: sample immutable source pixels through semantic alpha
masks and a generic raster surface operation. Source UV coordinates describe
artwork only; approved master geometry owns target placement and silhouette.
Sol's next bounded milestone is Green South standing plus one moving pose,
source/neutral/fitted comparisons, provenance hashes and raster validation.
Astra will inspect the standing appearance before assigning broader coverage.

First raw-pixel standing proof reviewed: facial and cardigan identity is retained,
but appearance is not accepted. Findings returned to Sol: over-wide head crop
leaves a neutral halo, hair mask duplicates skin, vertical limb donors are mapped
with the wrong UV axis, segment endcaps expose flat bases, shoulder seams need
coverage. Correct source coordinate orientation and coverage without changing
master joints or anatomy. Do not broaden until the assembled proof is coherent.

Green South proof corrected and reviewed: tight face UV removes inner skull
outline; source-axis transpose plus edge extension covers limb joints; clean
source skin covers neck and knit underpaint covers shoulder corners. Root reran
raster validation: 18,141 exact source RGB checks, 17 assets, three deterministic
poses. Neutral parity remains 74/74. This is viable for extending, not owner
appearance approval. Sol next owns Gray South plus both identities' full South
walk/jump and standing/seated/clipboard, with stronger actual geometry/bounds
checks. Root retains visual acceptance before remaining directions and preview.

Gray South tight source-head crop reviewed and accepted for extension by root;
earlier broad crops were rejected for inset head/tan halo. Final crown, glasses,
warm face, charcoal coat, blouse, belt and braid retain source artwork. Braid is
head-front attachment; long coat panels are torso-back attachment. Sol is now
rendering all 19 South states for both identities before the next review gate.

South milestone reviewed; root reran validation successfully: 38 fitted frames,
48,850 exact source RGB checks, 19 actual approved geometry equality checks,
38 mutation/determinism checks, 76 actual attachment bounds, protected silver
hair. Target-derived coverCaps extends source edge pixels over rounded limb
ends. Sol now owns direction-specific E/W/N UV records for both identities and
the complete 73-state set, preserving accepted South artwork. Preview packaging
follows visual review of profile/back comparisons and full validation.

First E/W/N batch rejected by root: inset heads/tan halos, source neck stripes,
original source hands/arms bleeding into side torso/coat, broad braid mask.
Returned to Sol for tight head interior UVs, ears/hair-only attachments, clean
neck sample, cloth-only torso/coat masks, and protected light-hair extraction.
One corrected East proof must pass visual review before rebuilding all states.
Independent baseline check at this stage: all 163 approved baseline files match.

Direction sample gate now passed after root visual iterations: removed source
hands from thigh donors (not merely torso), added unmirrored head rasterPoint
for authored West images while retaining vector behavior, tightened braid masks,
preserved light hair, restored source profile moustache below nose. North now
retains original fringe/silver crown and central braid. Sol is doing one full
73-state rebuild/validation; root will review final action contact sheets.

Full raster milestone complete and independently revalidated by root: 171,926
exact source RGB checks, 73 actual approved geometry equality checks, 146
deterministic/unchanged-geometry fitted frames, 328 rendered attachment bounds.
Root visually checked side seated, West clipboard/jump and North jump in
addition to all direction samples. A tiny pale Gray West braid/neck edge remains
an owner-review item; do not call automated checks aesthetic approval.
Sol now owns new raster review build/browser validator and up to three inline
fragments. Preserve rejected vector review history; final widgets must load
actual raster costumes, source crops and approved neutral/guide assets.

Retry delivered for owner review: all three new source-faithful-character
fragments built below 1 MB with WebP80 character/guide atlases and original
source comparisons. Chrome validation: 73 distinct states per identity, five
pause/static checks, nine responsive checks (320/736/1024), three overlays,
eight source-direction checks, zero browser errors. Root independently opened
movement736 and jumping320, verified native comparisons, source direction
switching, exact pause and no overflow, and inspected final static screenshot.
Final 163-file baseline hash check passed unchanged. Sol implemented all retry
milestones; root reviewed code, visual iterations and independent validation.
No commit/push/deployment/gameplay integration. Owner aesthetic review is the
next action; do not broaden conversion yet. Remind owner to say "push to GitHub"
for a backup checkpoint. Older vector-completion entries below are historical.

## Goal and scope
Fit only Green cardigan (`patient.adult.046`) and Gray braid (`retained.gray-braid`, preview identity pending catalog confirmation) to the owner-approved canonical master. Deliver local native-scale source/neutral/overlay review for walking, standing, seated, jumping and clipboard actions. Owner review is required before any broader conversion or gameplay integration.

## Requirements and constraints
- Read `docs/handoffs/APPROVED_CHARACTER_SURFACE_FITTING.md` as the authoritative approval/source contract.
- Immutable source PNGs; retain approved palette, face, clothing details and hair identity. No source-sprite deformation or private anatomy/joint/head/foot fixes.
- Actual reusable local-coordinate surface artwork and named-anchor/depth attachments. Costume records cannot own motion or body transforms.
- Preserve approved master source and pixels, manifest hashes, all unrelated dirty work. No commits, pushes, dependency installation, deployment or broad roster work.
- Automated checks are technical evidence, not owner aesthetic approval.

## Repository baseline
2026-09-13, branch beta; extensive pre-existing dirty/untracked gameplay, clinical, graphics and tooling work. Initial status and approved source/artifact hash inventory recorded under `artifacts/character-movement/surface-fitting/baseline/`.
Approved manifest SHA256 verified before implementation:
- Walk: `c9ccf24da87a4f89e1f464a65819d205bf0b2930950f9c60105a64c6d618c309`.
- Actions: `915cc7a0501fb8df50f2a0e7b19304acbbadfa99b9243f2db796fe413fad7de9`.

## Decisions and ownership
Astra owns plan, scope, review, integration acceptance and handoff. Terra owns the initial read-only renderer/source inventory. One write-capable worker will own each subsequent bounded milestone; workers preserve others' edits and do not spawn agents or alter this plan.
Use an additive renderer under `tools/character-mapping/surface-fitting/`; preserve original renderer source pins. Reproduce their neutral operations and independently compare raster bytes across all 74 records before adding surface artwork. Shared helpers may retain master/action rendering differences required for parity. Costume records have no private anatomy or motion.

## Milestones and acceptance
1. Inventory: exact source files/catalogs/hashes and visual traits; renderer seams and neutral preservation strategy. Terra in progress.
2. Pipeline: reusable surface and attachment rendering with two costume records. Worker assignment follows inventory. Geometry must come exclusively from the approved master; preserve neutral raster output exactly.
3. Review package and proof: every approved pose for both identities, native-scale comparisons/overlay and exact pause controls. Validate pose hashes, rotated surface patterns, attachment depth/bounds, head/neck continuity and connected anatomy. Inspect actual rendered outputs independently.
4. Record technical findings and remaining owner review in current handoff; show local review artifacts. No broader integration.

## Validation
Run existing canonical master/action validators unchanged; compare all baseline hashes after implementation. Run focused new pipeline tests and preview browser tests with exact pause verification. Review all directions/actions through sheets and selected native frames; do not claim approval on behalf of owner.

## Review package design
One local self-contained HTML, default paused South standing, with both identities side by side at native render scale and a neutral reference. Five pose modes; standing is South only, other modes expose four directions; walk and jump have eight directly selectable phases plus play/pause. Mode/direction changes while paused must not resume animation. Static modes must not animate. Neutral overlay is selectable and geometry hashes are available in a technical details disclosure. Source sheets must be directly accessible and shown alongside mapped identity comparisons; source references may be cropped only for comparison, never used as deformable body artwork.
Keep this separate from gameplay and game origin/storage. Preview must be reviewable without running or modifying the game. Responsive layout should wrap cards without shrinking native canvases. Provide contact sheets spanning every pose family and source/neutral/fitted comparison, plus focused runtime checks of canvas bytes across pause/resume, mode/direction state, and overlay.

## Source visual review
Parent inspected both complete immutable sheets. Green: bald crown, white side fringe/eyebrows/moustache, dark expressive eyes, cream collar, sage V-neck cardigan with placket/buttons and cuff/hem ribbing. Gray: center-part silver strands, rectangular black glasses, warm older face, cream blouse/belt buckle, charcoal long open coat with pockets/tails. Gray braid is viewer-right in South, centered on North, behind the head in lateral views. These are surface/attachment traits; they do not authorize source body proportions or pose reuse.

## Progress / next action
- Handoff and repository instructions read; dirty tree inspected; both approved manifest hashes match.
- Terra inventory complete; no files changed. Existing validators independently passed (34 master records and 40 action records).
- Source hashes: Green `fa38e9e41e85bd96b85338b6c747c580ae68cdd9af48e9f16cf49478d3c4fd63`; Gray `1368999e0dbd28c250fd41c2a5ab97bcb8905de71862e4cdbfc3d75a6b4b62e4`. Exact source paths as in handoff. Gray runtime identity remains unresolved; keep retained preview ID.
- Terra's initial implementation draft rejected on root inspection: it called original renderers and painted over completed sprites, did not use its attachment metadata, and lacked neutral/geometry/rotation validation. Terra stopped; no approved files altered.
- Sol (`surface_pipeline`) now owns correcting/replacing the draft core renderer/data/tests as a difficult bounded escalation. Root requires independent neutral parity and actual data-driven local surface/attachment rendering before review packaging.
- Root independently compared Sol's new no-costume renderer against every actual approved PNG via canvas RGBA arrays: **74/74 exact parity passed**. This executed the new renderer, with no original renderer import/shortcut.
- Root code review found line-path clipping, unrotated rectangle mapping and un-clipped hand/foot artwork; Sol corrected those. Fitted profile nose contour and full source hairstyle are additional review points. Await all-frame fitted tests and samples before accepting milestone 2.
- Root independently ran `node tools/character-mapping/surface-fitting/validate-surface-fitting.mjs`: PASS, 74 neutral records, 148 deterministic fitted raster hashes, 74 approved geometry hashes shared by both costumes, 148 no-mutation/connectivity/margin checks, 12 isolated rotated surface checks and 296 actual attachment-bound traces. Source/manifests match pins.
- Visual iterations corrected hair crossing the eyes (attachment local-coordinate error), missing back hair coverage, and braid mass/strands. Source identity fidelity remains owner review, not automated acceptance. Sol is finishing formatting and refreshed samples; next milestone is the interactive five-mode review.
- Milestone 2 accepted technically after Sol handback and root code/native sample inspection. Renderer has no original renderer imports or identity branches; profile nose belongs to shared renderer. Root re-ran original master/action validators successfully and verified **all 163 baseline source/artifact files unchanged**.
- Terra (`fitting_review`) owns new review builder/validator files, `review/` artifacts and thread visualization output for milestone 3. Core renderer/costume files are read-only during packaging. Required UI proof: 73 visible states (the redundant original master sitting South remains in the 74-record technical proof), both costumes, native scale, source comparison, neutral/guide overlay and exact pause.
- Terra preview draft rejected: stopped animation timer, center-line placeholder mislabeled geometry overlay, missing source comparisons/geometry hashes/contact sheets, quality-30 encoding and no successful browser validation. Draft is not an accepted review artifact.
- Sol now owns correcting preview packaging. Parent verified installed Chrome path and encoding sizes; authorized two focused inline fragments (walk/standing and actions), each showing both identities, to retain quality >=80 and actual guides/sources within the 1MB-per-fragment limit. Core/artwork remain read-only. No publication or game-origin change.
- Root visually inspected all 18 complete motion/static sheets (146 fitted poses) plus both four-direction source crop strips. No obvious clipped hair, detached feet, stray pixels or depth anomalies found; owner aesthetic approval remains pending.
- Root independently verified all 73 raw guide PNG hashes match the approved guide PNG hashes exactly.
- Full actions plus neutral/guides still exceed the inline size cap at quality 80. Final packaging decision: three compact reviews (walking/standing, jumping, sitting/clipboard), each with both identities and real neutral/guide comparisons; shared source references in walking/standing. Preserve native scale and quality instead of further reducing fidelity.
- Root independent Chrome verification PASS on the three fragments: 73 states (33 movement, 32 jumping, 8 sitting/clipboard), both fitted canvases distinct, native CSS dimensions, exact RGBA pause and status for 450ms, no resume jump at 70ms followed by advancement, real guide overlay changes both canvases, neutral comparison panel, expanded disclosures without overflow at 320/736/1024, zero page errors.
- Root browser screenshots captured and inspected: `review/root-movement-736.png`, `review/root-jumping-736.png`, `review/root-statics-736.png`. Final persistent worker validator/report and cleanup of rejected draft remain before handoff.
- Milestone 3 accepted after Sol handback and independent root `validate-review.mjs` PASS: 73 distinct states for each identity, exact pause/resume/static checks, 3 real guide overlays, 8 source-direction comparisons, all 9 group/width checks (320/736/1024), zero browser/console errors. Final fragment sizes: movement 881482, jumping 833629, statics 191901 bytes, each below 1MB. Atlases quality 80, 292 lossless raw PNGs and 21 contact sheets retained.
- Rejected single fragment and stale draft assets removed. Root inspected the full sheets, source strips and browser screenshots. Handoff updated; technical implementation and review packaging complete. **Next action: owner aesthetic/identity review only.** No broader batch, runtime integration, production Gray ID assignment or push authorized. All work remains local/uncommitted.
