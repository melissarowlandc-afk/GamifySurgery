# Stitchin' Time Home Screen icon concepts

Generated October 10, 2026 with the built-in image_gen tool, one distinct generation per concept. These are review concepts.

- `icons/`: 20 opaque, full-bleed square 1024x1024 RGB PNGs.
- `preview-60/`: the same numbered filenames at exactly 60x60.
- `contact-sheet.png`: all 20 at 180px, with numbers and short names; two complete 60px rows on dark and light backdrops.
- `options.json`: number, slug, short name and one-line concept.
- `receipts/prompts.json`: the complete final prompt set and founder reference argument.
- `receipts/*-tool.json`: exact generation arguments, returned save-path receipt and available call timing.
- `receipts/01-*.json` through `receipts/20-*.json`: source/output hashes and processing steps.
- `receipts/generated/`: all 20 original generated PNGs copied byte for byte.
- `receipts/style-study.json` and `reference-hashes.json`: art direction, palette and source provenance.
- `receipts/validation.json`: machine-readable artifact checks.
- `HANDOFF.md`: worker findings and review notes.

The final icons have square opaque corners. Only the two small Home Screen rows in the contact sheet simulate a corner mask. Their 60px tiles are pasted at actual size.

Each final icon is a 64x64 logical pixel drawing enlarged 16x with nearest-neighbor. The generated subject is reduced into a 52x52 inner drawing to give iOS masking room. Game-palette quantization and solid backgrounds keep the set consistent. The founder uses nearest-neighbor reduction and an adaptive 32-color palette to preserve the existing character's skin, hair and eye highlights. The single-clock option also has disconnected generated background speckles removed.

The original built-in PNGs were 1254x1254; post-processing supplies the requested exact 1024x1024 deliverables. Python 3.12.10 and the already installed Pillow 12.3.0 were used.

Rebuild the contact sheet and rerun checks from the repository root:

```powershell
python artifacts\app-icon-options-20261010\build_artifacts.py finalize
```

Rerun verification only:

```powershell
python artifacts\app-icon-options-20261010\build_artifacts.py validate
```
