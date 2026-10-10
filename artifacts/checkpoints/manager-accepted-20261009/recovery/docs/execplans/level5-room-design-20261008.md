# Level 5 room design — 2026-10-08

## Goal and authorized scope

Sol worker for the Claude Code **GamifySurgery manager**. Trace the defined
Level 5 room inventory without inventing rooms, then make the first room's
isolated painted interactive mockup. Owner direction relayed by the manager:
after the last Level 4 approval, move to the next room, including the next
facility level if Level 4 is complete.

Owned active lane: `tools/room-design/level-5/founders-office/**` and this plan. Shared working tree:
preserve concurrent manager, Claude, owner and worker changes. No Git commands,
agents, installs, game/runtime/balance edits, saves, commits, push or deployment.
All authored text is UTF-8 without BOM. The current handoff was read; its
active October 8 work remains outside this lane. This new plan and the Level 5
directory were absent at initial intake. The later owner revision preserves the
first candidate under the room’s history directory.

## Step 1 — defined room inventory and citations

The accepted roadmap **does define Level 5**, titled *Optimized ASC / Prestige*.
Use its existing list order:

| Order | Defined room | Roadmap evidence | Independent repository cross-check |
| --- | --- | --- | --- |
| 1 | Founder's Office | [Accepted facility roadmap, lines 182–190](../features/facility-levels-and-clinical-release-points.md#level-5---optimized-asc--prestige) | [GS-038 accepted future upgrade table, line 459](gs038-all-room-upgrades.md#simple-owner-review-table---october-7); `packages/balance-config/src/room-upgrades.ts:95`, `room.founder_office`, status `future`, appearance changes enabled |
| 2 | Executive Office | Same roadmap, line 187 | GS-038 line 460; `room-upgrades.ts:96`, `room.executive_office`, status `future` |
| 3 | Gift Shop | Same roadmap, line 188 | GS-038 line 461; `room-upgrades.ts:97`, `room.gift_shop`, status `future` |
| 4 | Indoor Garden | Same roadmap, line 189 | GS-038 line 462; `room-upgrades.ts:98`, `room.indoor_garden`, status `future` |
| 5 | Staff Gym | Same roadmap, line 190 | GS-038 line 463; `room-upgrades.ts:99`, `room.staff_gym`, status `future` |

GS-038's future inventory separately lists exactly these five Level 5 categories
at lines 697–701. Its older open-benefit discussion is superseded by the
accepted numerical table (lines 412–426 and 497–500): future upgrade ladders are
catalog metadata until base room behavior exists. They do not define a room
footprint or authorize gameplay integration.

The roadmap says Level 5 adds no clinical setting (lines 196–197), with
hospital/ED/ICU progression deliberately deferred without invented numeric
levels (lines 25–38 and 272). Call Room is removed (lines 170–171); it is not a
Level 5 candidate. Reading Room's later move to Level 3 is explicitly recorded
in GS-038 lines 703–707 and does not change this Level 5 list.

Search coverage: `docs/project-management/PROJECT_BOARD.md`, `docs/features/**`,
`docs/execplans/**` including `level-four-room-design.md` and
`gs038-all-room-upgrades.md`, `packages/balance-config/**`, and
`tools/room-design/**`. The board's GS-015 records establish owner-led standalone
room design, without supplying another Level 5 list. The Level 4 plan lines
35–37 supplies the prior room inventory. No alternative Level 5 inventory or
Founder Office footprint was found. `rg` is unavailable in this shell; native
PowerShell file enumeration and `Select-String` were used instead.

**Step 1 result:** five defined rooms; Step 2 is authorized. Chosen room:
**Founder's Office**, first in roadmap order.

## Step 2 — owner-directed revision, complete for manager review

The manager stopped the preceding turn so the owner’s expanded direction could
be incorporated. The active design is **3×3 with five complete room appearances
(Levels 1–5)**. The old proposed 4×4 base candidate and its manager browser
evidence remain under `founders-office/history/4x4-base-20261008/`; they are
superseded for this revision. This does not change the accepted room list.

Owner direction (October 8): “a basic table for a desk and each level the desk
gets more ornate”; the shelf starts as a wire rack; the founder chair can end
“basically a throne”; the visitor chair progresses from folding to velvet; the
final appearance has a fancy rug, generic bust and gold highlights. The manager
clarified the desk orientation: founder sits north facing south, visitor sits
south facing north, and desk art shows the south visitor-side face, without
operator drawers or an operator knee-hole view. Visitor chair is seen from
behind, with the rear panel and arms in front of the real seated adult.

