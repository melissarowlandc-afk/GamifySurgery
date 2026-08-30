# Replace Patient Roster with Fifty Authored Adult Humans

## Goal

Retire the current runtime use of the shared twenty-person v3 civilian
contact-sheet artwork and introduce fifty stable, visibly distinct, adult human
patient identities. The same roster also supplies noninteractive sidewalk
passers. Every new identity must be recognizable and consistent in the map,
walking, chair, examination-table, thumbnail, and detailed chart portrait;
have known presentation sex/gender and an adult age band; and be selected to
match a frozen patient vignette's recorded demographic data without using
identity, race, or ethnicity to select clinical content.

This is a visual/presentation milestone. It must not change clinical concepts,
case selection, FSRS, rewards, balance, routing rules, staffing, room rules, or
patient demographics authored in clinical content.

## Current Repository State (audited 2026-08-27)

### Existing identity and save model

- `packages/game-domain/src/types.ts` defines `PixelAppearanceDescriptor` with
  version `pixel-avatar.v1`, descriptor fields, and a `PixelAppearanceVariant`
  union only covering `0..29`. It is persisted in encounters, employees, and
  ambient pedestrians.
- `packages/game-domain/src/appearance.ts` creates deterministic patient
  descriptors from the `patientAppearance` random stream and then uses
  `normalizePatientAppearanceForSex` to force legacy human variants `0..9`
  (masculine presentation) or `10..19` (feminine presentation). It currently
  accepts sex but not age.
- New encounters call `createPatientPixelAppearance` in
  `packages/game-domain/src/reducer.ts` only after the frozen clinical case is
  selected, and have access to `prototypeDemographics.ageYears` and
  `prototypeDemographics.sexLabel`. Persisted migration in
  `packages/game-domain/src/persistence.ts` normalizes an existing appearance
  or deterministically creates one when absent.
- Ambient pedestrians use the same `createPatientPixelAppearance` in
  `packages/game-domain/src/ambient-pedestrians.ts`, with an independent,
  persisted sidewalk-pedestrian sequence and the separate
  `RANDOM_STREAMS.sidewalkPedestrians` scheduling stream. This is the correct
  seam to reuse the civilian roster without creating a patient encounter.
- `apps/player/src/content/patientAppearanceCatalog.ts` honestly declares the
  present twenty-entry expansion seam. It is not used by the domain picker and
  must become the canonical roster metadata rather than remain a disconnected
  catalog.

### Existing render model

- Ordinary patients, staff, and ambient pedestrians resolve through v3 actor
  atlases: 5 columns x 6 rows, 30 cells, `160 x 240` cells, via
  `CHARACTER_ATLASES_V1` in `apps/player/src/art/bitmapAssetManifest.ts` and
  `characterBitmapArt.ts`. Only left-side gait art exists; east travel flips it.
- Founders now use a separate clean full-actor `founders-v4-r6` package. Their
  recently repaired pipeline is intentionally founder-only and must not be
  regressed or reused as generic patient art.
- `PixelAvatar.tsx` renders portraits and UI full sprites from atlas cells;
  `FacilityScene.ts` renders Phaser actor images from the same resolved
  descriptor. It has a safe bitmap fallback to the older deterministic SVG
  renderer. `CharacterQaGallery.tsx` exposes matching map/portrait frames for
  current people.
- `FacilityScene` maps each patient and ambient pedestrian via the persisted
  descriptor and route presentation. It does not own random identity
  generation. This preserves the no-teleport route contract.

### Visual and product constraints

- `docs/features/visual-art-direction.md` requires full-character identity
  continuity, crisp nearest-neighbor art, detailed portrait/map correspondence,
  and a developer-only QA gallery. It records the current twenty-person patient
  catalog only as a temporary seam toward a larger adult-human roster.
- Approved local reference material is under `Photos for Codex/`; the obsolete
  `Visual Example (outdated, don't use).png` remains excluded. The recent
  founder-plan references (`exec-039...`, `exec-a921...`, and
  `exec-44a...`) govern the desired original pixel-art density, natural human
  skin/hair treatment, oblique seated poses, and map/portrait relationship.
