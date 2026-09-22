# Layered Green motion pilot

Local front-view prototype with an in-place walk, sit-down, seated hold and
stand-up. The head uses the original source pixels at rigid scale 1. Torso and
arms are independent; trousers are continuous through the knees. Pose-specific
seated arms and legs avoid forcing the standing artwork into a sitting outline.

This is not the final appearance or movement system: clothing is narrower and
has different detail from the source, and the switch into seated artwork is
still perceptible. Gray, other views, world travel and game integration remain.

## Files

- Exports and source/asset provenance: `artifacts/character-movement/layered-pilot/v6-motion/manifest.json`
- Reusable sampler and renderer: `tools/character-mapping/layered-pilot/green-rig-v6.mjs`
- Assets: `tools/character-mapping/layered-pilot/assets/`
- Motion review: thread visualization `green-layered-motion.html`

## Artwork provenance

Original source was preserved. New bitmap repairs used built-in ImageGen;
deterministic exterior background removal was explicitly authorized by owner.
Exact prompts are preserved at:

- `docs/execplans/layered-torso-edit-prompt.txt`
- `docs/execplans/layered-leg-edit-prompt.txt`
- `docs/execplans/layered-seated-leg-edit-prompt.txt`
- `docs/execplans/layered-seated-arm-edit-prompt.txt`

Corresponding saved replacements include `green-south-torso-arm-free-v4.png`,
`green-south-continuous-legs-v5.png`, `green-south-seated-lowerbody-v6.png` and
the seated-arm assets referenced by the export manifest.

## Validation and ownership

Sol implemented source extraction, artwork preparation, assembly and motion.
Parent reviewed code/contact sheets and independently ran the motion validator:
56 deterministic frames, rigid head throughout, support-center error at most
0.408 pixels, and exact sit/stand reversal and endpoints. Technical validation
is separate from visual acceptance.

Spark created the initial playback package; parent stopped that pass after it
did not return browser evidence and review found UI/context defects. Terra
completed the review fixes and browser verification; parent independently
reran the browser validator and inspected the final seated screenshot. All four
sequences, pause/scrub/play/speed/end behavior and 320/736px layouts passed, with
zero console or JavaScript errors. Fragment size is 741,497 bytes and its
embedded manifest matches the locked core export. No rate-limit claim was
made, and shared Spark availability was not changed.

All outputs are local. No original source/master files were overwritten and
no game atlas, deployment or GitHub push was performed.
