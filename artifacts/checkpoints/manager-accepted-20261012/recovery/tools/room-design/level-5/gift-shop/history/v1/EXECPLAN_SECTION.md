## Step: Gift Shop mockup

2026-10-11, Sol worker for the Claude Code **GamifySurgery manager**. Owned lane:
`tools/room-design/level-5/gift-shop/**` and this appended section only. Existing
Founder/Executive steps and the binding October 11 owner rules are preserved.
No runtime, game, balance, clinical content, save or global-handoff edits.

Review URL on the unchanged **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/gift-shop/proof/index.html>

Exact path: `/tools/room-design/level-5/gift-shop/proof/index.html`.

### Contract, appearance and frozen layout

The launch-plan Gift Shop contract (`level5-launch-plan-20261010.md:334–340`)
supplies proposed **3 × 3**, self-service display/checkout contact, a two-person
queue and exit space, and **no shopkeeper**. Retail source inspection confirms
the primary standing outlet contact and maximum two queued customers
(`retail-operations.ts:42,111–140,891–914`; `spatial.ts:101–113,239–246`). No
retail operation, revenue, stock, demand or timing was implemented here.

**One fixed appearance.** `room.gift_shop` leaves `appearanceChanges=false`
(`room-upgrades.ts:51–53,97`), consistent with the binding owner rule that only
Founder changes appearance. Five Executive-style upgrade selectors preserve
the exact same art and anchors; they do not claim five visual tiers.

Interior display islands contain flowers/balloons, generic plush toys/wrapped
gifts, and picture cards/magazines/snacks. A cream/sage self-service kiosk faces
south, with its screen and payment terminal toward the paying adult. The north
wall has a cheerful flower print. No readable merchandise text, brands, clerk
station, staff member, seat or new character.

Default unchanged approved adults: .007 browsing north, .001 paying north and
.004 queued east. Optional .006 stands in the second queue spot. Runtime body
axis, floor anchors and source scale are retained. All four standing contacts,
six retail targets and declared footprints were frozen before image generation
in `stand-in/v1/`; there was no postpaint geometry change.

**Twelve legal one-tile doors: N1–N3, S1–S3, WA–WC, EA–EC; three north backing
controls.** A door never removes a display, checkout or standing spot. Low
backing also keeps every floor object full height. The N2 wall print alone
hides for its door/backing. A clear perimeter aisle routes around permanent
footprints and measured opaque bases with the established 0.18T actor radius.
Full-queue checks retain the other standing shoppers as obstacles. Queue
advancement waits for the next spot to clear, and entry paths reverse for exit.

### Art provenance and toolchain

**Five built-in imagegen calls; five selected objects.** Original transparent
PNGs were copied byte-identically into `assets/originals/v1/`. Exact prompts and
real input/output-hint receipts, SHA-256 source/prepared hashes and registrations
are in `assets/`. No API/CLI, installs, purchases or external artwork. Approved
adult stills are unchanged. Elevated-front orthographic painted pixel art uses
the house outline weight, cream/sage/deep-green/honey-wood palette, crisp pixel
edges and restrained coral/blue/yellow merchandise.

The Executive/Founder folder and native Canvas toolchain are retained:
`layout.json`, frozen neutral stand-ins, originals/prompts/processed assets,
generation/registration/provenance manifests, renderer/support copies, shared
Node/browser geometry, build, actual-handler/native/browser validators,
reproducibility and capture helpers. Uniform downsampling and the existing
alpha-below-8 cleanup affect prepared copies only; source alpha is intact.
No stretching, recolouring, semantic repainting, upscale or character edits.

Milestones: source/approval review, prepaint geometry, five art calls and
preparation, interactive proof, available validators and handoff **complete**.
Browser launch is sandbox-blocked; manager browser acceptance and owner art
review remain next. Seven Executive source files changed concurrently; intake
and current hashes are recorded without overwriting that separate lane.

### Exact validation output and manager handback

From repository root, existing dependencies only:

```text
node tools/room-design/level-5/gift-shop/freeze-v1.mjs
PREPAINT FREEZE PASS: 3x3; 112 door/backing states; 1152 routes; 72 full-queue routes; 12 one-tile doors; five neutral sources; fixed displays/checkout/standing spots.

node tools/room-design/level-5/gift-shop/assets/write-generation-v1.mjs
GENERATION MANIFEST PASS: 5 selected assets / 5 built-in calls; transparent originals copied byte-identically; exact prompts, real receipts and registration hashes.

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

Freeze is a construction record, **not** a command to rerun after generation.
Active evidence is `proof/evidence/v1/`. 3,200 states include all single doors,
all door pairs and all doors × eight backing combinations × five upgrades.
37,440 furniture-clear routes and 14,461,200 samples pass. Another 360
full-queue routes/166,625 samples pass. Floor blockers and standing targets are
invariant for arbitrary door combinations. Native occupied hashes are identical
at all upgrades. Native views are engineering inspections, not browser approval.

Actual Chrome attempt, exit 1 before opening a page:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
browserType.launch: spawn EPERM
```

Full stack: `proof/evidence/v1/browser-launch-attempt.json`. Browser/capture are
`PENDING_MANAGER`; no browser PASS claimed. Manager runs:

```text
node tools/room-design/level-5/gift-shop/proof/validate-browser.cjs
node tools/room-design/level-5/gift-shop/proof/capture.cjs
```

Helpers check served hashes, all controls/door states, standing contacts/layers,
full queue, keyboard and 320 px. Capture prepares 110 room views plus five
desktop/five narrow pages. Owner review question: approve the 3×3 composition,
five generated assets and standing checkout/queue arrangement? Appearance
stays fixed; any exception belongs to the manager and owner. No clinical or
gameplay decision remains in this worker lane.

Owner approval is null and runtime integration false. One inadvertent read-only
Git status ran at intake; no later Git, Git mutation, agents, installs, external
messages, commits, push, release or deployment. Global handoff/acceptance remain
with the manager. This valuable milestone is **local only**, with no GitHub
backup claimed; manager should remind the owner to say **“push to GitHub”**
after acceptance.

Port 4191 has no campaign storage. Gameplay remains `START_GAME.cmd` → exact
`http://127.0.0.1:4173` in the usual persistent profile; no save transfer, server
or launcher change.

[Worker handoff](../../tools/room-design/level-5/gift-shop/WORKER_HANDOFF.md) |
[Art provenance](../../tools/room-design/level-5/gift-shop/assets/provenance.md) |
[Default native view](../../tools/room-design/level-5/gift-shop/proof/evidence/v1/native-level-1-painted.png) |
[Full-queue native view](../../tools/room-design/level-5/gift-shop/proof/evidence/v1/native-level-1-full-queue.png)
