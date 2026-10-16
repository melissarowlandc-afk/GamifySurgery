# Five low-effort movement alternatives

Status: five previews and smaller/faster hop follow-up complete September29 2026. No runtime choice applied.

## Goal
Owner requests research into simpler movement in comparable games and five
animated mockups fitting existing art. Consider hopping, legless figures and
directional gliding; avoid generating walk cycles for every identity.

## Scope and repository state
Standalone review artifacts only. Preserve current game, approvals, rejected
walking work, stills, saves and concurrent GS025/028/029 work. No commit, push,
deploy or dependency install. Large shared dirty tree inspected. Owner game
pathway remains START_GAME.cmd -> http://127.0.0.1:4173 usual profile.
Prior local HTML browser opening was policy-blocked; do not route around that
block. Use direct image inspection and pure-code validation, report limitations.

## Ownership
Parent researches official game material, chooses five designs, reviews visual
fit and evidence, documents recommendations. Terra movement_alternatives owns
new tools/character-mapping/gs026-movement-alternatives/ and matching artifact
directory. No runtime files, source PNG changes or other workers' files.

## Five concepts
1. Directional glide: existing full-body still, steady translation.
2. Gentle rocking: shared small whole-body sway/bob; no leg animation.
3. Small hops: existing still rises over a grounded shadow; shared timing.
4. Legless pawn: existing upper-body art clipped into rounded pawn presentation.
5. Portrait token: existing portrait/upper body in a badge with direction marker.

These are code-native canvas presentation mockups, not new bitmap illustrations.
No ImageGen calls or new per-character animation frames are needed. Crop options
may need art-fit checks for unusual silhouettes; don't promise zero integration.

## Acceptance and validation
Five distinct animated options; same route, movement speed, identities and stops
for fair comparison; all four directions. Map and close-up controls, play/pause,
slow/normal, accessible descriptions. Existing art and style visibly retained.
Self-contained local HTML plus directly inspectable static PNG comparisons.
Verify deterministic route/motion, stop behavior, all assets resolve, HTML script
syntax, source hashes unchanged. Inspect produced images. No browser-playtest
claim unless actually performed through permitted tools. No need broad game tests
because runtime is untouched.

## Result and validation
Terra movement_alternatives implemented the shared renderer, builder, validator
and README. Five self-contained animated cards use12 existing standing PNGs
across three identities. Zero ImageGen calls and zero new character frames.
Research: `docs/reviews/gs026-movement-alternatives-research.md`.

Parent reviewed actual code and the overview, pawn/token close-ups and hop phase
images. Terra corrected grounding, waist crops, portrait position, overview
spacing, cardinal routes, stop envelope and pause/speed controls. Parent made
only a tiny final integration correction to snapshot dimensions and close-up
framing, then rebuilt and visually rechecked the result.

Worker25 invariant checks and Node syntax checks PASS. Parent independently
reran25 checks, checked every segment is cardinal, sampled equal-distance
travel speed, and parsed both embedded scripts. All12 source hashes match.
Direct image inspection and pure-code checks are not live browser playback
proof; no blocked browser workaround was attempted. Runtime is untouched.

Deliverable: `artifacts/character-movement/gs026-movement-alternatives/review.html`,
with `overview.png` and per-method map/close-up/phase PNGs alongside it.

Recommend glide for lowest effort and closest current style, or gentle rocking
for added life. Hopping is more playful. Pawn/token silhouettes need a coherent
seated presentation before integration. New identities still need their normal
stills/portraits, but no additional walking frames.

Next action: owner compares/selects an option; then scope runtime integration.
All earlier approvals, unfinished walking and stills remain preserved. Local
checkpoint only; no commit, push or deployment.

## Smaller step-bounce follow-up
Owner prefers the soft hop direction but requests smaller and more frequent
hops, approximately one little bounce per step. Terra movement_alternatives
owns a focused new comparison preview: original12px hop beside a3px/2Hz
continuous step bounce, with height/tempo controls. Preserve the original
five-way review and source art. Shared whole-body transform only, no new frames
or runtime changes. Validate lift range, cadence, stop envelope, script parsing
and source/old-review preservation; parent reviews code and static evidence.

Follow-up complete: `artifacts/character-movement/gs026-movement-alternatives/hop-review.html`.
Terra implemented isolated hop renderer/builder/validator; parent reviewed code
and `hop-compare.png`, reran24 focused checks and independently verified sampled
0..3px lift,2Hz period, old review hash and embedded script parsing. Parent made
one tiny close-up camera adjustment before rebuilding. Full cosine arcs replace
the earlier half-cycle gliding; height1..6px/tempo1..3Hz controls are included.
No runtime/source art changes, no new animation frames. Browser playback was
not verified. Owner review of the smaller step-bounce is next.
