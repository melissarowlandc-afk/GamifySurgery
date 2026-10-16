# GS-026 character stills and walking

## Goal and current scope
Recover existing art without disturbing approvals; owner has now requested an
audit of whether seated characters look larger than their standing counterparts,
and correction before integration if needed. No general walking production or
runtime integration is authorized by this audit.

## Requirements and constraints
- Preserve original assets, approved front identities, accepted lateral walks,
  sources, prompts, receipts and unfinished work.
- Distinguish source anatomy/proportions from runtime scaling and pose changes.
- Compare like directions; seated total height cannot establish anatomy scale.
- GS-025 owns runtime layering/pathing. Do not change runtime, rooms, saves,
  launcher, dependencies or publish anything.
- Working tree has substantial pre-existing modified/untracked work; preserve it.

## Milestones and ownership
1. Recovery completed read-only: Terra recover_stills inspected package coverage;
   parent inspected proofs and verified accepted motion hashes.
2. Seated proportion audit: Terra owns only new audit evidence/tools under
   artifacts/character-statics/gs026-seated-audit/ and
   tools/character-mapping/gs026-seated-audit/. Inspect GS018 (88 identities),
   employee20 and patient/public20 (40 more); parent inspects runtime scaling.
3. Based on evidence, scope corrective candidates without overwriting originals;
   owner explicitly authorized correcting ALL oversized older seated poses.
   Sol owns new tools/character-mapping/gs026-seated-correction/ and
   artifacts/character-statics/gs026-seated-correction-v1/ only. First milestone
   is complete older-roster triage and P01 four-direction correction pilot.
   Subsequent bounded batches follow parent visual acceptance of the method.

## Acceptance and validation
Audit must give explicit coverage, credible visual examples, source/scale cause,
affected/uncertain identities and limits. Measurements must not equate seated
bounding-box width or total height with anatomical scale. Use existing local
image tooling, source metadata and read-only hash checks; create only isolated
audit artifacts. Parent reviews actual evidence and any code before conclusions.

## Progress and next action
2026-09-24: recovered 704 GS018 cardinal views plus 30 clipboard views and two
160-view packages. Owner approvals and production QA remain distinct. Accepted
Blue v7/Navy v3/Brown v1 walking hashes match final handoff. Owner now flags
seated enlargement; historical GS015 notes confirm P01 source-head mismatch.
Next: delegate source audit and independently inspect runtime scaling. No art
replacement, integration, backup or deployment performed.

Parent runtime/source investigation: FacilityScene.drawPixelPerson uses
getAuthoredCharacterPresentationMetrics for bitmap poses; the current approved
room seat support and Front Desk paths return display scale 1. GS018 packages
remain separate from the runtime legacy atlas selection. Existing GS015
proportion-review/findings.md records P01 South standing head envelope 100x101
versus seated 118x105, West 91x98 versus 106x105, at equal display scaling.
These envelopes include hair/neck silhouette, not face-only measurements.
The GS018 builder calibrates generated patient seating from original seated
reference height, so a historical seated-reference mismatch can be inherited.
The employee/public sheet-wide uniform transform likewise cannot enforce equal
internal anatomy in independently generated poses. No blanket scale fix inferred.

Audit milestone complete: Terra recover_stills produced a bounded audit tool,
10 cohort sheets and a selected native-scale comparison under gs026-seated-audit.
Parent inspected tool implementation and all 10 sheets plus example proof,
requested matrix-scale/hash/count corrections, and independently reran builder:
PASS 128 identities, 512 pairs, 1024 source-pose hashes. Clear illustrative older
cases P01/P07/P10; further recurring GS018 concerns recorded in FINDINGS.md.
Newer cohorts appear more consistent, not certified anatomically exact. Existing
approvals remain intact. No canonical artwork or runtime changed. Next decision:
correction pilot against preserved standing references, then selected affected
poses; no blanket seated shrink. Audit is local, no push/deployment.

