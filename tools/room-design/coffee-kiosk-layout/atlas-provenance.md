# Coffee Kiosk proof asset provenance

This isolated presentation proof uses candidate GS-015 artwork generated with built-in image generation. The originals and their exact prompts remain unchanged in `Photos for Codex 2/Codex Rooms 2/GS-015/`; this is not runtime artwork and remains pending owner approval.

- `coffee-island-01.png` with `coffee-island-01.prompt.txt`: one permanent cream-and-walnut coffee island with burgundy espresso machine, cups, plant, and condiments. The pack registers physical feet x `280..1000`, floor contact `(627,1155)`, and front countertop edge y `660`. The 720 px physical foot span is uniformly rendered at 120 px, yielding a measured 82.5 px counter facade rise.
- `coffee-wall-art-01.png` with `coffee-wall-art-01.prompt.txt`: two cosmetic framed wall prints, `DEJA BREW` and `JAVA GOOD DAY`. The atlas splits them at x `887`; each is wall-only, with no movement or clinical effect.

`pack-assets.py` only crops transparent margins, preserves alpha and uniform aspect ratio, and records technical crop bounds and contacts in `coffee.json` and `sprite-config.json`. `coffee.webp` is a technical preview atlas, not a runtime asset.
