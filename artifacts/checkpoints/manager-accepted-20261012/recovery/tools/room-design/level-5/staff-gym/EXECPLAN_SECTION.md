

## Step: Staff Gym mockup

**2026-10-11 — isolated room-first 4×4 candidate complete for manager review. Native engineering checks pass; browser QA and owner art approval pending.** One fixed appearance at upgrades 1–5; two permanent staff contacts; no home/hiring slot or animated rig.

Desktop proof: <http://127.0.0.1:4191/tools/room-design/level-5/staff-gym/proof/index.html>. Exact path: `/tools/room-design/level-5/staff-gym/proof/index.html`.

The existing phone server serves the same path on port 4192; both desktop and phone HTTP checks return 200 with matching bytes for all 33 resources. Phone HTTPS pathway: <https://melissadesktop.taile197db.ts.net:8443/tools/room-design/level-5/staff-gym/proof/index.html>. The 8443 phone browser/TLS pathway was not verified by this sandbox. No server, launcher or hosting configuration changed.

This isolated proof has no campaign storage. Owner gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual persistent profile. Saves do not transfer to ports 4191/4192/8443; no remote gameplay URL changed.

### Concept and derivation

The full-room concept came first, using the owner-approved Gift Shop concept for the camera and room-first composition and approved Level 4 Pediatric Waiting for clinic palette/outline/raster finish. The fixed 4×4 room has a straight rear wall, unrotated square floor, elevated front orthographic camera, charcoal speckled rubber tiles, teal pads and honeywood storage. Treadmill, bike, dumbbells and hydration adjoin across the rear; continuous shallow side cubbies and low front trays surround the bench, mat and one connected aisle. Art extends upward from filled footprints and neighbors abut/overlap by floor depth.

Eleven later built-in transparent generations reference that exact concept: rear equipment run, bench, mirror/poster, west cubbies, east mat racks, stretch mat, exercise ball, foam roller, front storage run, rubber floor and towel hooks. One rear image splits into four adjoining bays; the mirror and front run also split at four shared seams. Side modules repeat along four wall-depth intervals. The concept’s front-center gap is filled in the playable room to obey the owner’s latest Indoor Garden rule: closed wall rows remain continuous, and a section opens only for a selected owned doorway. Extra concept plants are omitted in favor of adjoining gym storage. No new character or exercise rig was generated.

### Necessary / optional classification

| Piece | Role | Class | Hidden for |
| --- | --- | --- | --- |
| `north1` | Treadmill · rear bay 1 | optional | N1, WA |
| `mirror1` | Wall mirror · section 1 | optional | N1 / its north backing |
| `north2` | Exercise bike and adjoining weights · rear bay 2 | optional | N2 |
| `mirror2` | Wall mirror · section 2 | optional | N2 / its north backing |
| `north3` | Dumbbell rack · rear bay 3 | optional | N3 |
| `mirror3` | Wall mirror · section 3 | optional | N3 / its north backing |
| `north4` | Water cooler, towel cubby and weights · rear bay 4 | optional | N4, EA |
| `mirror4` | Mirror edge and abstract motivational poster | optional | N4 / its north backing |
| `west1` | Towel, bottle and block cubbies · west section 1 | optional | N1, WA |
| `west2` | Towel, bottle and block cubbies · west section 2 | optional | WB |
| `west3` | Towel, bottle and block cubbies · west section 3 | optional | WC |
| `west4` | Towel, bottle and block cubbies · west section 4 | optional | S1, WD |
| `east1` | Rolled-mat and accessory rack · east section 1 | optional | N4, EA |
| `east2` | Rolled-mat and accessory rack · east section 2 | optional | EB |
| `east3` | Rolled-mat and accessory rack · east section 3 | optional | EC |
| `east4` | Rolled-mat and accessory rack · east section 4 | optional | S4, ED |
| `front1` | Folded towel tray · front section 1 | optional | S1, WD |
| `front2` | Bottle tray · front section 2 | optional | S2 |
| `front3` | Dumbbell and yoga-block tray · front section 3 | optional | S3 |
| `front4` | Rolled-mat tray · front section 4 | optional | S4, ED |
| `benchSeat` | Padded rest bench · adult seated south | necessary | None |
| `stretchMat` | Stretch mat · standing staff station | necessary | None |
| `exerciseBall` | Exercise ball · stretch station equipment | necessary | None |
| `foamRoller` | Foam roller · front of stretch station | necessary | None |
| `rubberFloor` | Rubber gym floor and connected aisle · walkable | necessary | None |
| `towelHooks` | Wall towel hooks · above dumbbell bay | optional | N3 / its north backing |
| `benchSeat-front` | Exact-source camera-side rail and legs | necessary | None |
| Both staff contacts and approaches | Seated bench and standing stretch station; connected rubber aisle | necessary | None |

### Staff contacts and provenance

