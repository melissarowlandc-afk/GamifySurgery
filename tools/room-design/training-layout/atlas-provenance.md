# Training room proof asset provenance

The isolated proof uses candidate GS-015 source assets generated with built-in image generation, pending owner review, without repainting or non-uniform scaling. Original PNGs and exact prompts are in `Photos for Codex 2/Codex Rooms 2/GS-015/`.

- `training-bench-01.png` with `training-bench-01.prompt.txt`: two-person cream training bench, teal practice mats, training arm, suture pad, and open knee bays. The proof registers the physical foot span at source x `180..1260`, ground near `(723,950)`, and front worktop edge near y `495`. At 204 px physical base width, the measured ground-to-worktop rise is about 85.94 px.
- `training-decor-01.png` with `training-decor-01.prompt.txt`: combined cabinet/anatomy model, hand-and-heart whiteboard, and graduation-cap skeleton. They remain cosmetic illustrations and make no clinical claims.
- Exact approved Examination rolling stool crop from `examination-props-01.webp`: source atlas zone `(322,69,586,426)`, 264 px source width, rendered at 60 px. Ground `(462,426)` and seat `(462,203)` preserve a 50.68 px seat rise.

`pack-assets.py` crops only transparent margins, preserves alpha and aspect ratio, and records source bounds and contacts in `training.json` and `sprite-config.json`. `training.webp` is a technical preview atlas, not a runtime asset.