- Existing active saves may contain patient and passer descriptors with no new
  identity field. They must remain visually stable after migration. Do not
  delete the v3 assets or mutate historic frozen encounters merely to replace
  their cosmetic art.

## Decisions for This Milestone

1. **Canonical patient identity.** Add an optional, presentation-only stable
   `patientIdentityId` (for example `patient.adult.001`) to
   `PixelAppearanceDescriptor`. Keep existing descriptor fields and version
   for compatibility. `patientIdentityId` is the authoritative live selector
   for patient atlases; `headVariant`/`bodyVariant` remain legacy/founder
   compatibility values and must not be expanded to overload fifty patient
   identities.
2. **Roster characteristics.** Create exactly fifty original, all-human adult
   identities. Each catalog record declares a stable ID, display-safe internal
   label, sex/presentation matching label (`Female`, `Male`, or neutral/
   unspecified only when explicitly intended), adult age band, visual brief,
   and art status. The roster spans young adult, adult, middle-aged, and older
   adult silhouettes; varied natural skin tones, face shapes, hair textures,
   hairstyles, hair colors, body builds, glasses/hearing aids/accessories, and
   ordinary patient clothing. These fields are visual matching metadata only:
   no diagnosis, difficulty, concept, payoff, or disease prevalence may use
   race/ethnicity or a visual characteristic as a selector.
3. **Age/sex matching.** The domain picker receives the frozen
   `prototypeDemographics` profile, not just sex. It filters first by explicit
   sex label when available and prefers compatible adult age bands. If the
   authoring data says `Not specified`, it picks from the full adult roster
   without inventing a chart sex label. If an exact compatible band has no
   roster member, it chooses the nearest declared adult band deterministically
   and records only the selected visual identity; it never edits the vignette
   age or sex. Current prototype content is adults, but callers must retain a
   safe legacy fallback rather than falsely representing a pediatric patient as
   one of this adult package.
4. **Selection and randomness.** New patient identity selection is
   deterministic from the existing `patientAppearance` stream and
   `encounterId`, with a versioned key such as `patient-roster.v1`. The catalog
   is filtered before indexed selection. Ambient pedestrians choose from the
   same roster with a different key based on their existing passer ID; their
   appearance does not consume or perturb encounter selection. No UI/render
   random number source may choose or reroll a person.
5. **Legacy mapping.** Saved `patientIdentityId` wins. A saved human patient
   with no field maps once, purely and deterministically, from its persisted
   sex label plus legacy head variant/encounter ID to an existing entry in the
   compatible fifty-person roster. The migration should retain the original
   descriptor fields and add the resolved ID where persistence policy permits;
   a render-time fallback must make it safe even before the next save. Existing
   saved ambient pedestrian IDs map by their own persisted ID, preventing a
   refresh reroll. Do not delete v3 atlases in this milestone: they remain an
   explicit decode/load fallback for malformed or unknown legacy descriptors.
6. **Atlas strategy (revised after visual rejection).** The first r1
   procedural source/atlas draft was rejected because it remained visibly
   coarse and placeholder-like. The canonical source is now the ignored local,
   high-detail `generated_images/patient-character-sources-v1/patient-001.png`
   through `patient-050.png` pose-sheet set, each tied one-to-one to the domain
   roster ID. A deterministic extractor crops the fixed 6x3 sheet contract;
   the derived checked-in runtime atlases live under `apps/player/public/art/`.
   detects the six actors in each source row before crop selection, removes its
   known baked light checkerboard only through per-actor exterior-connected
   flood fill, registers transparent frames,
   builds the 18 runtime atlas families, and records source hashes. It never
   composes heads and bodies or independently generates a pose, which preserves
   identity across gait, sitting, thumbnail, and portrait art. The checked-in
   source sheets are the auditable visual authority; derived atlases remain
   fully reproducible and verifiable.

## Required Pose and Asset Contract

