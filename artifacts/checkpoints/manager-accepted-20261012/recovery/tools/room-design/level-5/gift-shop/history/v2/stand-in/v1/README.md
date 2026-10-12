# Frozen prepaint Gift Shop

`layout-prepaint.json`, five neutral source PNGs, manifest and route receipt
were frozen before imagegen. No anchor/contact/footprint change followed art.
Prepaint engineering checks: 112 states, 1,152 routes, 72 full-queue routes.
`prepaint-occupied.png` and `prepaint-routes.png` use the actual native renderer.

Replay with the approved toolchain from repository root, then restore the
painted proof immediately:

```text
node tools/room-design/level-5/gift-shop/proof/build.mjs --stand-in
node tools/room-design/level-5/gift-shop/stand-in/v1/replay.mjs
node tools/room-design/level-5/gift-shop/proof/build.mjs
```

Replay writes separate files and leaves the original frozen sources intact.
Neutral images prove geometry only, not approved artwork. Do not rerun the
one-time bootstrap/configure/freeze records over the delivered room.
