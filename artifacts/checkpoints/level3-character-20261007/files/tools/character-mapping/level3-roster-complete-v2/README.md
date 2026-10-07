# Level 3 roster-complete v2

This is an additive staging package. It never writes runtime assets or the runtime registry.
Artist input for each selected identity is exactly `sources/NNN/source.png`,
`exact-prompt.txt`, `tool-args.json`, and `provenance.json`. The PNG is a transparent 2×4
sheet ordered standing S/E/W/N then seated S/E/W/N. All sidecars are exact source evidence.
`reference-contract.json` pins the pilot's accepted staff/patient style sheets and its
immutable standing Mark source; they are references, never identity donor material.

`capture-runtime-baseline.mjs` pins the current 153 identities and 1,254 registry assets.
`build-pilot.mjs` packages only 001 after its new eight-pose source appears. It imports the
immutable GS026 extractor, uses alpha 13 only for analysis, and normalizes complete extracted
crops to 160×320 without painting, mirroring, cleanup, or alpha rewriting. Native PNGs remain
byte-for-byte preserved; normalized images are explicitly recorded as derived resampling.
Seated contacts are intentionally provisional until parent-authored and visually reviewed.

`provenance.json` must contain `nativeOutput.path`, `nativeOutput.sha256` (equal to
`source.png`), and `references`, an array of `{path, sha256, role}` records. When a selected
source replaces an edit target, its reference must also record `preservedCopyPath` to the
immutable prior PNG; that copy's bytes must equal the recorded reference hash. `tool-args.json`
must contain the exact `prompt`, `transparent_background: true`, and
`referenced_image_paths` in exactly the provenance-reference order. The pilot refuses alternate
filenames, missing fields, invalid JSON, source/reference hash mismatches, or clipping.

`build-roster.mjs` uses the same checks for all configured sources. It packages only complete
adult source bundles, records exact failures and missing sources in `staging-registry.json`, and
produces per-identity transparent/light/dark proofs, contact grids, and a local gallery. The
future pediatric IDs 021–032 carry editorial target heights only; they are blocked from
normalization until the younger-child pilot receives root review. `validate-roster.mjs` validates
each staged package. Its `--require-complete` mode deliberately fails when any of 32 identities,
source records, or seated contacts remain pending. Neither tool writes runtime art or a registry.
