# Gift Shop mockup worker handoff — 2026-10-11

Ready for manager file review, browser QA and owner art review. Proposed
**3 × 3 self-service shop, one fixed look**. All displays, checkout and four
standing spots persist under every door/backing state. No runtime/game/balance
or clinical content edits.

Review: <http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html>

Exact path: `/tools/room-design/level-5/gift-shop/proof/index.html`.

Existing manager room-lab server on port 4191 is unchanged. It serves all 18
current page/sprite/still resources with 200 and matching bytes. This proof
uses no campaign storage. Gameplay stays `START_GAME.cmd` → exact
`http://127.0.0.1:4173` in the intended persistent browser profile. Saves do not
transfer to port 4191; no launcher or server change.

## Decision and behavior

`room.gift_shop` has `appearanceChanges=false`: the default in
`room-upgrades.ts:51–53` is not overridden by its row at line 97. The owner's
binding October 11 rule also restricts appearance changes to Founder.
Therefore **one fixed appearance**, with the Executive's five upgrade
selectors proving identical art/anchors and preserved inspection settings.
No income, price, stock, demand or dispensing behavior is simulated.

The launch contract at `level5-launch-plan-20261010.md:334–340` supplies 3×3,
self-service standing checkout, two waiting customers and no shopkeeper.
Read retail-operations.ts for primary-contact selection, two-person queue,
arrival/dispensing/exit conventions; the proof does not integrate that code.

New art: flowers/balloons stand, plush/wrapped-gifts shelf,
cards/magazines/snacks rack, south-facing self-service checkout and a flower
wall picture. Palette/camera/outlines follow approved Level 4/Founder/Executive
painted pixel art. No readable text, brands, media characters or clinical
detail. All floor furniture faces south; screen/card terminal face the paying
shopper. Shelf and kiosk stay visible in the empty proof for direct inspection.

Default approved adult stills: .007 browsing north, .001 paying north, .004
queued east. Optional .006 fills the second queue spot. All are standing,
unchanged registered runtime stills with original source scale/body axis/floor
contact. No shopkeeper, staff home slot, seated contact or generated character.

**Twelve legal one-tile doors:** N1–N3, S1–S3, WA–WC, EA–EC. Three independent
north backing controls. Every door retains all floor furniture and standing
spots. Backing retains full height; only the N2 wall print hides for its door
or backing. Clear perimeter routes use permanent declared footprints plus
measured opaque bases, 0.18T actor radius and no pass-through exception.
Six contacts cover all display areas, checkout and the two waiting spots.

Full-queue routes treat the target shopper as moving, with other shoppers held
as collision obstacles. Display contacts share the same moving browsing adult;
they do not propose a fifth simultaneous customer. Entry paths reverse safely
for exit. Waiting customers advance only after the next contact clears.

Controls include all/individual doors/backing, bulk actions, all/individual
standing shoppers, full queue, routes, grid, floor/standing anchors and base
bands. 1–5/arrows select the unchanged look; G/R/A/P/V/Q/W/C/F/D/B toggle
inspection/occupancy; Escape resets. Tab/Space/Enter browser QA is pending.

## Files, provenance and scope

- `layout.json`, `ART_BRIEF.md`, `layout-reconciliation-v1.json`: proposed
  geometry/appearance contract. No postpaint layout change.
- `stand-in/v1/**`: five original neutral sources, frozen prepaint layout,
  manifest, route receipt, native views and replay helper. Freeze preceded art.
- `assets/originals/v1/**`, `assets/prompts/v1/**`: five untouched original
  transparent PNGs, exact prompts, actual input/output-hint tool receipts.
- `assets/processed/v1/**`, generation/registration/provenance manifests:
  five prepared sprites, alpha/base measurements, complete source/prepared
  SHA-256 hashes. [Art provenance](assets/provenance.md),
  [exact prompt set](assets/prompts/v1/catalog.json).
- `proof/**`: Executive/Founder native Canvas packing, preserved renderer
  support snapshots, room-specific geometry/extension, served data/manifests,
  same validator/rebuild/browser/capture/HTTP tool categories. Evidence `v1`.
- Root README, this handoff, `EXECPLAN_SECTION.md`, scoped append helper and
  the appended **Step: Gift Shop mockup** in the shared Level 5 room plan.

**Five built-in imagegen calls, five selected objects; no API/CLI generation,
purchases, installs or external artwork.** All originals were copied
byte-identically from the tool's real default paths. Prepared copies use the
Executive's uniform nearest-neighbour downsampling and alpha-below-8 cleanup.
Original alpha is intact. No stretching, recolouring, semantic repainting,
source upscale or character edits. All delivered sprite edges have zero alpha.

Read all requested approved receipts and relevant room toolchain/art. Shared
Executive files changed concurrently during this task; seven initial/current
source hashes are recorded in the validation/provenance reports. Nineteen
other baseline references, including all four reused stills, are unchanged.
Those concurrent files and newer binding owner rules were preserved.

Only the room folder and appended plan section were written. One inadvertent
read-only Git status ran at intake and was disclosed; no later Git command or
Git mutation. No agents, installs, commits/pushes, deployment, release,
publication, external messages or owner-save writes. Manager owns the global
`CURRENT_THREAD_HANDOFF.md`, acceptance and checkpoint reminders. This is a
valuable **local-only** milestone; no GitHub backup claimed. Manager should
remind the owner to say **“push to GitHub”** after acceptance.

