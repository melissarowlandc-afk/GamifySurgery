# GS-022 employee-20 review package

This isolated tool prepares an owner-review packet for 20 new employee **front-standing concept candidates**. It does not generate, repaint, segment, or integrate artwork.

The owner-directed sources are the four `sources/sheet-N-v1.png` files, exact `prompts/sheet-N-v1.txt` files, and root `design-specs.json`. `package-employee20-source-sheets.mjs` discovers five visibly separated alpha-projection bands on each sheet; it never assumes equal grid cells. It preserves each original source, applies one uniform scale and translation per candidate, records SHA-256 hashes and source-boundary alpha evidence, then creates light/dark native, production, and enlarged review contacts.

Run the following in order from the repository root:

1. `node tools/character-mapping/gs-022-new-v1/package-employee20-source-sheets.mjs`
2. `node tools/character-mapping/gs-022-new-v1/build-employee20-owner-review.mjs`
3. `node tools/character-mapping/gs-022-new-v1/validate-employee20-candidates.mjs`

Packaging refuses missing or duplicate candidates, missing transparency, or clipped visible bounds. The owner-review step binds the design-spec and seven proof hashes. Validation requires all20 fronts at the reviewed0.375 uniform scale. Approval and the remaining seven poses per character stay pending.
