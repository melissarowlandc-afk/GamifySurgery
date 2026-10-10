# Frozen 3×3 layout stand-ins

`layout-prepaint.json`, seven plain stand-in canvases, `manifest.json` and
`route-receipt.json` were written before any of the five-tier painting.
They prove the 12 one-tile doors and shared founder/visitor seating geometry.
These sources are preserved byte-for-byte.

The three `layout-*.png` views and two foreground PNGs are a later native replay
of the frozen plan, including the real south-facing founder and north-facing
visitor. They are geometry evidence, not painted art or browser screenshots.

```text
node tools/room-design/level-5/founders-office/stand-in/v2/render-frozen.mjs
```

Replay uses the actual proof renderer with temporary in-memory stand-in exports;
it does not overwrite the active painted proof. The final art-fit corrections
are in `../../layout-reconciliation-v2.json`. All tiers share those corrections;
chair floor/seat anchors and doorway ownership remain fixed.
