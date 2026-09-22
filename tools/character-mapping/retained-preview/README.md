# Retained preview packaging

`build-retained-preview-atlas.mjs` reads a mapping manifest, validates that its
frame paths stay inside the manifest directory, and packs each character/phase
row into a clean-color atlas plus an alpha-only guide atlas. It never writes
to the source-art directory.

`manifest-adapter.mjs` accepts the current top-level East/walk manifest and a
future explicit `directions.<direction>.<mode>` payload. It rejects absent
clean frames or independent guides. The in-thread fragment has a
`previewContract` object; rebuild the atlases and add a control only after the
adapter returns a genuine direction or still-pose payload. Do not synthesize
missing frames, directions, or poses.