- Seated contact: unchanged approved fictional staff `gs026-employee-001/sit-south.png`; ground [1.2, 2.7], cushion [1.2, 2.4196596372377623], approach [1.2, 3.05]. Existing source scale 0.6865478271728273; exact cushion rise 33.64084353146853 proof pixels.
- Standing contact: unchanged approved fictional staff `gs026-employee-004/stand-south.png`; floor/contact/approach [2.7, 2.7], same existing source scale. Mat is walkable; ball is behind the adult and roller is in front by depth.
- Permanent aisle target [2, 3.35]. Bench → real seated staff → source-pixel front rail/legs. The foreground overlaps 542 opaque sitter pixels and leaves the head unobscured. Only the seated contact uses a static seating transition; the standing mat is reached by its walking route.

Twelve built-in `image_gen.imagegen` calls: one concept plus eleven transparent concept-derived outputs, all selected. Twenty prepared sprite slots plus one exact-source bench front create twenty-seven records. Untouched originals, exact prompts, actual tool receipts/input references, SHA-256 hashes, source crops, uniform transforms and registration are retained under `concept/`, `assets/originals/v1/`, `assets/prompts/v1/`, `assets/processed/v1/`, and `assets/provenance-v1.json` / `assets/art-provenance.json`.

Native preparation uses explicit source rectangles, low-alpha <8 cleanup only in prepared copies, one uniform nearest-neighbor transform, and no upscaling. Foreground rectangles are combined into one union before copying the generated bench source once. Floor/seat registration tolerates at most one prepared native pixel (0.25 proof px) of nearest-neighbor rounding; cushion/floor targets retain their measured exact anchors. `stand-in/v1/layout-concept.json` was frozen before native packing; reconciliation makes no geometry changes. Neutral rectangles and three replay images are explicitly post-paint engineering evidence, distinct from generated final art or pre-generation approval.

No external art, readable text, brands, new identity, proprietary source, clinical statements, patient records, gameplay effects, employee home/hiring slot, animation rig or campaign storage. Owner art approval is null and runtime integration remains false.

### Validation output and limits

11040 states = five fixed-look upgrade selections × sixteen north-backing combinations × (closed + sixteen singles + 120 pairs + all doors). 103680 routes / 81572560 radius-clear samples and 103680 occupied routes / 82191200 samples pass at 0.005 tile spacing and 0.18-tile actor radius, including full outside/inside portal thresholds, solid footprints, measured opaque floor bands and the other occupied staff contact. The bench’s seated foot band remains a blocker even when the actor is hidden. No pass-through exception or radius reduction exists.

All sixteen one-tile wall sections are legal doors: N1–N4, S1–S4, WA–WD, EA–ED. Necessary bench, its front rail, mat, ball, roller, contacts, approaches and rubber aisle never hide. Optional wall-row pieces hide only for owned doors; corner pieces can serve both adjoining wall sections. Four north backing controls hide corresponding mirror/poster/hooks only, retaining full-height floor equipment. Opening additional doors only removes optional blockers; 690 monotonic checks extend the single/pair route proofs to all 65,536 door combinations, sixteen backing states and five upgrades.

The dedicated front-row regression covers 17920 visibility states, all 480 floor-view columns with the front closed, and 2880 occupied routes / 2276640 samples from the twelve non-south doors. No default front gap is left. All five native appearances are byte-identical. Actual fixture/mat paint with staff hidden occupies 60.6% of the floor view; solid equipment without the mat occupies 48.7%. These are visible composition metrics, not collision area or owner approval.