## Exact validation output

Repository root, existing dependencies. Current successful commands exit 0:

```text
node tools/room-design/level-5/gift-shop/freeze-v1.mjs
PREPAINT FREEZE PASS: 3x3; 112 door/backing states; 1152 routes; 72 full-queue routes; 12 one-tile doors; five neutral sources; fixed displays/checkout/standing spots.

node tools/room-design/level-5/gift-shop/assets/write-generation-v1.mjs
GENERATION MANIFEST PASS: 5 selected assets / 5 built-in calls; transparent originals copied byte-identically; exact prompts, real receipts and registration hashes.

node tools/room-design/level-5/gift-shop/proof/build.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 5 sprites; shared 3x3; 12 one-tile doors; permanent displays/checkout/standing spots; no staff.

node tools/room-design/level-5/gift-shop/proof/validate.cjs
VALIDATION PASS: 1 fixed look / 5 upgrade selections; 5 painted assets; 4 unchanged adult standing stills; 3200 door/backing states; 37440 routes; 14461200 radius-clear samples at 0.005T; 360 full-queue routes; 12 one-tile doors; permanent displays/checkout/standing spots; contacts/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/gift-shop/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 186 Node handler checks; 5 fixed-look upgrade buttons, 12 door buttons, 3 backing buttons, 4 bulk buttons, 4 standing shoppers, keyboard, real-error/performance-warning discrimination; browser pending.

node tools/room-design/level-5/gift-shop/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 110 actual-render states across 5 fixed-appearance upgrades; default/empty/individual shoppers/full queue/contacts/routes/all 12 doors/backing; browser QA pending.

node tools/room-design/level-5/gift-shop/proof/reproduce.mjs
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 5 sprites; shared 3x3; 12 one-tile doors; permanent displays/checkout/standing spots; no staff.
BUILD PASS: painted; 1 fixed look / 5 upgrade selections; 5 sprites; shared 3x3; 12 one-tile doors; permanent displays/checkout/standing spots; no staff.
REPRODUCIBILITY PASS: 12 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/gift-shop/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/gift-shop/proof/check-http.mjs
HTTP VALIDATION PASS: 18 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/gift-shop/assets/write-provenance-v1.mjs
PROVENANCE PASS: 5 built-in calls; 5 selected originals/prompts/real receipts and prepared hashes; frozen 3x3 geometry; 4 unchanged adult standing stills; owner approval pending.
```

Freeze is a pre-generation construction record; do **not** rerun it now.
Rebuild uses `proof/build.mjs`. Neutral replay instructions are in its README.

3,200 explicit door/backing states = no door, every single door, every pair,
all doors × eight backing combinations × five upgrades. 37,440 routes and
14,461,200 samples at 0.005T. Full queue adds 360 routes/166,625 radius-clear
samples; queue advancement/exit checks pass. Invariant floor blockers/standing
targets extend the single-door proof to every arbitrary combination. 140
actual drawable visibility checks confirm no floor object/standing spot clears.
Actual opaque overlap verifies standing layer order at the plush display and
checkout. 110 native images use the shipped renderer; default occupied hashes
are identical at every upgrade. Native images are not browser screenshots or
owner art acceptance.

## Browser blocker, owner question and next action

Actual attempted command, exit 1 before any page:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
browserType.launch: spawn EPERM
```

Full actual stack: `proof/evidence/v1/browser-launch-attempt.json`.
Browser/capture reports are explicitly `PENDING_MANAGER`; no browser PASS.
No sandbox bypass or alternate browser attempt. Manager with the existing
room-lab server runs:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
node tools/room-design/level-5/gift-shop/proof/capture.cjs
```

Browser helpers check served code/manifest/asset/still hashes, all door pairs
and backing, actual standing contacts/layers, full queue, controls/keyboard,
rapid selection and all five selections at 320 px. Capture prepares 110 room
states plus five desktop and five narrow pages. Real page/HTTP/network/console
errors fail; the known Canvas performance advisory is nonfatal.

Open owner review question: approve the 3×3 composition, five new merchandise/
checkout/decor assets and standing checkout/two-person queue arrangement?
One fixed look follows the catalog/binding owner rule. Any appearance exception
belongs to manager/owner, outside this task. No unresolved clinical or gameplay
decision was added. Approval stays null, runtime integration false.

Next: manager inspects the actual scoped files, default/empty/full-queue native
views and audit receipt, runs browser validation/capture, then presents the
exact review URL to the owner. Durable global handoff and backup checkpoint
remain in the manager's lane.

Final scoped audit (exit 0); [owned-file inventory and receipt](proof/evidence/v1/owned-files.json):

```text
node tools/room-design/level-5/gift-shop/proof/audit-lane.cjs
LANE AUDIT PASS: 209 owned files; 19/26 shared hashes unchanged; 7 concurrent read-only reference changes preserved; assigned plan append only; UTF-8/source/secret/privacy checks; Node/native/rebuild/HTTP PASS; browser PENDING_MANAGER.
```
