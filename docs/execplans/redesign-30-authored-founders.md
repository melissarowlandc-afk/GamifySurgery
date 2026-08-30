# Thirty Authored Founder Characters — Preproduction Contract

## Goal

Replace the current paired-contact-sheet founder presentation with thirty
individually authored, coherent characters. Each selectable founder is a whole
person (or whole nonhuman character), not a head that is composited with an
independently selected body. The resulting asset package must support the same
identity in the creator, facility, portrait, happy ending, desk work, and
movement without a neck seam, stray contact-sheet content, a skin mismatch, or
an east/west-facing error.

This is a preproduction contract. It deliberately does **not** change current
gameplay, campaign data, clinical content, routing, or room rules. It prepares
the next authored-art milestone and the owner-facing mockups requested before
that integration starts.

## Reference authority

The following project-local images were inspected for this contract:

- `Photos for Codex/exec-039cd8a8-750b-4278-a09e-ae8c4464ff80.png` — desired
  individual portrait/map-scale relationship, facial readability, clothing
  detail, natural hair and skin treatment, and nonhuman treatment.
- `Photos for Codex/exec-a921f897-d3b4-4632-9e4f-0ed6791bef2f.png` and
  `Photos for Codex/exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png` — desired
  clinical-map scale, oblique side views, seated actors, desk work, line weight,
  and contact shadows.
- `generated_images/founder-character-mockups-v2/*` — ignored local owner-review
  source material with accepted variety and
  inclusive human/nonhuman coverage to retain, while replacing the independent
  head/body presentation.
- `Photos for Codex/Head body mismatch.PNG` — controlling defect reference:
  an unrelated fragment above the actor and a head/body relationship that no
  longer reads as one person are unacceptable.

`Photos for Codex/Visual Example (outdated, don't use).png` is explicitly
excluded and must not influence either mockup generation or integration.

## Decisions and non-goals

- The owner approved the thirty founder designs for live integration on
  2026-08-27, with one required correction: every founder must have two visibly
  alternating foot phases for each of the four travel directions. Runtime must
  therefore expose eight distinct walking frames (`front-a/b`, `left-a/b`,
  `right-a/b`, and `back-a/b`) rather than reusing one side pair everywhere.
- This integration is founder-only. Patients, employees, rooms, gameplay,
  timing, routes, balance, clinical content, progression, and save semantics
  remain unchanged.
- The creator presents **30 unified founder identities**, in a single selector.
  It no longer invites a player to make 900 independent head/body combinations.
- The categories are presentation/visual-design groups, not gameplay roles,
  gender rules, traits, or clinical abilities: 10 masculine-presenting humans,
  10 feminine-presenting humans, and 10 nonhuman founders.
- The twenty human founders include varied natural hair textures, hair colors,
  skin tones, ages, facial features, glasses, and accessories. No label
  describes someone merely by hair color.
- Each human presentation group includes at least three long white-coat
  selections. All 30 entries are coherent whole-character outfits.
- All art is original, crisp pixel art. It may take proportion, scale, pose
  language, and visual density from the approved project mockups; it must not
  copy third-party sprites or assets.
- The current current-save fields (`headId`, `bodyId`, `headVariant`,
  `bodyVariant`, and `appearance`) remain persisted compatibility data. New
  campaigns write matching paired values for the selected identity. Legacy mixed
  pairs remain loadable and use a deterministic render-only projection.
- This milestone does not yet create the approximately 150 unique patient
  identities requested for the future. It creates the authored-actor contract
  those patients will use. A future patient pack must not claim repeated
  recolors/combinations are 150 distinct characters.

## Canonical founder roster

Stable IDs remain `founder.01` through `founder.30`; `head.01`/`body.01`
through `head.30`/`body.30` remain their compatibility aliases. The display
labels below are intentionally identity- and silhouette-led rather than
hair-color-led.

