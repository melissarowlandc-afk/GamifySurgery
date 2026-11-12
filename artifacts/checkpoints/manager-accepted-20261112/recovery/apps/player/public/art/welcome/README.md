# Welcome entrance

Owner-selected artwork, November 2, 2026: **Spring Morning with the Lantern Evening founder (01b)**. The two compositions share one alt description and palette in [manifest.json](manifest.json).

- `spring-morning-portrait.png`: 941 × 1672, for viewport aspect ratios at or below 1:1.
- `spring-morning-landscape.png`: 1672 × 941, for wider viewports.

These are losslessly recompressed PNGs at their original native dimensions. RGB pixels are identical to the selected originals. No cropping, resizing, palette quantization or artwork changes were applied. Only the matching composition is preloaded; no additional phone download or new image dependency is needed.

`WelcomeArtwork` selects the composition with native `<picture>` media queries and uses `object-fit: contain` and pixelated scaling. The loading layout reserves the quiet lower band for the shared opening wordmark, status and progress. Form and campaign panels use opaque cream surfaces and dark olive text.

Compact sign-in/campaign headers fill their entire width and clip only the quiet bottom band. The manifest records the crop boundary: 1260 of 1672 portrait pixels, 780 of 941 landscape pixels. Founder, doors and receptionist remain above those boundaries. Campaign entry uses portrait for tall narrow viewports (width <=600, height >=840, aspect <=0.47); smaller phones and desktop use landscape so normal campaign controls fit. Sign-in/setup always use the shallow landscape header to leave more room for the form. These are CSS crops; shipped PNG pixels/dimensions are unchanged. Loading screens retain their full composition and viewport-based selection.

To replace the artwork, update the paths, native dimensions, byte counts, hashes, alt text and palette in the manifest, plus the matching media-specific preload links in `index.html` and `cloud-saves-qa.html`. The asset tests check that these remain aligned. Keep the people and doorway above the lower copy band; the current loading layout extends the full image into that band by 30% of its scene row in portrait and 20% in landscape.