Each roster identity has the following complete, full-person artwork. A
thumbnail can be a deliberately framed/cropped representation generated from
the same canonical identity, but must not be a newly randomized portrait.

| Family | Frames | Required use |
| --- | ---: | --- |
| Standing | front, left, right, back | stationary actor after routing |
| Walking | front A/B, back A/B, left A/B, right A/B | each A/B pair has visibly opposite lead legs; east faces east |
| Sitting | front, oblique-left, oblique-right | waiting chairs and seated states |
| Exam table | one seated/exam-table pose | patient examination presentation |
| UI | thumbnail, detailed portrait | chart list and expanded chart |

This is **18 authored render families** per identity (900 actor/portrait
outputs total). The runtime must treat every map pose as a unified transparent
actor, never as separately composited head and body layers.

### Registration and geometry

- Map actor cells: `96 x 144 px`, shared full-actor canvas, alpha corners,
  `floorX=48`, `floorY=136`, eight-pixel transparent safety margin below the
  visible feet. Use this only after measured asset lint confirms every map
  family shares the baseline; do not crop individual hair, limbs, or feet.
- Map atlases: 5 columns x 10 rows, 50 identities, therefore `480 x 1440 px`
  per map pose. One atlas per family is straightforward to preload, atlas crop,
  and inspect.
- Detailed portrait cells: `192 x 224 px`; use a 5 x 10 portrait atlas of
  `960 x 2240 px` (or per-identity portraits with a manifest only if browser
  decoding/memory measurements reject the atlas). Portraits use a larger
  native face/clothing drawing, still driven by the same identity definition.
- Thumbnail cells: a separate `96 x 112 px` 5 x 10 atlas, or a documented CSS
  crop of the detailed portrait only if it preserves crisp scaling and does not
  stretch/cut hair. Choose one implementation and make it a tested invariant.
- Seat/table anchors must be explicit in the manifest: floor contact remains
  consistent for a map actor while hip/seat contact aligns to the existing
  chair and examination-table coordinates. Oblique seated directions are
  approximately 45 degrees, not mirrored 90-degree profile placeholders.
- Right/left art is explicit wherever clothing, hairstyle, accessory, or body
  asymmetry would make a mirror inaccurate. If a specific pair is mirrored by
  design, declare it in the source manifest and test actual `flipX`; never
  flip merely because a direction metadata flag says east.

## Architecture and File Ownership (sequential)

### Milestone 1 — Roster schema and deterministic selection (Terra)

**Own:**

- `apps/player/src/content/patientAppearanceCatalog.ts` and its tests
- `packages/game-domain/src/types.ts`
- `packages/game-domain/src/appearance.ts` and tests
- focused reducer/persistence/ambient-pedestrian tests only as required

**Implement:** The 50-record catalog, `patientIdentityId`, demographic-aware
picker, compatibility mapping, and separate deterministic keys. Change new
encounter creation and persistence normalization to supply frozen age/sex. Keep
clinical content unchanged. Add no assets yet; production resolver may retain
the old visual fallback until Milestone 2 is integrated.

**Acceptance:** fifty unique stable IDs; all adult/human; matching filters;
same campaign+encounter maps identically through refresh; legacy descriptor
maps deterministically; ambient identity never changes patient RNG.

### Milestone 2 — Canonical patient art source and asset builder (Terra)

**Own:**

- `tools/build-patient-actors-v1.mjs`
- `tools/verify-patient-actors-v1.mjs`
- `apps/player/public/art/characters/patients-v1/**`
- `artifacts/screenshots/patient-v1-*.png`
- narrowly related asset-builder tests/documentation

**Implement:** Deterministically extract every required pose atlas from the
checked-in high-detail canonical 6x3 source sheets. Write a machine-readable
manifest with cell, baseline, pose, source filename/hash, and content revision;
write checkerboard visual proofs: all 50 front/thumbnail/portrait pairs,
complete directional gait grid, and seating/exam-table grid.