| ID | Creator label | Group | Individual visual brief | Signature outfit |
| --- | --- | --- | --- | --- |
| 01 | The Attending | masculine human | Calm broad-browed clinician, close cropped texture, warm deep complexion, small stud and relaxed expression. | Long white coat, dark V-neck top, badge, straight trousers. |
| 02 | The Chart Keeper | masculine human | Angular face, side-parted hair, round glasses, precise posture. | Tailored scrubs with clipped pen and low-profile shoes. |
| 03 | The Quick Study | masculine human | Youthful face, tousled curls, freckles, alert eyebrows. | Zip jacket over scrub top, lanyard, practical sneakers. |
| 04 | The Rounds Doctor | masculine human | Short twists, gentle square face, understated headband, grounded stance. | Long white coat, open collar, ID badge. |
| 05 | The Evening Consult | masculine human | Bare scalp, full beard, rectangular glasses, older adult facial lines. | Knit vest over collared shirt, clinic trousers. |
| 06 | The Clinic Runner | masculine human | Sculpted quiff, narrow face, focused eyes, athletic build. | Short clinical jacket, tucked scrub pants, wristwatch. |
| 07 | The Senior Fellow | masculine human | Soft side part, neat moustache, silver at the temples, reassuring expression. | Patterned utility overshirt over scrubs. |
| 08 | The Night Shift | masculine human | Side-swept waves, oval face, small hoop earring, slightly rumpled charm. | Open longline coat over dark scrubs. |
| 09 | The Procedure Lead | masculine human | High loc knot, defined jaw, small temple scar, steady expression. | Pocketed scrub jacket, clipped badge, sturdy shoes. |
| 10 | The On-Call Surgeon | masculine human | Bare scalp, full beard, prominent smile lines, compact broad frame. | Long white coat, dark knit layer, stethoscope pocket loop. |
| 11 | The Lead Clinician | feminine human | Shoulder-length waves, rounded face, expressive brows, quiet confidence. | Long white coat, fitted scrub top, badge. |
| 12 | The Analyst | feminine human | Blunt bob, square glasses, fair complexion, crisp attentive posture. | Tailored scrubs, pen pocket, ankle shoes. |
| 13 | The Organizer | feminine human | High ponytail, dark warm complexion, oval face, gold stud detail. | Cardigan over blouse and clinic trousers. |
| 14 | The Consult Specialist | feminine human | Twin braids, freckles, compact stature, bright focused expression. | Long white coat, collared shirt, neatly cuffed trousers. |
| 15 | The Quick Consult | feminine human | Textured pixie cut, older adult facial definition, geometric earrings. | Tunic scrub coat, tapered trousers, name badge. |
| 16 | The Long Call | feminine human | Long loose curls, deep complexion, relaxed gaze, gold hoop detail. | Wrap scrub blouse, straight pants, soft-soled shoes. |
| 17 | The Note Taker | feminine human | Low ponytail, round glasses, soft smile, practical silhouette. | Knit top and clinic skirt/trousers with card pocket. |
| 18 | The Clinic Builder | feminine human | Loc bun, high cheekbones, broad frame, decisive posture. | Utility vest over scrub blouse, practical shoes. |
| 19 | The After-Hours Doctor | feminine human | Bare scalp, earrings, mature face, confident warm expression. | Long white coat over a crisp dark blouse and trousers. |
| 20 | The Headwrap Scholar | feminine human | Patterned headwrap, warm deep complexion, round glasses, subtle lipstick. | Layered blouse, long skirt/trousers, badge clip. |
| 21 | Cat Clinician | nonhuman | Tabby cat with striped forehead, alert ears, pale muzzle, curled tail. | Petite scrub set and tiny ID badge. |
| 22 | Penguin Resident | nonhuman | Round penguin with distinct dark hood, cream face, bright beak. | Compact scrub tunic, badge, short dark feet. |
| 23 | Fox Specialist | nonhuman | Fox with tall ears, tapered muzzle, cream cheek ruff, brush tail. | Neat scrub jacket with a tail-safe back seam. |
| 24 | Rabbit Fellow | nonhuman | Long-eared rabbit, whiskers, gentle eye shape, small nose. | Light clinic coat with a seated-tail clearance. |
| 25 | Owl Consultant | nonhuman | Broad owl silhouette, layered feather brow, round glasses, compact talons. | Short clinical vest with badge tab. |
| 26 | Frog Practitioner | nonhuman | Wide-eyed frog with cheek folds, compact body, expressive mouth line. | Simple waterproof-look scrub tunic and badge. |
| 27 | Moon Alien | nonhuman | Tall oval grey alien, wide reflective eyes, two small cheek marks. | Minimal fitted clinic jacket with a high collar. |
| 28 | Antenna Alien | nonhuman | Rounded teal alien, two antennae with tips, large curious eyes. | V-neck scrub tunic with paired antenna-safe silhouette. |
| 29 | Robot Clinician | nonhuman | Boxy service robot with display eyes, side audio modules, antenna lamp. | Built-in clinician apron panel and clipped ID module. |
| 30 | Axolotl Clinician | nonhuman | Soft axolotl face, branching external gills, rounded silhouette. | Small scrub top with gill-safe shoulder openings. |

