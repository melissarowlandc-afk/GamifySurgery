# GS-019 Blue direction pilot

This isolated local pilot preserves the owner-approved West candidate-v5. East
is an exact horizontal pixel mirror of those eight frames. North and South use
pinned complete-body donors with native-raster identity registration; the
outputs remain local approval candidates.

Run:

```text
node tools/character-mapping/gs019-blue-directions/build-east-mirror.mjs
node tools/character-mapping/gs019-blue-directions/validate-east-mirror.mjs
node tools/character-mapping/gs019-blue-directions/investigate-north-south-sources.mjs
node tools/character-mapping/gs019-blue-directions/build-north-south-draft.mjs
node tools/character-mapping/gs019-blue-directions/validate-north-south-draft.mjs
node tools/character-mapping/gs019-blue-directions/build-south-corrected-v2.mjs
node tools/character-mapping/gs019-blue-directions/validate-south-corrected-v2.mjs
node tools/character-mapping/gs019-blue-directions/build-south-corrected-review.mjs
node tools/character-mapping/gs019-blue-directions/validate-south-corrected-review.mjs
```

North/South source paths, hashes, standing-raster head matrices, and the eight
phase donor-sheet contract are recorded in
`artifacts/character-movement/gs019-blue-directions/source-reference/source-investigation.json`.

The North/South draft manifest, frames, authored complete bodies, proof, and
decoded-pixel validation report are under
`artifacts/character-movement/gs019-blue-directions/north-south-draft-v1/`.

The owner-authorized South proportion and native-neck correction is isolated in
`artifacts/character-movement/gs019-blue-directions/south-corrected-v2/` and
does not replace the earlier draft.
