# Level 5 Gift Shop — isolated room-first mockup

Open [the proof](http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html) on the existing manager room-lab server (port 4191). One cohesive full-room concept is beside the interactive 3×3 design. Owner approval is pending.

The catalog disables appearance changes, so upgrades 1–5 show one fixed look. One necessary joined island contains the checkout and main display; ten optional records form adjoining stocked walls, an entrance endcap and the mat. Necessary furniture isn't removed by doors. All twelve wall sections are legal; optional segments clear their owned doors. Four unchanged approved adult stills prove browsing, payment and the two-person queue.

Review [WORKER_HANDOFF.md](WORKER_HANDOFF.md), [ART_BRIEF.md](ART_BRIEF.md), [concept/gift-shop-concept.png](concept/gift-shop-concept.png) and [assets/provenance.md](assets/provenance.md). Previous full revision: `history/v2/`; current reports: `proof/evidence/v3/`.

Active toolchain, from the repository root:

```text
node tools/room-design/level-5/gift-shop/proof/build.mjs
node tools/room-design/level-5/gift-shop/proof/validate.cjs
node tools/room-design/level-5/gift-shop/proof/validate-controls.mjs
node tools/room-design/level-5/gift-shop/proof/inspect-native.mjs
node tools/room-design/level-5/gift-shop/proof/inspect-composition.mjs
node tools/room-design/level-5/gift-shop/proof/reproduce.mjs
node tools/room-design/level-5/gift-shop/proof/check-helpers.cjs
node tools/room-design/level-5/gift-shop/proof/check-http.mjs
node tools/room-design/level-5/gift-shop/assets/write-provenance-v3.mjs
node tools/room-design/level-5/gift-shop/proof/audit-lane.cjs
```

Manager runs `proof/validate-browser.cjs` and `proof/capture.cjs`; worker Chrome launch returned spawn EPERM. Construction scripts for earlier revisions are historical and must not be rerun against the current design. Native rebuilds do not call image generation. No runtime, retail income, balance, clinical or campaign-save integration is authorized here.
