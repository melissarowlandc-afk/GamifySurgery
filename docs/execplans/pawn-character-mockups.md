# Pawn character mockups

Status: shelved by owner on 2026-10-03. Owner scraps the pawn idea and requests
advice on making existing full-body still movement feel more natural/game-like,
possibly increasing bounce. Preserve all exploratory images as history; none
approved. No further pawn generation or integration. Current runtime remains
3px/2Hz standing-still bounce; movement changes require subsequent direction.

## Goal and owner request
2026-10-03: Owner requests character-as-pawn mockups to explore pawn movement.
Deliver three visual design candidates based on accepted Blue Glasses identity,
not runtime assets. GS026 remains complete; standing plus bounce remains selected.

## Constraints and repository state
Shared beta worktree has extensive unrelated tracked and untracked work (522
status entries at orientation). Preserve all prior art, IDs, approvals and saves.
No runtime integration, walking experiments, room edits, clinical edits, push,
deployment or launcher changes. Canonical local origin remains 127.0.0.1:4173.
Use built-in imagegen, real transparency, exact submitted prompts and source hashes.

## Decisions and ownership
Astra owns concept direction, image generation and visual acceptance review.
Terra owns only additive packaging under artifacts/character-statics/pawn-concepts-v1/.
Three styles: classic chess pawn, rounded game piece, legless torso.
Each uses the same character in front and side views for direct comparison.
These are exploratory shapes; existing full-body atlas dimensions are not imposed.

## Milestones and validation
1. Inspect accepted source; generate three transparent candidates (Astra).
2. Save original output bytes, exact prompts, reference/output SHA256, dimensions,
   alpha inspection and candidate-only metadata; create a simple HTML still review
   with actual images at large and map size (Terra; no animation implementation).
3. Astra reviews actual images/files, records limitations and presents owner choices.
Human approval is pending; automated checks do not approve art. No source alteration.

## Progress and next action
- Orientation complete: handoffs, accepted pipeline and dirty tree inspected.
- Inspected accepted Blue Glasses South/East images; generated three candidates
  using built-in imagegen with transparent_background true and both references.
- Parent visually reviewed all three: classic plinth, compact rounded token,
  and torso with arms. Third has a rounded lower edge instead of a flat base;
  first/third show possible translucent edge glow. These are mockup limitations.
- Terra completed additive packaging: three original PNGs, exact prompts,
  reference/output hashes, alpha/dimensions and HTML review.
- Parent inspected manifest/HTML and independently verified all three copied PNG
  hashes against originals and manifest, plus all three exact prompts against
  submitted imagegen strings. All passed. Native outputs have real transparency
  but substantial partial alpha, including visible halos in 01/03; cleanup remains
  necessary before production use. No browser-render validation claimed.
- Owner choice and any movement trial remain pending; no new art approval.

## Owner revision — October 3
Owner dislikes all three initial shapes and requests the lower body extend
farther downward into a point, less pawn-like. Preserve v1 as rejected shape
exploration. Produce one front/side candidate with a longer tapered lower body
and softly pointed end, no pedestal/rim/wide rounded base; retain identity and
small arms. Astra owns imagegen and visual review; Terra owns additive v2
packaging at artifacts/character-statics/tapered-character-v2/ with exact prompt,
source/output hashes and candidate-only status. No movement or runtime changes.

Revision delivered: parent reviewed generated front/side silhouette; Terra saved
original output, exact prompt and provenance. Parent independently verified exact
prompt match and byte-identical PNG copy, inspected metadata. Soft point achieved;
diffuse halo remains a recorded production limitation. Await owner shape feedback.

## Softer exploration
Owner finds v2 too pointy and is unsure of final direction. Try one shorter,
gentler taper with a broad rounded end. Preserve all prior candidates. Astra
generates/reviews; Terra packages only soft-taper-character-v3 with original PNG,
exact prompt and provenance. No approval or runtime changes implied.

v3 delivered: parent visually reviewed softer lower end; Terra packaged original
PNG/prompt/provenance. Parent independently checked copy SHA256 against generated
original and exact saved prompt against tool input; both passed. Halo remains.
Await shape feedback; prior versions preserved. No movement integration.
