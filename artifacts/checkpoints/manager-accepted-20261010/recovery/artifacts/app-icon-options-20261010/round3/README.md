# Stitchin' Time - Round 3 app-icon concepts

Five open-door storefront variants requested on October 10, 2026. Concept art only.

- `icons/`: R3-01 through R3-05, 1024x1024 opaque RGB PNGs.
- `preview-60/`: matching 60x60 PNGs.
- [Contact sheet](contact-sheet.png): all five at 180 px, plus every icon at actual 60 px on dark and light Home Screen backgrounds.
- [Options](options.json): numbers, slugs, short names, concepts and variant treatments.
- [Generation index](receipts/generation-index.json): raw/final hashes and processing records.
- [Prompt set](receipts/prompts.json): exact built-in image-generation requests.
- `receipts/tool/`: five full generation receipts with timestamps, inputs and default source paths.
- `receipts/generated/`: all five unchanged original generated PNGs.
- [Reference provenance](receipts/reference-provenance.json), [visual review](receipts/visual-review.json) and [validation](receipts/validation.json).

| ID | Name | Framing | Lighting | Background |
| --- | --- | --- | --- | --- |
| R3-01 | Warm Welcome | Straight-on facade; awning and paired beds | Daytime | Warm teal |
| R3-02 | Open Office | Close straight-on entrance; flat cornice | Warm daytime | Deep green |
| R3-03 | Golden Frontage | Slight left-angle facade; awning and paired beds | Golden hour | Cream |
| R3-04 | Late Light | Close straight-on entrance; one flower bed | Evening, glowing interior | Deep green |
| R3-05 | Teal Threshold | Close slight right-angle entrance; one flower bed | Daytime, warm interior | Blue-teal |

**Strongest pick: [R3-04 - Late Light](icons/R3-04-late-light.png).** The golden open doorway stands out against deep green and points directly to the visible desk and computer at 60 px.

The reference boards use the approved frontage-v2 flower beds, paving and entry inset; the environment wall and doorway sprites; and the approved Front Desk v4 room with the actual cream-topped teal desk, computer, phone, clock, cabinet, plant and blue cooler. The front elevation, outward-open door and optional awning are owner-requested concept interpretations of those assets. They are not runtime building assets.

All five images were created with the built-in image-generation tool, one call per variant. Existing Python 3.12.10 and Pillow 12.3.0 were used to normalize a 256 px pixel grid, preserve the generated RGB palette, fit the artwork within the central approximately 80%, and export with nearest-neighbor resizing. No transparency, rounded corners, icon text or people.

Rebuild and verify locally:

```powershell
python artifacts/app-icon-options-20261010/round3/build_artifacts.py
```

All changes are contained in this Round 3 folder. Earlier rounds and studied game sources are hash-verified unchanged. No app integration or Git operations were performed.
