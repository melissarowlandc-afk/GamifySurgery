# Gift Shop art provenance — density revision

**Eight new built-in imagegen calls, thirteen selected objects total.** The five v1 originals remain byte-identical. All eight additions were generated after the v2 neutral-layout freeze. No API/CLI generation, purchases, installs or external artwork. Original transparent PNG bytes and alpha are intact. Exact prompts and actual input/output-hint receipts are pinned by SHA-256 in [generation-manifest.json](generation-manifest.json). New prompt set: [prompts/v2/catalog.json](prompts/v2/catalog.json); original prompt set: [prompts/v1/catalog.json](prompts/v1/catalog.json).

| Item | Classification | Original | Exact prompt | Prepared |
| --- | --- | --- | --- | --- |
| Flowers and balloons | necessary | [PNG](originals/v1/base-flowers-01.png) | [Prompt](prompts/v1/base-flowers-01.prompt.txt) | [PNG](processed/v2/base-flowers.png) |
| Plush toys and boxed gifts | necessary | [PNG](originals/v1/base-plushShelf-01.png) | [Prompt](prompts/v1/base-plushShelf-01.prompt.txt) | [PNG](processed/v2/base-plushShelf.png) |
| Cards, magazines and snacks | necessary | [PNG](originals/v1/base-cardRack-01.png) | [Prompt](prompts/v1/base-cardRack-01.prompt.txt) | [PNG](processed/v2/base-cardRack.png) |
| Self-service checkout | necessary | [PNG](originals/v1/base-checkout-01.png) | [Prompt](prompts/v1/base-checkout-01.prompt.txt) | [PNG](processed/v2/base-checkout.png) |
| Cheerful flower print | optional | [PNG](originals/v1/base-wallArt-01.png) | [Prompt](prompts/v1/base-wallArt-01.prompt.txt) | [PNG](processed/v2/base-wallArt.png) |
| Flower cooler | optional | [PNG](originals/v2/base-flowerCooler-01.png) | [Prompt](prompts/v2/base-flowerCooler-01.prompt.txt) | [PNG](processed/v2/base-flowerCooler.png) |
| Greeting-card spinner | optional | [PNG](originals/v2/base-cardSpinner-01.png) | [Prompt](prompts/v2/base-cardSpinner-01.prompt.txt) | [PNG](processed/v2/base-cardSpinner.png) |
| Round flowers and teddy display | optional | [PNG](originals/v2/base-roundTable-01.png) | [Prompt](prompts/v2/base-roundTable-01.prompt.txt) | [PNG](processed/v2/base-roundTable.png) |
| Entrance balloon bucket | optional | [PNG](originals/v2/base-balloonBucket-01.png) | [Prompt](prompts/v2/base-balloonBucket-01.prompt.txt) | [PNG](processed/v2/base-balloonBucket.png) |
| Right-side magazines and snacks | optional | [PNG](originals/v2/base-snackShelf-01.png) | [Prompt](prompts/v2/base-snackShelf-01.prompt.txt) | [PNG](processed/v2/base-snackShelf.png) |
| Small plush bin | optional | [PNG](originals/v2/base-plushBin-01.png) | [Prompt](prompts/v2/base-plushBin-01.prompt.txt) | [PNG](processed/v2/base-plushBin.png) |
| Wall shelf of mugs and candles | optional | [PNG](originals/v2/base-mugShelf-01.png) | [Prompt](prompts/v2/base-mugShelf-01.prompt.txt) | [PNG](processed/v2/base-mugShelf.png) |
| Checkout floor mat | optional | [PNG](originals/v2/base-checkoutMat-01.png) | [Prompt](prompts/v2/base-checkoutMat-01.prompt.txt) | [PNG](processed/v2/base-checkoutMat.png) |

Necessary furniture isn't removed by doors. Primary displays, checkout and all four standing/queue spots stay; optional decor hides only for its owned sections. The flower print and mugs/candles shelf hide for their doors or north backing. The checkout mat is optional, flat and walkable, with no door owners. Every visible solid piece and its measured opaque base blocks walking.

Registered adult stills .007, .001 and .004 stand in the default scene; .006 proves the second queued shopper. Source bytes, runtime scale, body axis and floor anchors are unchanged. No shopkeeper, staff slot, seated pose, generated character or clinical content.

Prepared copies use the Executive's native Canvas toolchain: aspect-preserving crop/downsampling, nearest-neighbour rendering, transparent padding and alpha-below-8 cleanup. No source upscale, recolouring, semantic repainting or character editing. All delivered sprite edges are alpha 0.

The neutral geometry froze in stand-in/v2 before new generation. Two optional painted refinements are explicit in [layout-reconciliation-v2.json](../layout-reconciliation-v2.json): the plush bin moved to the upper-right where balloons do not obscure it, and the wall-shelf approach moved around that bin. Necessary piece coordinates and all four standing coordinates remain identical to v1. One fixed look follows room.gift_shop appearanceChanges=false; all five selections use identical assets.

Native/geometry/control/rebuild/HTTP checks are engineering evidence; browser QA and owner art acceptance remain separate. Approval is null; runtime integration is false. Full hashes, preparation measurements, still registrations and concurrent read-only reference changes: [provenance-v2.json](provenance-v2.json). v1 artifacts are historical.
