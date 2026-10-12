# Gift Shop density revision handoff — 2026-10-11

Ready for manager file review, browser QA and owner art review. **3 × 3, one fixed look, filled with stock across both sides and the front**. Checkout, primary displays and four standing slots are retained; optional doorway decor is explicit. Owner approval remains null, runtime integration false.

Review: <http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html>

Exact URL path: `/tools/room-design/level-5/gift-shop/proof/index.html`.

Use the existing room-lab server on port **4191** and the exact URL above. The proof has no campaign storage. Gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the intended persistent profile. Saves do not transfer to 4191; no server or launcher change.

## Owner rule and final item list

**Necessary furniture isn't removed by doors.** The four functional pieces (checkout and three primary displays) and all four standing/queue spots stay for every door or backing combination. Characters path around visible furniture. Optional decor may hide for its declared door sections; wall items also hide for north backing. The mat is optional and walkable, so it has no door owners.

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

The owner's empty-room criticism is addressed by the eight new pieces: flower cooler at left, card spinner at front-left, flowers/teddy table in the front centre, balloon bucket at front-right, magazines/snacks along the right, plush bin at upper-right, mugs/candles on the wall and a checkout mat. Shoppers-hidden evidence: [empty native view](proof/evidence/v2/native-level-1-empty.png). [Full queue](proof/evidence/v2/native-level-1-full-queue.png).

`room.gift_shop` does not enable `appearanceChanges` in `packages/balance-config/src/room-upgrades.ts:51–53,97`. **One fixed look** remains at upgrades 1–5, matching the catalog and owner direction. The five Executive-style selectors prove identical art/anchors and preserve inspection settings. No stock, income, demand or balance behavior is simulated.

Twelve legal one-tile doors: N1–N3, S1–S3, WA–WC, EA–EC; three independent north backing controls. Default adults .007 browse north, .001 pay north, .004 wait east. Adult .006 toggles the second waiting shopper; the second **slot is necessary**, while its stand-in is an occupancy control. All are unchanged approved adult standing stills, with runtime scale/body-axis/floor anchors. No staff member, home slot, seat or generated shopper. Checkout/pay and queue coordinates are unchanged. Six necessary retail contacts and up to seven visible optional-display contacts support browsing and self-service payment.

Controls: individual/bulk doors and backing; all/individual standing shoppers; full queue; routes, grid, floor/standing anchors and opaque base bands. Keys 1–5/arrows, G/R/A/P/V/Q/W/C/F/D/B and Escape. The page includes a classification table generated from the same layout as door visibility/navigation.

## Art, files and scope

**Eight new built-in imagegen calls; thirteen selected objects total.** The five original v1 sprites remain unchanged; all additions have untouched transparent originals, exact prompts, actual input/output-hint receipts and source/prepared SHA-256 hashes. New originals/prompts are `assets/originals/v2/` and `assets/prompts/v2/`; current prepared sprites are `assets/processed/v2/`. Art matches the approved elevated-front orthographic painted pixel style, crisp outlines, honey wood/sage/cream and cheerful pastel stock. No readable text, brands, franchise characters, external art, generated characters or clinical content. The Executive native Canvas toolchain performs uniform crop/downsampling, nearest-neighbour sampling and alpha-below-8 cleanup on prepared copies only. Source bytes and alpha remain intact; delivered edges are alpha 0. [Art provenance](assets/provenance.md), [full hashes](assets/provenance-v2.json).

Mirrors the Executive/Founder folder/toolchain: layout/neutral stand-ins, originals/prompts/processed assets, manifests/registrations/provenance, Canvas renderer/support copies, shared geometry, build and native/control/browser/capture/rebuild/HTTP validators. Current evidence, art preparation and freeze use **v2**; v1 originals/evidence and superseded handoff/layout/plan are retained as history. Read-only shared sources were preserved, including 7 concurrent Executive source changes among 26 references.

Changed only `tools/room-design/level-5/gift-shop/**` and the assigned **Step: Gift Shop mockup** section of the Level 5 room plan. The scoped plan updater verifies every prefix/suffix byte remains unchanged. No runtime, game, balance, clinical, server, launcher or save edits. No agents, installs, commits, pushes, deployments, publishing or external messages. One inadvertent read-only Git status was disclosed in v1 intake; **no Git during this revision**. Global handoff/acceptance/checkpoint reminders belong to the manager. This is **local only**, with no GitHub backup claimed; manager should remind the owner to say **“push to GitHub”** after acceptance.

## Exact validation output

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

Construction records (not rerunnable over final art):

```text
node tools/room-design/level-5/gift-shop/freeze-v2.mjs
PREPAINT V2 FREEZE PASS: 3x3; 112 door/backing states; 1708 routes; 1708 full-queue routes; 4 necessary fixtures / 9 optional decor; 4 necessary standing spots; eight new art calls still pending.

node tools/room-design/level-5/gift-shop/reconcile-v2.mjs
PAINTED RECONCILIATION PASS: 640 states / 13276 full-queue routes; two recorded optional display/contact refinements; necessary fixtures and four standing spots unchanged.
```

The neutral v2 layout froze before all eight new imagegen calls. Painted inspection exposed two optional refinements: move the plush bin from behind the entrance balloons to the upper-right stock area, and move the wall-shelf approach around it. `layout-reconciliation-v2.json` records the exact before/after values. Every necessary fixture and all four standing coordinates remain identical to v1.

## Browser handback and owner questions

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

Open owner review: does the shoppers-hidden composition now feel sufficiently full and cheerful, and are the eight additions' stock, scale and positions approved? Optional hiding is visible through every door control and item table. The fixed look follows the catalog. No new gameplay, balance or clinical decision is proposed.

Next: manager inspects the actual lane and scoped plan update, reruns browser validation/capture, and presents this exact proof URL for owner acceptance.

Final scoped audit and plan replacement (exit 0). [Actual validation command output](proof/evidence/v2/validation-outputs.json), [owned-file inventory](proof/evidence/v2/owned-files.json), and [plan preservation receipt](proof/evidence/v2/plan-revision-receipt.json):

```text
node tools/room-design/level-5/gift-shop/proof/audit-lane.cjs
LANE AUDIT PASS: 420 owned files; 19/26 shared hashes unchanged; 7 concurrent read-only reference changes preserved; assigned Gift Shop plan section only; UTF-8/source/secret/privacy checks; Node/native/rebuild/HTTP PASS; browser PENDING_MANAGER.

node tools/room-design/level-5/gift-shop/update-plan-v2.mjs
SCOPED PLAN UPDATE PASS: only Step: Gift Shop mockup replaced; 23455 prefix bytes / 0 suffix bytes preserved exactly.
```