```text
node tools/room-design/level-5/staff-gym/reconcile.mjs
RECONCILIATION PASS: unchanged concept layout; tile-filled rear/front plinths exactly abut; permanent contacts and footprints; bench cushion/floor within one prepared native pixel.

node tools/room-design/level-5/staff-gym/proof/build.mjs
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 bench foreground / 27 records; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.

node tools/room-design/level-5/staff-gym/proof/validate.cjs
VALIDATION PASS: room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 source-pixel bench front; 2 unchanged approved staff stills in scrubs (seated/standing); 11040 door/backing states; 103680 routes / 81572560 radius-clear samples at 0.005T; 103680 occupied routes / 82191200 samples; all 16 doors; permanent stations/aisle, continuous wall rows, plinth seams, visibility/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/staff-gym/proof/validate-south.cjs
SOUTH VALIDATION PASS: continuous S1-S4 storage / 480 columns; owned-door visibility and necessary equipment across 17920 states; 2880 occupied routes with south closed / 2276640 radius-clear samples; corner sections open only for their selected S/W/E door.

node tools/room-design/level-5/staff-gym/proof/validate-controls.mjs
CONTROL VALIDATION PASS: 335 Node handler checks; 5 fixed-look upgrade buttons, 16 door buttons, 4 backing buttons, 4 bulk buttons, 2 staff contacts, keyboard, real-error/performance-warning discrimination; browser separate.

node tools/room-design/level-5/staff-gym/proof/inspect-composition.mjs
COMPOSITION INSPECTION PASS: equipment and mat with staff hidden cover 60.6% of the floor view; solid equipment alone 48.7%; concept/empty/two-contact comparison saved.

node tools/room-design/level-5/staff-gym/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 120 actual-render states across 5 fixed-look upgrades; default/empty/individual seated/standing staff/contacts/routes/all 16 doors/backing; browser QA separate.

node tools/room-design/level-5/staff-gym/stand-in/v1/replay.mjs
STAND-IN REPLAY PASS: 20 neutral registered geometry frames; 3 actual native replay views; all 16 single-door occupied routes; painted files and frozen layout unchanged.

node tools/room-design/level-5/staff-gym/proof/reproduce.mjs
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 bench foreground / 27 records; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.
BUILD PASS: painted; room-first 4x4; 1 fixed look / 5 upgrades; 20 derived sprites + 1 bench foreground / 27 records; 16 one-tile doors; 2 permanent staff contacts and rubber aisle; no home/hiring slots.
REPRODUCIBILITY PASS: 33 delivered files byte-identical across two native rebuilds.

node tools/room-design/level-5/staff-gym/proof/check-helpers.cjs
BROWSER HELPERS READY: syntax PASS; installed Playwright resolves; browser execution separate.

node tools/room-design/level-5/staff-gym/proof/check-http.mjs
HTTP VALIDATION PASS: 33 current proof resources return 200 with matching bytes at http://127.0.0.1:4191; existing server unchanged.

node tools/room-design/level-5/staff-gym/proof/check-http.mjs --phone
HTTP VALIDATION PASS: 33 current proof resources return 200 with matching bytes at http://127.0.0.1:4192; existing server unchanged.

node tools/room-design/level-5/staff-gym/assets/write-provenance-v1.mjs
ART PROVENANCE PASS: 1 built-in concept + 11 transparent derivations (all selected); 20 sprites + 1 exact-source bench front / 27 records; prompts/receipts/originals/crops/transforms/hashes; 2 unchanged approved scrubs staff stills; owner approval pending.

node tools/room-design/level-5/staff-gym/proof/record-browser-attempt.mjs
BROWSER ATTEMPT RECEIPTS SAVED: actual Playwright spawn EPERM and connected-browser sandbox setup failures; no browser PASS or screenshots claimed.
```

The actual browser validator and capture both failed before Chrome opened with `browserType.launch: spawn EPERM` (exit 1). Connected-browser initialization was tried twice and failed with `windows sandbox failed: helper_unknown_error: setup refresh had errors`. Full errors and final manifest hashes are in `proof/evidence/v1/browser-validation-report.json`, `browser/capture-report.json` and `connected-browser-attempt.json`. Browser PASS, browser screenshots and owner approval are not claimed.

Manager recovery, from the repository root with the existing port-4191 server running:

```text
node tools/room-design/level-5/staff-gym/proof/validate-browser.cjs
node tools/room-design/level-5/staff-gym/proof/capture.cjs
```

Helpers compile and installed Playwright resolves. Validator checks served art/still/code hashes, all 11,040 door/backing states and occupied routes, real controls, keyboard, desktop concept-beside-playable layout and stacked 320px layout. Capture covers 120 room states plus five desktop/five narrow pages. Page exceptions, console errors, failed requests and HTTP errors are fatal; Canvas readback performance advisories are classified separately.

Detailed outputs and native images: `tools/room-design/level-5/staff-gym/proof/evidence/v1/`; exact command receipt: `validation-outputs.json`; comparison: `concept-playable-comparison.png`. Worker handoff: `tools/room-design/level-5/staff-gym/WORKER_HANDOFF.md`.

### Open owner questions and handback

- Owner: approve the cohesive 4×4 room, equipment density, palette and fixed appearance, or identify visual adjustments.
- Owner: approve the seated bench and standing mat placements and optional wall-row hides for alternate doorways.
- Manager: inspect actual files and native comparison, rerun browser validator/capture at desktop and 320px, record owner art acceptance, update the global handoff and arrange the checkpoint reminder. Staff-break morale behavior remains outside this mockup; nothing was simulated.

Worker writes are confined to `tools/room-design/level-5/staff-gym/**` and one appended `Step: Staff Gym mockup` section in the shared Level 5 room plan. The current plan prefix is preserved byte-for-byte at append time, including the concurrent Indoor Garden correction. Shared reference changes are reported and preserved. No runtime/game/balance/save, global-handoff, shared-room, server or launcher edits; no agents, installs, staging, commit, push, publication or external messages.

One read-only `git status --short` was inadvertently run at initial intake despite the brief’s no-Git rule; it was disclosed immediately. No later Git command was run. This valuable checkpoint remains local only. The manager owns the reminder to say **“push to GitHub”** after acceptance; this worker has no Git authorization.