| Appearance | Complete selected set |
| --- | --- |
| 1 Startup | Basic table; simple office chair; folding visitor chair; wire rack; plain mat; small print |
| 2 Established | Plain wood desk; padded task/guest chairs; wood shelf; small rug; unreadable diploma; small plant |
| 3 Refined | Paneled solid wood desk with lamp; leather founder chair; upholstered visitor chair; wood bookcase; patterned rug; art |
| 4 Executive | Carved executive desk; high-back leather founder chair; leather visitor armchair; glass awards cabinet; rich rug; statement art; plant |
| 5 Grand | Gold-trim ornate desk; throne-like founder chair; velvet visitor armchair; gold-accent ornate bookcase; luxurious rug; gilded art; generic classical bust/pedestal |

All five tiers have unique built-in-generated desk, founder chair, visitor chair,
shelf, rug/mat and wall decor assets. Plants (L2/L4) and bust (L5) are separate
accents; L3 lamp is part of its desk. **35 calls, 33 selected objects, 10 native
chair foregrounds.** Rejected L1 desk and L5 throne originals, exact prompts and
edit receipts are preserved alongside selected versions. No logos, readable
text, real-person sculpture, wounds, blood or clinical body detail.

### Layout, seats and doorway contract

One shared layout, 120 proof pixels/tile, 12 independent one-tile wall sections:
N1–N3, S1–S3, WA–WC, EA–EC. Real unchanged `founder.01/sit-south.png` and
`patient.adult.007/sit-north.png` sit in every tier. Both measured cushions rise
45 proof pixels above their fixed floor anchors. Layer order is chair, real
adult, camera-side foreground, with desk in front of founder. Seated legs hang;
there are no leg rests. No rolling stool or pediatric occupant is introduced.

`stand-in/v2/layout-prepaint.json`, seven canvases, manifest and route receipt
were frozen before painting. Later native replay images use those originals.
The shared art-fit corrections in `layout-reconciliation-v2.json` move the
desk 0.20 tile north, slightly widen the founder canvas, clear decor from the
bust and move the visitor approach 0.10 tile west. All tiers share the final
anchors and footprints; floor/seat contacts and doorway ownership remain fixed.

Shelf and accent hide on their own door sections, opening the complete threshold
and approach. Floor furniture remains full height against low north backing;
wall art hides on its own door/backing sections. Rugs are walkable. No furniture
pass-through exception is used. Radius-clear paths account for declared
footprints and measured opaque floor-contact bands. Single-door paths are safe
with all other optional objects present; opening further doors removes obstacles,
so arbitrary door combinations remain safe.

### Milestones and ownership

1. Roadmap trace — **complete**, existing citations above; first room selected.
2. Re-read tree and preserve prior candidate — **complete**, history archive.
3. Shared 3×3 stand-ins and ART_BRIEF before art — **complete**, frozen sources.
4. Five complete generated appearances, inspection, preparation and provenance
   — **complete**, originals/prompts/receipts/hashes and source registrations.
5. Tier buttons/keyboard, real seating, all-door/backing/inspection controls,
   Node validators, native renders and all-tier browser helpers — **complete**.
6. Scoped room handoff and this plan — **complete**. Manager acceptance,
   browser execution and owner art review are the next steps.

The worker owns the room directory and this plan only. Preserve concurrent work.
No Git, agent spawning, installs, runtime/balance/gameplay edits, save access,
commit, push, deployment or publication. UTF-8 without BOM. Manager owns the
global current handoff, product decisions, acceptance and checkpoint reminder.
This valuable local milestone has no GitHub backup claimed.

### Review pathway and pending decisions

Review URL:
<http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html>

This isolated room proof uses no campaign storage. Owner gameplay stays
`START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile;
saves do not transfer to port 4191. The existing manager server was unchanged.

The five tier buttons, keys 1–5 and arrows preserve doors/backing/diagnostics;
Escape resets to Level 1. Twelve doors, three backing sections, bulk actions,
occupancy, contacts, measured bases, grid and routes remain available.

Owner art approval is pending (`approval: null`), runtime integration is false.
**The mockup’s morale mechanic remains undecided**, per the latest worker brief.
Accepted GS-038 +2 metadata is distinct from an operating mechanic. The
concurrent manager note below is preserved; manager should reconcile that record
with the latest brief before any gameplay integration. No mechanic was authored.

## Validation commands and exact current output

Run from the repository root. Existing dependencies only.

```text
node tools/room-design/level-5/founders-office/proof/validate.cjs
VALIDATION PASS: 5 tiers; 33 painted assets + 10 chair foregrounds; 2 real stills; 560 door/backing states; 2880 routes; 1115024 radius-clear samples at 0.005T; 12 one-tile doors; shared anchors; contacts/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/founders-office/proof/validate-controls.mjs
CONTROL VALIDATION PASS 153 Node handler checks; 5 tier buttons, 12 door buttons, 3 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending

