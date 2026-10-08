# Exterior frontage v1 source kit / runtime frontage v2

Original project artwork, generated with the built-in image_gen tool on
2026-10-08 for manager-authorized Option B. No CLI/API credits or purchases.
Concepts informed art direction only; no concept pixels were extracted.
Existing room and tree artwork is untouched. Manager visual acceptance pending.

After manager browser review, the active beds are the fuller v3 variants in
[refinement-20261008](refinement-20261008/README.md). That folder retains the two
new built-in edit originals, exact prompts, hashes and before/after proofs.
The original eleven-piece v2 kit below is preserved byte-exact; the active
manifest binds v3 beds plus its other nine v2 assets. Use the refinement's
export_beds.py for current beds; this base exporter reproduces reviewed v2 art.

The 11 exact submitted prompts are in prompts/ and untouched generated PNGs
are in originals/. provenance.json records source/export/prompt SHA-256 hashes,
native dimensions, anchors, measured alpha bounds and deterministic exports.
Run `python tools/exterior-frontage-v1/export_art.py` from the repository root
to reproduce exports. Crops/resampling preserve source proportions and alpha;
the script never paints artwork. Runtime files are in
apps/player/public/art/environment/frontage-v2/.

| Piece | Native size | Anchor | Runtime size |
| --- | --- | --- | --- |
| West/east planted stone beds | 512×160 | (256,160) | 1.55T×0.484375T; contact at sidewalkTop+0.50T |
| Sage/olive lawn overlays | 256×128 | (128,64) | Broad 3–6T pockets, low opacity |
| Low/clover/upright grass clusters | 64×32 | (32,28) | 0.3–0.6T wide, uniform scale |
| Joint-free paving material | 128×128 | (0,0) | World-anchored material under procedural joints |
| Curb A/B strips | 256×16 | (0,0) | 0.12T high, uniform scale, repeated/cropped |
| Flush warm-stone entry inset | 128×64 | (0,0) | 1T×0.5T, ground layer |

The bed pilot was inspected before generating the remainder. The reproducible
proof in proof/bed-reduction.png includes actual reduced pixels and magnified
inspection copies at T=24,41,37,27,20,7. Zoom-derived values use the declared
offline 920×325 canvas / 64×40 synthetic site and existing renderer formula.
Live browser QA must record actual tileSize, DPR, browser zoom and origin.
The rim, dark planted/soil band and shaded face remain distinct at ordinary
zoom-out; tiny petals are secondary. Minimum zoom preserves site scale.

Curb source A includes faint generated alpha debris outside the actual strip.
The exporter selects only its opaque continuous central band, without painting
or alpha replacement. The originals remain byte-exact. Both exported curbs
have a pale cap and soft shaded face, with no black street strip.

Owner pathway unchanged: START_GAME.cmd → http://127.0.0.1:4173 in the same
persistent profile. This pack and implementation remain local until an audited
manager checkpoint. No Git, installs, browser or owner storage were used.
