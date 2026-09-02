# GamifySurgery ComfyUI workflows

These are canonical, graphics-only ComfyUI UI workflows for the user-managed
Cortan instance. They are deliberately local repository copies: importing a
workflow is an operator action, and this directory contains no code that
uploads, overwrites, queues, or deletes anything on Cortan.

## Workflows

- `GamifySurgery - Pixel Art Sprite Starter v2.json` is the versioned copy of
  the existing SDXL/pixel-art starter. It keeps the 1024-to-128
  `nearest-exact` finish, fixes the BiRefNet foreground-alpha connection, and
  writes a separate foreground-mask QA PNG.
- `GamifySurgery - Incremental Asset Edit Qwen v1.json` follows the official
  Comfy-Org Qwen Image Edit 2511 edit topology, adapted only to Cortan's
  installed INT8 model filenames. It accepts a current asset, two optional
  reference images, and a separate edit mask. Its final composite takes every
  pixel outside the edit mask from the current asset.

Both canonical graphs use fixed seeds. Change a seed only for a deliberately
recorded managed candidate, then preserve that seed in the review record.

## Operator workflow

1. Import a versioned JSON as a *new* workflow; do not replace the user's
   original `Pixel Art Sprite Starter.json`.
2. For Qwen, set **Current asset** and choose the white-on-black **Edit mask**.
   The canonical baseline is source-only: its optional reference loaders are
   deliberately disconnected and have no effect.
3. For a managed multi-reference run, Sol connects each enabled reference to
   the matching `image2` or `image3` port on **both** positive and negative
   `TextEncodeQwenImageEditPlus` nodes. Do not connect a reference to only one
   encoder. Keep the mask tight around the approved change.
4. Keep the source asset and its Qwen composite at the same canvas dimensions.
   The composite uses the generated image only under the edit mask and the
   source image everywhere else.
5. Review both `GamifySurgery/.../result` and
   `GamifySurgery/.../foreground_mask_qa` outputs. Reject transparency halos,
   unintended edits outside the mask, non-pixelated scaling, and style drift.
6. Place only an explicitly accepted transparent PNG in the repository's
   designated graphics-review folder. Do not replace game raster assets during
   a generation session.

Room shells, floor tiles, wall and door seams, collision, depth ordering, and
other map geometry stay renderer-native. These workflows are for modular
raster assets such as furniture, props, character variants, and transparent
cutouts—not for changing the game map or its systems.

## Local validation

Run:

```powershell
node tools/comfyui/validate-workflows.mjs
```

The validator is offline and deterministic. It verifies JSON graph integrity,
expected node classes and model filenames, fixed seeds, direct foreground
alpha, output prefixes, mask-bounded Qwen compositing, and the intended
distinction between the two workflows. It does not contact Cortan or queue a
generation.