## Canonical authored pose contract

The repeated user phrase “walk forward” resolves to one forward-walk family
with two alternating stride frames. Every entry is a **complete actor drawing**
for one founder identity. It is not a head/body overlay and cannot expose
neighbouring contact-sheet content.

| Asset key suffix | Required frame(s) | Use |
| --- | --- | --- |
| `map-front-idle` | 1 | Standard map-scale standing-forward pose; the required owner-preview body view. |
| `stand-left`, `stand-right`, `stand-back` | 1 each | Stationary facing used after movement and for direction-appropriate idle. |
| `walk-front-a`, `walk-front-b` | 2 | Forward-facing stride; `a` has left leg forward, `b` has right leg forward. |
| `walk-left-a`, `walk-left-b` | 2 | West-facing stride; `a` has left leg forward, `b` has right leg forward. |
| `walk-right-a`, `walk-right-b` | 2 | East-facing stride, authored or a verified horizontal mirror of the matching left frame. It must face east, never reuse the west art unflipped. |
| `walk-back-a`, `walk-back-b` | 2 | Back-facing stride; `a` has left leg forward, `b` has right leg forward. |
| `seat-front` | 1 | Forward-facing seated view. |
| `seat-left-oblique`, `seat-right-oblique` | 1 each | Approximately 45-degree seated views for chairs and exam tables, not flat 90-degree side silhouettes. |
| `desk-front` | 1 | Forward-facing seated/standing working pose behind a front-facing desk; hands meet the desk surface. |
| `clipboard` | 1 | Upright, readable clipboard/interacting pose with visible hand relationship. |
| `jump` | 2 | Recognizable happy-ending star-jump: airborne apex plus grounded recovery frame. |
| `portrait` | 1 | Detailed chest-up portrait; the required owner-preview portrait view. |

The minimum working package is therefore 20 distinct frames per identity (600
total founder frames), plus optional blink/idle alternates. `map-front-idle`
is the canonical “in-game on map” image, so it is not duplicated under a second
file name. Other roles (staff/patients) may later reuse the pose topology, but
must have their own authored identity package.

## Pixel, registration, and depth contract

The current failure arose from composing untrusted cropped layers. The new
package uses full-character transparent frames and a shared reference origin.

| Item | Recommendation |
| --- | --- |
| Map native canvas | `72 × 104 px` transparent PNG per full actor frame. The standard standing silhouette occupies approximately x `12–60`, y `4–96`; no clipped hair, antennae, tails, or feet. |
| Map floor anchor | `floorX = 36`, `floorY = 96` in every map/standing/walking/seated/clipboard frame. Phaser places and depth-sorts this point only. Shadows sit at y `97–100` and are not included in collision. |
| Map display | Use nearest-neighbor, integer-compatible scaling. Default visual target is approximately `50–58 px` tall at ordinary clinic zoom; all map frames use the same display scale and origin. Do not scale head and body independently. |
| Head/neck relation | Unified full-actor frames have no runtime neck registration. The visible collar/neck overlap is painted as one silhouette. For optional future layers, a shared `neckCenterX=36`, `neckBaselineY=38` is metadata only; they are never used to reintroduce independent founder selection. |
| Standing/walk baseline | Shoes, paws, flippers, wheels, or feet touch y `96`; left/right stride may overhang horizontally but never alter floorY. This prevents bobbing or visible teleport steps. |
| Seat reference | Chair/table surface at y `65`; hip/seat contact is y `65`; feet/paws touch y `96` where visible. Oblique poses preserve the same floor anchor and use a 45-degree chair/table approach. |
| Desk reference | Front-facing desk top crosses y `59–63`; hands/paws meet y `57–61`; lower body may be occluded by the independently rendered desk, never baked into the actor frame. |
| Clipboard reference | Clipboard center approximately x `48`, y `54`; it remains a character-held pose, not a separately floating duplicate in the world. |
| Portrait canvas | `192 × 224 px` transparent or a portrait-card composition. Face/shoulders occupy the central safe area; portrait contains more facial and clothing detail than map art while preserving the same hair, face, skin/fur/feather/material, outfit, and accessories. |
| Portrait crop metadata | `portraitFaceCenterX=96`, `portraitEyeLineY=86`, `portraitShoulderY=158`. UI may crop around these values but must not stretch the portrait. |
| East/west | Prefer authored right-facing frames where asymmetry matters (part, badge, ear, tail, pocket). A tested `flipX` may generate the opposite direction only from an explicitly declared canonical side; Phaser must flip the actual image, not unused metadata. |
| Occlusion | Actor depth equals the world-space floor-contact baseline. Furniture/desk foreground pieces use their own later depth; a character visually passes behind an object only when its floor position warrants it. |