**Acceptance:** no edge contamination, no alpha holes in light/dark skin or
clothing, no clipped heads/feet, visible A/B stride alternation, same identity
signature throughout every family, and original assets only. The verifier must
fail on a missing identity/pose, inconsistent baseline, duplicate full
appearance signature, alpha hole, or mismatched identity metadata.

### Milestone 3 — Renderer integration and old runtime-use retirement (Terra)

**Own:**

- `apps/player/src/art/bitmapAssetManifest.ts`
- `apps/player/src/art/characterBitmapArt.ts` and tests
- `apps/player/src/ui/PixelAvatar.tsx`
- `apps/player/src/facility/FacilityScene.ts` only for renderer/pose mapping
- `apps/player/src/ui/CharacterQaGallery.tsx` only for patient frames
- focused CSS/tests/e2e as needed

**Implement:** Add versioned patient atlas texture IDs and URLs; resolve a
patient descriptor with known `patientIdentityId` to patient-v1 rather than v3.
Keep founder r6 resolver untouched. Map pose/render selection must support all
four travel directions and both stride phases; chair and exam-table callers use
the correct pose. Portrait and list thumbnail use the correct dedicated family.
Existing employees remain v3 unless another approved milestone changes them.
The only retired behavior is ordinary runtime use of v3 for patients and
sidewalk passers; do not delete v3 source files yet.

**Acceptance:** current patient, returning/off-site patient, and passer retain
their same identity in Phaser, chart, left list, alerts/locator thumbnails, and
QA gallery. Existing saved patients do not vanish or become nonhuman. New
texture revision prevents stale Phaser atlas reuse after HMR/reload.

### Milestone 4 — Browser proof, save migration, and regression review (Terra)

**Own:** focused Playwright tests/screenshots and this ExecPlan progress only.

**Implement/verify:** Create a clean campaign plus a legacy fixture campaign,
exercise patient arrival, chart portrait/list thumbnail, waiting chair,
examination table, four-direction movement, off-site return, and ambient
passer. Inspect desktop and phone widths plus the developer QA gallery. Verify
that patient routing and clinical state are not changed by art replacement.

**Acceptance:** no visual identity switch mid-walk, no transparent-body/other
actor leakage, full feet/heads, stable save/reload, adult age/sex presentation
matches chart, and v3 remains an explicit fallback only.

## Validation Matrix

1. Catalog unit tests: exactly 50 authored humans, unique stable IDs, complete
   pose metadata, no accidental nonhuman/founder IDs, valid adult age bands,
   sex compatibility filtering, and no clinical selection field.
2. Game-domain tests: deterministic new identity selection, independent
   ambient selection, Female/Male/Not-specified behavior, legacy migration, and
   invalid/missing descriptor fallback.
3. Asset verifier: 18 pose families x 50 cells, transparent corners/safety
   margins, same anchor, no large alpha holes, consistent canonical identity,
   A/B gait difference, right-facing right gait, and portrait/thumbnail match.
4. Player unit tests: patient resolver chooses only patient-v1 atlases;
   founders remain r6; cell CSS backgrounds crop row/column accurately;
   portrait/list/map resolve the same ID.
5. Browser tests: new patient absent before check-in but correct when visible;
   map/chart/list/off-site return continuity; all direction/stride frames;
   ambient passer has no chart; QA gallery covers representative patients or a
   paginated all-50 view; desktop and phone readable.
6. Regressions: `npm test --workspace @gamify-surgery/game-domain`, `npm test
   --workspace @gamify-surgery/player`, workspace typecheck, Pages build,
   focused Playwright, asset builder/verifier, and `git diff --check`.

## Risks and Mitigations

- **Memory/texture size:** 18 large atlases could inflate browser decode memory.
  Load only pose families needed for current scene when practical, measure
  decoded texture count, and retain one revisioned pack rather than repeatedly
  adding stale packs. Do not silently replace assets with lower-detail
  placeholders to avoid this; report measured constraints.
