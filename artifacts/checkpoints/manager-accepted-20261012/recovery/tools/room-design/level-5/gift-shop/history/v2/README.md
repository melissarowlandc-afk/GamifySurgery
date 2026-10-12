# Gift Shop — busy 3 × 3 self-service proof

Review: <http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html>

`room.gift_shop` does not enable `appearanceChanges` in `packages/balance-config/src/room-upgrades.ts:51–53,97`. **One fixed look** remains at upgrades 1–5, matching the catalog and owner direction. The five Executive-style selectors prove identical art/anchors and preserve inspection settings. No stock, income, demand or balance behavior is simulated.

**Necessary furniture isn't removed by doors.** The four functional pieces (checkout and three primary displays) and all four standing/queue spots stay for every door or backing combination. Characters path around visible furniture. Optional decor may hide for its declared door sections; wall items also hide for north backing. The mat is optional and walkable, so it has no door owners.

Eight additions fill the side/front areas with stock: cooler, card spinner, round flowers/teddy display, entrance balloons, right magazines/snacks, plush bin, wall mugs/candles and checkout mat. Thirteen objects total. No shopkeeper; default adults browse/pay/wait, and a fourth stand-in proves both queue slots. All stills and necessary coordinates are unchanged.

Every one-tile section is a legal door. The page's item table identifies each necessary/optional piece and its exact hiding sections. Routes respect visible footprints, measured bases, other shoppers and the 0.18T actor radius. Six necessary contacts and up to seven optional browsing contacts; queue advancement waits for the next spot to clear. One fixed appearance with five inspection selections.

Current sprites/freeze/evidence are **v2**; v1 is historical. [Art provenance](assets/provenance.md), [item list and exact validation](WORKER_HANDOFF.md), [neutral freeze](stand-in/v2/README.md), [optional painted refinements](layout-reconciliation-v2.json). Same Executive/Founder native Canvas toolchain; no dependencies added.

Run from repository root:

```text
node tools/room-design/level-5/gift-shop/proof/build.mjs
node tools/room-design/level-5/gift-shop/proof/validate.cjs
node tools/room-design/level-5/gift-shop/proof/validate-controls.mjs
node tools/room-design/level-5/gift-shop/proof/inspect-native.mjs
node tools/room-design/level-5/gift-shop/proof/reproduce.mjs
node tools/room-design/level-5/gift-shop/proof/check-helpers.cjs
node tools/room-design/level-5/gift-shop/proof/check-http.mjs
node tools/room-design/level-5/gift-shop/assets/write-provenance-v2.mjs
node tools/room-design/level-5/gift-shop/proof/audit-lane.cjs
```

Worker Chrome launch fails `spawn EPERM`. Manager runs `proof/validate-browser.cjs` and `proof/capture.cjs` from this same folder via Node. Native views are engineering inspection; approval remains null. Construction bootstrap/configure/revise/freeze/reconcile scripts are receipts, not supported rebuild commands. Use `proof/build.mjs` for painted rebuilds.

Use the existing room-lab server on port **4191** and the exact URL above. The proof has no campaign storage. Gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the intended persistent profile. Saves do not transfer to 4191; no server or launcher change.

Only this folder and the assigned Gift Shop plan section are writable. Local only; manager owns acceptance and the “push to GitHub” reminder.