## Asset naming and manifest shape

One actor file per identity/pose is easiest to inspect, QA, and replace:

```text
public/art/characters/founders/v4/
  founder-01-the-attending/
    map-front-idle.png
    stand-left.png
    ...
    portrait.png
    manifest.json
```

The `manifest.json` records the stable compatibility aliases, family,
registration numbers, canonical/derived side rule, and a checksum or declared
content version. Example conceptual fields:

```json
{
  "id": "founder.01",
  "compatibility": { "headId": "head.01", "bodyId": "body.01", "headVariant": 0, "bodyVariant": 0 },
  "kind": "human",
  "map": { "canvas": [72, 104], "floorAnchor": [36, 96] },
  "portrait": { "canvas": [192, 224], "faceCenter": [96, 86], "shoulderY": 158 },
  "poses": { "map-front-idle": { "file": "map-front-idle.png" } }
}
```

## Mockup and capture plan

The user must receive an inspectable owner review package before live
integration. Generation should make a private working pose sheet for all 21
frames of one identity at a time, then produce the following durable review
outputs:

```text
generated_images/founder-character-mockups-v3/ (ignored local owner-review workspace)
  01-10-masculine-portrait-and-map-front.png
  11-20-feminine-portrait-and-map-front.png
  21-30-nonhuman-portrait-and-map-front.png
  pose-sheet-founder-01.png ... pose-sheet-founder-30.png
  README.md
```

Each of the three owner-facing overview sheets shows, for all ten founders:

1. their creator label and stable `founder.##` ID;
2. their **detailed portrait**; and
3. their **map-scale standing-forward (`map-front-idle`) body** on a simple
   transparent/checkered or neutral background.

The individual pose sheets must expose all canonical frames at native scale and
at intended map scale. They are useful internally and for later implementation,
but remain in the ignored local `generated_images` owner-review workspace. No
contact sheet may be used directly at runtime: every live frame is a separate,
transparent, validated asset under `apps/player/public/art/`.

## Save compatibility and data migration

1. Keep the old descriptor fields indefinitely as a compatibility envelope.
2. Add an optional presentation-only `founderIdentityId` for new campaigns;
   it does not alter campaign IDs, FSRS, clinical identity, or gameplay.
3. New selection of `founder.##` writes its existing matching head/body aliases
   and `founderIdentityId` atomically.
4. Legacy campaigns with matching aliases resolve directly to the new founder.
5. Legacy mixed head/body pairs resolve deterministically from `headVariant`
   to a whole-character visual package, preserving their saved source values.
   No save rewrite is required merely to display them.
6. The resolver must be pure and stable across refresh, device, and save/load;
   it must not use gameplay random streams.

## Acceptance criteria

- Thirty individual founder identities exist in the design and each has a
  distinguishable silhouette, face, outfit, and detailed portrait.
- The 20 human options contain the requested inclusive range and at least six
  long-white-coat selections total: three within each human presentation group.
- Cat and Penguin are present among ten nonhuman options.
- Every identity has the exact canonical pose coverage, including both left-leg-
  and right-leg-forward walking frames for front, left, right, and back.
- Seated side poses are 45-degree/oblique and desks are front-facing.
- All frames use the shared full-actor canvas/floor anchor contract, preventing
  detached heads, crop debris, mismatched necks, or nonmatching directions.
- The three required overview sheets in ignored local `generated_images` contain both the
  detailed portrait and map-scale standing-forward image for each founder.
- Existing campaigns continue loading without a destructive migration.
- No gameplay, clinical, progression, room, or routing behavior is changed.

## Validation

- Asset lint: one runtime manifest contains exactly 30 identities and the
  required 20 pose atlases; each identity resolves one frame in every atlas;
  alpha corners are transparent; no nontransparent component touches a
  forbidden frame boundary except allowed intentional tails/antennae.
- Registration lint: every map pose reports the same `floorAnchor`; portrait
  registration matches manifest metadata.
- Visual QA: side-by-side left/right, seat-left/seat-right, desk, clipboard,
  jump, portrait/map pairs for all identities; inspect at native and live-map
  scale for stray fragments or crop leakage.
- Runtime QA: creator, happy ending, Phaser map actor, React portrait, and
  eastbound walk capture show the same selected identity.