- **Source identity drift:** the canonical source sheets contain the complete
  pose set for one person. The extractor does not create replacement people;
  source hashes, atlas lint, and proof grids prevent a source substitution from
  silently changing an identity.
- **Baked source checkerboard:** all current supplied sheets are opaque PNGs
  with a high-neutral light checkerboard rather than alpha. The r3 extractor
  first identifies the actual actor component in each source row, crops with a
  safe perimeter, then flood-fills only checker-like pixels connected to that
  crop's exterior. It retains enclosed white hair and pale clothing; a second
  component pass removes remote extraction noise. Follow-up cleanup removes a
  detached near-neutral island even if it is close to the actor, while retaining
  components with a dark outline or chromatic detail. The verifier checks
  transparent runtime perimeters and remote components across every family for
  regression cells 003, 017, and 018.
- **Demographic mismatch:** pass frozen age/sex directly to visual selection;
  make display metadata explicit and test it. Visual presentation never drives
  clinical selection.
- **Legacy saves:** render fallback is mandatory before an optional persistence
  writeback; no old encounter needs destructive resimulation.
- **Scope creep:** people walking by are the same adult civilian roster but
  have no charts or mechanics. Employees, founders, rooms, and gameplay are
  out of scope.

## Progress

- [x] Audited all identity creation, persistence normalization, ambient passer,
  Phaser, React, atlas, QA, test, design-document, and local-reference seams.
- [x] Defined the fifty-adult roster contract, 18-family pose topology,
  geometry, identity matching, save fallback, and validation plan.
- [x] Milestone 1: implement schema/catalog/selection.
- [x] Milestone 2: r3 clean extraction visually accepted by Sol.
- [x] Milestone 3: integrate renderer and retire v3 runtime patient/passers.
- [x] Milestone 4: visual/save/browser acceptance.

## Exact Next Action

Complete. Keep patient-v1 regression coverage with any future renderer or
persistence work. Do not add an exam-table presentation inference until a
separate approved facility-view semantic flag exists.

## Milestone 1 Discoveries

- The player-side catalog was previously a disconnected twenty-entry display
  seam. The new source of truth is `packages/game-domain/src/patientAppearanceCatalog.ts`;
  the player module is intentionally a thin re-export.
- `patientIdentityId` is optional presentation-only persisted metadata, so
  legacy descriptors, founder descriptors, and staff descriptors remain valid.
  New patients and ambient pedestrians receive it now, while renderer use stays
  unchanged until the patient-v1 atlas milestone.
- Frozen case age/sex are available before a new encounter's appearance is
  created. New patient selection uses them only to choose compatible visual
  metadata after clinical selection. Ambient pedestrians use the same roster
  with a distinct deterministic purpose scope and never create an encounter.
- Existing saved patient descriptors gain a stable roster identity through
  persistence normalization without changing their legacy visual fields.
- Legacy ambient pedestrians now use the same save-safe normalizer with their
  persisted passer ID in the deterministic key. Repeated load of the same raw
  save resolves the same roster identity and cannot perturb encounter identity
  selection.

## Milestone 2 Discoveries

- The supplied one-per-person source sheets are `1536 x 1024` opaque PNGs. The
  6x3 panel contract remains stable despite fractional row boundaries; the
  extractor uses rounded proportional panel edges rather than assuming an
  evenly divisible height.
- The visible light checkerboard is baked into the source alpha channel. A
  source-contract audit found that the original `patient-019.png` lacked its
  second back-walk panel; its preserved sibling backup is
  `patient-019-source-defective-back-b.png`. Sol-approved replacement source
  restored a 50/50 valid six-panel-per-row corpus.
- The r3 builder no longer assumes exact panel crops, because artwork can
  intentionally extend across nominal grid boundaries. It detects one actor
  per source-row slot, crops only that actor, and applies exterior-connected
  checker removal; this prevents checker/neighbor contamination while retaining
  pale clothing and white/gray hair. The r3 verifier checks 18 atlas families,
  transparent edges, remote components, explicit A/B movement differences,
  left/right distinction, source hashes, and 003/017/018 regressions.
