# Stitchin' Time bitmap art packs

This directory is reserved for original, transparent, independently rendered
pixel-art layers. It must never contain a flattened clinic screenshot or a
third-party game asset.

Future packs use paths such as `art/fixtures/front-desk.png`,
`art/characters/<appearance-signature>/<pose>.png`, and
`art/portraits/<appearance-signature>.png`. Their stable semantic IDs, native
dimensions, floor-contact anchors, and authored orientation metadata are
registered through `src/art/bitmapAssetManifest.ts`.

All files are resolved through Vite's `BASE_URL`, so use relative paths without
the GitHub Pages repository prefix. Missing files always leave the existing
procedural fixture/character renderer active.