- Existing focused appearance/save tests, player suite, typecheck, Pages build,
  and `git diff --check` pass after integration.

## Progress

- [x] Inspected relevant project-local character references, current v3 art
  contract, current founder presets, and the controlling mismatch screenshot.
- [x] Defined the 30 whole-founder roster, required pose topology, registration
  values, review outputs, and compatibility approach.
- [x] Produced the owner-facing mockup sheets and corrected 7 × 3 pose sheets
  in ignored local `generated_images/founder-character-mockups-v3/`; these are review-only
  and have no runtime integration.
- [x] Received owner approval of the redesigned founder roster, contingent on
  exact two-phase walking alternation in all four directions.
- [x] Integrate approved assets into creator, React portrait, Phaser, and
  happy-ending render paths without changing non-founder characters.
- [x] Prove the eight founder walk frames are distinct, direction-correct, and
  alternate their lower-body foot phase for all thirty identities.

## Integration discoveries

- The review sheets are composed on pale neutral panels rather than transparent
  sprite cells. `tools/build-founder-actors-v4.mjs` deterministically removes
  only edge-connected pale panel pixels, then writes compact transparent 5x6
  founder atlases. This keeps the reviewed source sheets immutable and avoids
  any runtime contact-sheet crop or neighbouring-panel fragments.
- Founder walking resolves to explicit v4 front, back, left, and right atlas
  families. A and B are distinct lower-body frames for every founder and
  direction; rightward founder movement does not depend on the old v3 `flipX`
  shortcut. The manifest records `a = left-foot-forward` and
  `b = right-foot-forward`.
- Existing mixed head/body saves remain unchanged. Rendering deterministically
  projects them by their saved head variant to a single whole-founder v4 actor.
- The original 7x3 review sheets were suitable for static pose/portrait
  extraction but not reliable as gait source panels. Dedicated approved 4x2
  gait sheets now live in ignored local `generated_images/founder-character-mockups-v4/gaits/`.
  Their strict row-major source contract is extracted directly into each of the
  eight runtime gait atlases; no walk phase is derived by flipping or moving a
  leg from an idle frame. `artifacts/screenshots/founder-v4-gait-proof.png`
  is generated from those runtime atlas cells.
- The initial live v4 gait sheets were independently generated and did not
  preserve the approved founder identity order. They are **not runtime
  sources**. Revision `founders-v4-r3` rebuilds all eight walking families from
  the corresponding approved v3 21-panel pose sheet. Revision `r4` derives
  **both** front A and front B from canonical front idle, with a deterministic
  lower-body-only alternating foot transform. This avoids the nonhuman
  pose-sheet cells whose purported front gait was actually a side profile.
  Head, face, torso, coat, badge, accessories, and identity remain untouched.
- The r5 keys and cache-busting URLs make one coherent asset family after a
  reload/HMR update; a long-lived Phaser scene cannot retain an earlier decoded
  walk sheet. Source-panel cleanup keeps only edge-connected neutral panel
  background removable, followed by actor-component isolation. It does not
  broadly delete magenta-like pixels from authored pink/red details.
- The map registration baseline is y=136 of the 96x144 founder cell. Approved
  pose-sheet outputs retain visible feet through y=135 and an eight-pixel
  transparent lower margin, so this aligns the true floor contact without
  clipping or an airborne gap.
- Pale interior recovery now uses an edge-flood only after a five-pixel closed
  non-panel contour is recovered from the source art. This prevents neutral
  panel background from leaking through pale rabbit fur, Axolotl gills,
  white coats, and faces, while leaving actual exterior/limb/tail space
  transparent. The build proof uses a dark/light checkerboard specifically so
  alpha holes cannot hide against a light background. The verifier checks every
  runtime pose atlas for large recovered upper-silhouette alpha holes in
  addition to transparent cell edges and studio-matte residue.
- The clipboard pose is unusually high inside the third-row source panel.
  Generic label-band cropping removed its hair/ears/antennae before extraction.
  Revision `r6` uses a clipboard-only four-pixel top inset, retains the
  complete source head, and records that contract in the manifest. The verifier
  checks all 30 clipboard head zones and the proof renders every clipboard
  frame over a checkerboard; other poses and founder identities remain intact.

## Exact next action

Reload once to receive the `r6` cached assets and verify a founder's clipboard
interaction keeps their full hair/head/ears/antennae while preserving the
approved walk/idle identity and feet. Owner visual acceptance is the only next
milestone; no patients, employees, rooms, or gameplay changes are part of this
work.
