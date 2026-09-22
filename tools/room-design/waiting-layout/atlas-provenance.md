# Waiting Room display atlas

The owner-reviewed source is `Photos for Codex 2/Codex Rooms 2/GS-015/waiting-furniture-atlas-01.png` (1226 × 1283 RGBA), generated with the built-in image tool. Its exact prompt is preserved beside it as `waiting-furniture-atlas-01-prompt.txt`; the original PNG remains unchanged.

`pack-assets.py` finds the alpha ≥ 32 bounds inside the six parent-specified source regions, adds three transparent pixels around each crop, packs the crops without rotation, and writes `waiting-assets.webp`. The browser display atlas is WebP quality 88 with `exact=True`; it is a lossy preview encoding, not a lossless source. Sprites retain their original aspect ratios and semantic pixels. `atlas.json` records the source regions, crop bounds, atlas dimensions and threshold.

Furniture floor contacts use measured high-alpha object bottoms rather than the softer shadow bounds. The embedded preview records those source rows independently from image-bottom anchors so the sprite can extend above its physical footprint without treating the shadow as furniture depth.

## West-side view

The owner-reviewed west-view sources are `waiting-west-atlas-01.png` and the replacement `waiting-bench-east-02.png` in the same GS-015 art folder. Their exact prompts remain beside the PNGs. `pack-west-assets.py` uses alpha >= 32 bounds, adds three transparent pixels, substitutes the replacement east-facing bench for the atlas bench, and packs the four crops without rotation. `waiting-west-assets.webp` is a quality-88 lossy browser preview; the source PNGs remain unchanged. The preview keeps every sprite's source aspect ratio and uses separately recorded ground contacts rather than treating the shadow-inclusive image bottom as the physical footprint.

## Walkthrough actor

`pack-actor.py` takes identity 3, crop `(384, 0, 128, 192)`, from the current `apps/player/public/art/characters/patients-v1/patients-{front,back,left,right}-walk-{a,b}-v1.png` sheets. It packs only the eight walking frames into the lossless 256 x 768 `waiting-actor.webp`; no idle frame or character pixel is edited. The preview preserves the authored 1.35 x 2.025 tile frame envelope and registers route depth to the source feet anchor `(64, 181)`. This frame envelope includes transparent padding and is not evidence that the visible body, turns, or seated poses fit the proposed furniture.