Owner direction: "fix all the stills for the characters that have seating poses
that are too large (the older ones". Correct GS018 affected seated poses only;
preserve all standing poses and unaffected seated poses byte-for-byte. Exclude
employee20/public20, runtime integration and walking. Build a replacement overlay
with stable identity/pose keys, source hashes, exact prompts, review status and
seat-contact anchors, retaining the original baseline. New art uses built-in
imagegen per skill; no CLI fallback or programmatic art redraw. Deterministic
extraction/packaging and proof assembly are allowed for generated outputs.
Required acceptance: like-direction head/torso size matches standing reference,
native proportions preserved, clean alpha/grounding, no clipped body or props,
all4 directions assessed, original hashes intact, full coverage disposition,
native/game-size visual review and validated replacement manifest. Parent
reviews actual tool/source diffs and visuals; owner approval is not fabricated.

Pilot completed by Sol seated_correction_pilot. Parent reviewed raw built-in
ImageGen source, native-light and game-dark comparisons and actual builder/
validator, then independently reran validation PASS (all704 baseline hashes,
P01 four replacements). P01 production method accepted by parent; owner visual
approval still pending. Sol batch1 now owns P07/P10/P12/P17/P18/P24 all4 seats,
with preserved P01 hashes and stronger source/bounds/contact validation.
Read-only Terra recover_stills independently reviews5 uncertain cases and5
possible missed cases; parent independently inspects native source proofs.
Initial triage22 affected/5 uncertain/61 preserve remains provisional until
that focused review. No baseline or runtime edits.

Focused review resolved all5 uncertainties as preserve; Terra additionally
checked F10/F24/P31/P32/P33, also preserve. Final scope22 corrected identities /
66 retained,0 unresolved; triage stores rationale. Sol batch1 completed
P07/P10/P12/P17/P18/P24. Parent reviewed6 native-dark,6 contact overlays,
finalP07/P18 native-light,6 game-light and actual implementation, independently
ran batch+pilot validators PASS. P07 final0.390/P18 final0.385; P12 unneeded East
bag variant rejected and original coherent source selected. P18 support is
inferred under long coat, not garment hem. Seven identities/28 corrected poses
production-reviewed, owner visual approval pending; originals preserved.
Next Sol batch2: P30/P37/P40/P44/P48/P49. Final batch follows for
F06/F07/F13/F15/F19/F20/F27 and mixedpatient01/02. Shared runtime untouched.

Batch2 completed and parent production-reviewed: P30/P37/P40/P44/P48/P49,
24 poses. Parent inspected all sources, native comparisons, contact overlays
and game-dark proofs; independently reran batch2 validator PASS and reviewed
its source-head measurement verification. P30/P49 initial guessed source-head
widths were corrected using recorded alpha-envelope bands (196 and180 pixels)
and scales0.357/0.372. These now match standing South head widths70/67.
13 identities/52 poses complete; owner visual approval pending. Sol now owns
batch3 final9 identities listed above with actual head-band measurements and
preservation of all52 prior replacements. Next milestone after visual acceptance:
complete coverage overlay, review gallery and preservation validation.

Batch3 production/review in progress: all9 raw sources created. Parent reviewed
all sources/native comparisons. F13 source order S/W/E/N is explicitly remapped
to canonical output S/E/W/N. Mixedpatient01 repeated background halos escalated
to parent built-in ImageGen with only immutable standing proof as reference;
selected v4 now clean, preserving failed sources. Parent reviewed support proofs
and requested independent mixed01 support re-authoring. F15/F20 tighter crown
bands corrected shoulder/earring contamination. F19/mixed02 final calibration
under review; measurements must include the complete intended hair/skull band,
without shoulder contamination. No alpha threshold alteration permitted.
Terra independently checked preservation:1024 original cardinal poses,
30 approved clipboard poses,48 accepted walking frames and3 accepted walking
manifest hashes PASS; read-only, no original files changed.

Batch3 accepted by parent production QA: all9 native comparisons,9 contact
overlays and9 game-dark proofs reviewed alongside all9 sources. F15 scale.347,
F19 .376 (141-pixel source skull to53 standing), F20 .376, mixed02 .330
(complete source hair215 to71 standing) resolved final calibration concerns.
Mixed01 support lowered to actual underside thigh/crotch; F13 remapping verified.
Parent inspected actual builder/validator changes and independently ran batch3
validator PASS, including52 frozen prior replacements. All22 identities/88 seated
poses production-reviewed; owner art approval pending. Sol now owns final
coverage overlay, review gallery, separate P01 anchor proof and preservation
validation. No further artwork generation planned; all88 replacements frozen.

Final packaging complete. Sol built complete-overlay-manifest.json and local
review.html,22-character SOUTH overview, P01 contact proof and browser screenshot.
Parent read actual overlay builder/validator/browser checker, requested fixed
input pins and full retained-pose metadata comparison, then reviewed fixes.
Parent reviewed overview and P01 guide; pilot guide was too high and now has
overlay-only sourceY S532/E531/W531/N531, with frozen pilot anchors retained.
No sprite bytes or historical correction manifests changed during packaging.
Independent parent validate-overlay PASS:88 identities/704 resolved cardinals,
88 corrected seats/616 baseline refs,30clipboards,320newer statics,48accepted
walking frames. Sol browser check22choices/88image states PASS/noerrors; parent
inspected screenshot and independently checked previous/next wrap plus480px
layout/contained native-image scrolling PASS. Pilot and all3batch validators PASS.
Owner review packet ready; art approval remains pending. No runtime, source
approval ledger, dependency, commit, push or deployment changes. All substantial
implementation delegated to Sol; Terra audited/verified preservation. Parent
handled planning/review/integration acceptance and the isolated mixed01 built-in
ImageGen escalation after repeated background failure. Local checkpoint only;
remind owner to say "push to GitHub" for an audited scoped backup.
Next action: owner reviews corrected artwork and chooses what to work on next.
