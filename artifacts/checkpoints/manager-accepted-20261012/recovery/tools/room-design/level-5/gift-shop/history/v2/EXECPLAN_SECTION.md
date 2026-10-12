## Step: Gift Shop mockup

Owner density revision **2026-10-11**: room implementation/painted mockup and runnable engineering validation complete; manager browser QA and owner visual approval pending. Owned lane: `tools/room-design/level-5/gift-shop/**` plus this assigned section. No runtime/game/balance changes.

Review URL: <http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html>

Exact path: `/tools/room-design/level-5/gift-shop/proof/index.html` on the unchanged room-lab server, port 4191. Proposed **3 × 3 self-service Gift Shop**, two waiting spots, no shopkeeper, as contracted in `level5-launch-plan-20261010.md`.

`room.gift_shop` does not enable `appearanceChanges` in `packages/balance-config/src/room-upgrades.ts:51–53,97`. **One fixed look** remains at upgrades 1–5, matching the catalog and owner direction. The five Executive-style selectors prove identical art/anchors and preserve inspection settings. No stock, income, demand or balance behavior is simulated.

**Necessary furniture isn't removed by doors.** The four functional pieces (checkout and three primary displays) and all four standing/queue spots stay for every door or backing combination. Characters path around visible furniture. Optional decor may hide for its declared door sections; wall items also hide for north backing. The mat is optional and walkable, so it has no door owners.

### Final item list and door classification

| Item | Classification | Hides for door | North backing |
| --- | --- | --- | --- |
| Flowers and balloons | necessary | none | none |
| Plush toys and boxed gifts | necessary | none | none |
| Cards, magazines and snacks | necessary | none | none |
| Self-service checkout | necessary | none | none |
| Cheerful flower print | optional | N2 | N2 |
| Flower cooler | optional | WB | none |
| Greeting-card spinner | optional | S1, WC | none |
| Round flowers and teddy display | optional | S2 | none |
| Entrance balloon bucket | optional | S3, EC | none |
| Right-side magazines and snacks | optional | EB | none |
| Small plush bin | optional | N3, EA | none |
| Wall shelf of mugs and candles | optional | N3 | N3 |
| Checkout floor mat (walkable) | optional | none | none |
| Browse, pay, queue 1 and queue 2 standing spots | necessary | none | none |

The owner requested a full, cheerful shop with shoppers hidden. Eight newly generated pieces now occupy the left side, upper-right/right edge, front corners and front centre; stock is distributed across the room. Checkout and all necessary display/standing coordinates stay unchanged from v1. Default approved adult stills .007 browse north, .001 pay north and .004 queue east; .006 optionally shows the second queued adult. Both queue slots are necessary. No generated character or staff member. All 12 one-tile wall sections have door controls; north backing remains independent. Routes avoid visible solid pieces, measured opaque bases and the other shoppers.

### Art provenance and construction

**Eight new built-in imagegen calls, thirteen objects total**: five original v1 assets retained byte-identically plus cooler, spinner, round flowers/teddy table, entrance balloons, right-side magazines/snacks, plush bin, mugs/candles wall shelf and mat. Exact prompts, actual input/output-hint receipts, transparent originals and source/prepared hashes are in the room's `assets/`. Same approved painted pixel style, palette, outline weight and south-facing orthographic camera. No text/brands, franchise art, external art, API/CLI generation, installs, purchases, clinical content or generated adults. Executive native Canvas preparation preserves source bytes/alpha and uniformly crops/downsamples prepared copies with nearest-neighbour sampling and alpha-below-8 cleanup.

Executive/Founder structure and toolchain retained, with current prepared sprites, stand-ins and evidence in **v2**. Two painted optional refinements are recorded in `layout-reconciliation-v2.json`; necessary geometry remains unchanged. The classification table is generated from layout declarations and checked against actual visibility. Historical v1 files remain intact. 7 concurrent read-only Executive reference changes were recorded and preserved.

Construction records (not rerunnable over final art):

```text
node tools/room-design/level-5/gift-shop/freeze-v2.mjs
PREPAINT V2 FREEZE PASS: 3x3; 112 door/backing states; 1708 routes; 1708 full-queue routes; 4 necessary fixtures / 9 optional decor; 4 necessary standing spots; eight new art calls still pending.

node tools/room-design/level-5/gift-shop/reconcile-v2.mjs
PAINTED RECONCILIATION PASS: 640 states / 13276 full-queue routes; two recorded optional display/contact refinements; necessary fixtures and four standing spots unchanged.
```

The neutral v2 layout froze before all eight new imagegen calls. Painted inspection exposed two optional refinements: move the plush bin from behind the entrance balloons to the upper-right stock area, and move the wall-shelf approach around it. `layout-reconciliation-v2.json` records the exact before/after values. Every necessary fixture and all four standing coordinates remain identical to v1.

### Exact validation output and manager handback

Current engineering commands, repository root with existing dependencies, exit 0:

```text
node tools/room-design/level-5/gift-shop/assets/write-generation-v2.mjs
GENERATION V2 MANIFEST PASS: 13 selected assets / 13 built-in calls; 8 new revision calls; transparent originals copied byte-identically; exact prompts, real receipts and registration hashes.

node tools/room-design/level-5/gift-shop/proof/validate.cjs
VALIDATION PASS: 1 fixed look / 5 upgrade selections; 13 painted assets; 4 necessary fixtures / 9 optional decor; 4 unchanged adult standing stills; 3200 door/backing states; 66380 routes; 32992040 radius-clear samples at 0.005T; 66380 full-queue routes / 40087100 occupied samples; 12 one-tile doors; necessary furniture and standing spots retained; optional visibility/contacts/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/gift-shop/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 265 Node handler checks; 5 fixed-look upgrade buttons, 12 door buttons, 3 backing buttons, 4 bulk buttons, 4 standing shoppers, keyboard, real-error/performance-warning discrimination; browser pending.

node tools/room-design/level-5/gift-shop/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 110 actual-render states across 5 fixed-appearance upgrades; default/empty/individual shoppers/full queue/contacts/routes/all 12 doors/backing; browser QA pending.

node tools/room-design/level-5/gift-shop/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 13 sprites; shared 3x3; 12 one-tile doors; necessary primary displays/checkout/standing spots; optional decor has door owners; no staff.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 13 sprites; shared 3x3; 12 one-tile doors; necessary primary displays/checkout/standing spots; optional decor has door owners; no staff.
REPRODUCIBILITY PASS: 20 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/gift-shop/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/gift-shop/proof/check-http.mjs
HTTP VALIDATION PASS: 26 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/gift-shop/assets/write-provenance-v2.mjs
PROVENANCE V2 PASS: 13 built-in objects / 8 new revision calls; originals/prompts/real receipts/prepared hashes; 4 necessary fixtures / 9 optional decor; 4 unchanged adult stills; two recorded optional refinements; owner approval pending.
```

Active reports and native images: `proof/evidence/v2/`. The 3,200 states cover no doors, every single door, every door pair and all doors × eight backing combinations × five selections. Full-queue routes now run in **every** enumerated state, with other shoppers held as collision obstacles. Both unoccupied and full-queue paths are sampled every 0.005T against declared footprints and measured painted bases, at 0.18T actor radius. Necessary blockers/contacts stay; adding doors can only remove optional blockers/contacts, so every proven single-door route remains available in arbitrary larger combinations. Queue advancement is checked with all optional stock present after the next contact clears. Entry routes reverse safely for exit.

The revised browser validator was attempted again, exit 1 before any page:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
browserType.launch: spawn EPERM
```

Actual current stack/report: `proof/evidence/v2/browser-launch-attempt.json`. Browser and capture status are **PENDING_MANAGER**; no browser PASS claimed. The manager reruns:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
node tools/room-design/level-5/gift-shop/proof/capture.cjs
```

Updated helpers check all 13 assets, necessary/optional hiding and restoration, served code/asset/still hashes, every door pair and backing combination under full queue, standing contacts/layers, controls, keyboard, rapid selection and 320 px with the classification table expanded. Capture produces 110 room views plus five desktop/five narrow pages. Native PNGs are engineering inspection, not browser screenshots or owner approval.

Owner review questions: does the empty-room composition now feel full enough, and are the eight new pieces' art/scale/positions approved? Fixed appearance follows the catalog; no new gameplay, balance or clinical question. Approval is null; runtime integration false.

Only the assigned room lane and this section changed; unchanged shared-plan prefix/suffix bytes are recorded in the scoped update receipt. No Git in the revision, agents, installs, external messages, commits, push, release or deployment. Global handoff and acceptance remain with the manager. Valuable **local-only** milestone, no GitHub backup claimed; manager should remind the owner to say **“push to GitHub”** after acceptance.

Use the existing room-lab server on port **4191** and the exact URL above. The proof has no campaign storage. Gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the intended persistent profile. Saves do not transfer to 4191; no server or launcher change.

[Worker handoff](../../tools/room-design/level-5/gift-shop/WORKER_HANDOFF.md) | [Art provenance](../../tools/room-design/level-5/gift-shop/assets/provenance.md) | [Empty native view](../../tools/room-design/level-5/gift-shop/proof/evidence/v2/native-level-1-empty.png) | [Full-queue native view](../../tools/room-design/level-5/gift-shop/proof/evidence/v2/native-level-1-full-queue.png)

Final scoped audit and plan replacement (exit 0). Actual validation output, owned-file inventory and plan preservation receipt are in `tools/room-design/level-5/gift-shop/proof/evidence/v2/`:

```text
node tools/room-design/level-5/gift-shop/proof/audit-lane.cjs
LANE AUDIT PASS: 420 owned files; 19/26 shared hashes unchanged; 7 concurrent read-only reference changes preserved; assigned Gift Shop plan section only; UTF-8/source/secret/privacy checks; Node/native/rebuild/HTTP PASS; browser PENDING_MANAGER.

node tools/room-design/level-5/gift-shop/update-plan-v2.mjs
SCOPED PLAN UPDATE PASS: only Step: Gift Shop mockup replaced; 23455 prefix bytes / 0 suffix bytes preserved exactly.
```