- Sol found residual pale checker fragments around `patient.adult.017` in the
  actual front and portrait atlases despite the overview proof. Cleanup now
  applies both before and after nearest-neighbor registration, so a detached
  neutral source fragment cannot reappear as a scaling artifact. The complete
  003/017/018 pose set is explicitly rechecked by the verifier.
- The public pack contains 16 map atlases at `480 x 1440`, one thumbnail atlas
  at `480 x 1120`, and one portrait atlas at `960 x 2240`, with an estimated
  decoded RGBA footprint of 52.4 MiB if all families are resident. Milestone 3
  should avoid preloading every family at once unless Phaser texture behavior
  proves the cost acceptable.

## Milestone 3 Discoveries

- Milestone 3 keeps the existing 29 v3/founder scene sheets as the eager base,
  then adds only the 12 patient-v1 idle/walking map families to initial Phaser
  loading. The three seated families are requested only when a real waiting
  patient needs them; chart portrait and list-thumbnail families remain normal
  browser image requests and never enter Phaser's texture cache. This avoids
  decoding the full 52.4 MiB patient package at scene creation.
- A known persisted `patientIdentityId` now maps directly to its zero-based
  5 x 10 v1 atlas cell in Phaser and React. Patient-v1 supplies explicit left
  and right travel frames, so eastbound art never flips. Missing, malformed,
  or legacy-safe IDs retain the existing v3/SVG renderer; founders stay r6 and
  staff stay v3.
- Current facility state safely distinguishes waiting-chair presentation and
  therefore uses the authored seated front/left/right frames. It does not yet
  expose a semantically distinct exam-table occupancy flag, so Milestone 3
  deliberately does not infer that pose from a broad `active` status; the
  authored exam-table frame remains available for a later presentation-only
  view-model addition rather than changing clinical/routing state here.

## Milestone 4 Evidence and Discoveries

- Browser acceptance ran against the actual Vite/Phaser application, using a
  clean campaign and then a persisted Level 1 visual state which intentionally
  contains legacy patient descriptors without `patientIdentityId`. Loading
  through production persistence deterministically assigned their roster IDs;
  a selected patient's ID survived page reload while its list thumbnail and
  chart portrait both resolved through patient-v1.
- The accepted captures are `artifacts/screenshots/patient-v1-map-list-chart-desktop.png`,
  `artifacts/screenshots/patient-v1-map-list-phone.png`,
  `artifacts/screenshots/patient-v1-qa-gallery-desktop.png`, and
  `artifacts/screenshots/patient-v1-ambient-passer-desktop.png`. Visual review
  found matching map/list/chart people, clear feet and heads, no checkerboard
  leak, no transparent-body contamination, and a readable phone view.
- The QA gallery exposed all fifty canonical roster records in the running app
  and showed authored thumbnail, map, left/right movement, seated, and portrait
  frames from each stable identity. The all-person directional A/B contact
  proof remains `artifacts/screenshots/patient-v1-gaits.png`; resolver unit
  coverage verifies each direction/stride family without altering routes to
  manufacture a travel path.
- A persisted ambient passer with `patient.adult.035` retained that exact ID
  after normal app reload and did not create a patient-chart control. The
  browser fixture also verifies the safe legacy route: descriptors missing the
  new field migrate deterministically; malformed descriptors continue to have
  the explicit v3/SVG resolver fallback covered by focused renderer tests.
- The existing real browser walkthrough for movement, sequential feedback,
  off-site departure/return, and settlement also passed during this acceptance
  run. The game-domain routing regression separately asserts that the same
  retained encounter returns before its result becomes actionable; no new
  routing semantics were introduced for patient-v1 art.
- Resource behavior remains intentionally split: Phaser eagerly decodes the
  twelve idle/walk patient map atlases, seat frames load when needed, and React
  requests only the displayed thumbnail/portrait image. The complete authored
  pack remains an estimated 52.4 MiB decoded RGBA if all eighteen families are
  resident. No full-pack Phaser preload was observed or introduced.