node tools/room-design/level-5/founders-office/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 45 actual-render states across 5 tiers; occupied/empty/individual adults/contacts/all doors/backing/owned door hides; browser QA pending.

node tools/room-design/level-5/founders-office/proof/reproduce.mjs
BUILD PASS: painted; 5 complete tiers; 33 distinct assets + 10 chair foregrounds; shared 3x3; 12 one-tile doors; same seat anchors.
BUILD PASS: painted; 5 complete tiers; 33 distinct assets + 10 chair foregrounds; shared 3x3; 12 one-tile doors; same seat anchors.
REPRODUCIBILITY PASS: 50 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/founders-office/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution pending manager.

node tools/room-design/level-5/founders-office/assets/write-provenance-v2.mjs
PROVENANCE PASS: 35 built-in calls; 33 selected originals/prompts/receipts; 43 prepared hashes; frozen stand-ins; real stills unchanged; approval pending.
```

Read-only PowerShell requests to the existing server:
`HTTP VALIDATION PASS: 54 current proof resources return 200 at http://127.0.0.1:4191; existing server unchanged.`
The commands in `proof/check-http.ps1` were executed inline because this worker
environment disables PowerShell script files; no execution policy was changed.

Manager, with server running:

```text
node tools/room-design/level-5/founders-office/proof/validate-browser.cjs
node tools/room-design/level-5/founders-office/proof/capture.cjs
```

Browser scripts compile and installed Playwright resolves; worker did not spawn
a browser. Current receipts are pending in `proof/evidence/v2/` and
`proof/evidence/v2/browser/`. Validator pins served code/manifest/sprite hashes,
checks all five tiers, 560 states/2,880 routes, contacts/layers, actual controls,
keyboard and 320 px. Capture writes 50 room states plus five desktop and five
narrow pages. Canvas readback performance advisories are nonfatal; real page
exceptions, console errors, failed requests and HTTP failures are fatal.

## Evidence, discoveries and handback

- `proof/evidence/v2/native-all-five-levels.png` compares all five native tiers.
  Forty-five native views are engineering art inspections, not browser captures.
- Node validation checks alpha edges/padding, aspect preservation, no upscale,
  original/prompt/receipt/processed hashes, both real stills, measured contacts,
  actual foreground overlap and shared anchors; 720 monotonic comparisons
  justify arbitrary door combinations. No clinical approval is implied.
- Two native rebuilds reproduce all 50 delivered files byte-for-byte.
- Twenty-five shared reference hashes were checked. The shared Level 4
  Wound/Ostomy `proof/lab.js` changed concurrently; this is recorded in the
  receipt and preserved. Reused still hashes match.
- Root evidence JSON reports are explicitly superseded; prior native/browser
  PNGs remain for comparison. Untouched originals also remain in the history
  archive. New evidence is under `v2/`.
- Founder’s Office only: the other four defined rooms were not started during
  this revision. No architecture or gameplay decision was made.
- Exact paths, outputs and manager actions:
  [worker handoff](../../tools/room-design/level-5/founders-office/WORKER_HANDOFF.md).

Next action: manager inspects scoped changes and native contact sheet, runs the
browser validator and all-tier capture, then opens the review URL for owner art
approval. Remaining owner question is approval of the five appearances/layout;
the manager must reconcile the morale record before a future runtime milestone.

### Concurrent manager note — preserved, not implemented by this worker

- 2026-10-08: OWNER: morale effect = simply owning the Founder Office raises every employee's morale (per-upgrade +2 per GS-038 ladder).
- 2026-10-08: Founder Office v2 (3x3, five tiers) browser validation PASS (13 groups, 5 tiers, 12 doors, page errors 0), capture PASS; opened in the Claude browser pane for owner review. Morale: owner chose "owning the room raises every employee's morale".
