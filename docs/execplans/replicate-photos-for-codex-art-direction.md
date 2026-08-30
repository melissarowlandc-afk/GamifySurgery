# Replicate the Photos-for-Codex Art Direction

## Goal

Replace the current low-resolution procedural room and character presentation with a production-ready, repo-native layered pixel-art system that makes the live Stitchin' Time clinic look materially comparable to the current images in `Photos for Codex`. Preserve the functioning simulation, UI composition, room footprints, doors, routing, saves, balance, and clinical content.

The file `Photos for Codex/Visual Example (outdated, don't use).png` is explicitly excluded. It is not a reference and must never influence this work.

## Requirements

- Treat every other current image in `Photos for Codex` as one coherent reference set, with `exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png` as the primary integrated-clinic comparison.
- Match the reference family's native visual density, proportions, palette, architectural depth, equipment credibility, character readability, pose quality, portraits, landscape texture, and cohesive illustrated finish.
- Preserve the intentionally simpler HUD icon/control treatment shown by `Play, pause, fast forward.PNG`.
- Replace the current procedural art payload where it cannot meet the reference. Keep procedural drawing only for simple HUD icons, highlights, placement previews, selection markers, and safe fallbacks.
- Use separately rendered, original, repo-native transparent pixel assets or layered sprite compositions. Do not flatten the clinic into a screenshot.
- Keep rooms, walls, doors, fixtures, characters, litter, landscaping, and interaction targets as independent objects.
- Preserve nearest-neighbor rendering, hard pixel edges, correct floor-contact depth, and smooth movement.
- Preserve stable room, character, campaign, concept, and appearance IDs. Do not invalidate saves or FSRS history.
- Preserve the canonical 30 heads and 30 bodies, unrestricted pairings, human and nonhuman choices, and all saved appearance identities.
- Map sprites require front, back, side, idle, walk, seated, working, and interaction poses. Founder happy-ending/star-jump art remains supported.
- Profile thumbnails and chart portraits must be higher-detail views derived from the same appearance identity, not unrelated randomized images or enlarged walking sprites.
- Preserve current door-clear zones, square/non-square orientation rules, explicit door objects, imaging-control access, world-north cutaway walls, and all route/navigation semantics.
- Bathroom remains sink and toilet on opposite walls/corners with a fixture-clear candidate door zone on every wall.
- Waiting Room, Examination Room, X-ray Room, Front Desk, Imaging Control, Bathroom, hallways, exterior, landscaping, and current characters must establish the golden live Level 1 slice before broader Level 2 coverage is accepted.

## Constraints and non-goals

- Do not add or revise gameplay, clinical content, progression, balance, staff behavior, room unlocks, or simulation timing.
- Do not copy unrelated commercial-game assets. The supplied project mockups guide original production assets.
- Do not ship the supplied full-scene mockups as room or clinic backgrounds.
- Do not infer door legality, navigation, or collision from bitmap pixels; domain metadata remains authoritative.
- Do not rotate completed perspective artwork mechanically. Use authored orientation variants or room-local packages.
- Do not change existing persisted appearance descriptors or room/door schemas unless a separately reviewed migration is unavoidable.
- Preserve the heavily dirty working tree. Do not reset, revert, clean, commit, push, deploy, or publish unless separately authorized.
- Keep normal gameplay performance stable; preload/cache assets rather than rebuilding detailed pixels every animation frame.

## Relevant repository state

- Branch `beta` contains substantial uncommitted Level 2, clinical-content, visual, and documentation work.
- `FacilityScene.ts` already has correct camera, pointer, room, routing, cutaway-wall, depth, door, and character lifecycle seams.
- `roomVisualLayout.ts` already owns visual orientation and fixture-clear door-zone metadata.
- `characterArt.ts` currently generates 24x36 map frames and 56x64 portraits procedurally. The identities and pose API are reusable; the current pixels are below the target quality.
- `fixtureArt.ts` currently provides procedural `PixelSpriteAsset` fixtures. Its stable fixture IDs are reusable; the current drawings are below the target quality.
- `PixelAvatar.tsx` and `CharacterQaGallery.tsx` already expose the shared identity/representation contract.
- Actual-app screenshots under `artifacts/screenshots` prove structural function but remain visibly far below the supplied references.

## Decisions already made

- The current `Photos for Codex` set supersedes prior vague wording such as merely simple, coarse, or large-pixel art.
- The solution requires a real asset/render seam rather than additional minor palette or CSS changes.
- Phaser, simulation state, room-local transforms, cutaway logic, depth sorting, explicit doors, and routing remain.
- Transparent authored bitmap/layer assets may replace procedural fixture and character pixels while retaining stable semantic IDs and interaction objects.
- The integrated scene is an acceptance reference, not a background asset.
- Visual acceptance requires direct inspection of the live application beside the references; passing tests alone is insufficient.

## Milestones

1. **Bitmap/layered asset seam.** Add an asset manifest, preload/cache lifecycle, native-size metadata, orientation/anchor metadata, and Phaser/React render adapters. Preserve existing fixture and appearance APIs and provide procedural fallbacks during migration.
2. **Level 1 architecture and environment pack.** Produce and integrate original high-detail floor textures, north/side wall segments, corners, thresholds, door openings, sidewalk, grass, trees, shrubs, flowers, and contact shadows matching the reference language.
3. **Level 1 room fixture pack.** Produce and integrate separate high-detail assets for Front Desk, Waiting Room, Examination, Bathroom, X-ray, Imaging Control, Minor Procedure, and hallway details while preserving every clear route and door candidate.
4. **Canonical character pack.** Replace the low-resolution presentation with layered high-detail heads, bodies/outfits, role accessories, poses, thumbnails, and portraits for all 30x30 founder combinations and current patients/employees without changing saved identity semantics.
5. **Golden-slice live integration.** Tune map native scale, anchors, occlusion, and visual composition so the live Level 1 clinic is comparable to `exec-44a3...` without altering logical tile coordinates or UI behavior.
6. **Current Level 2 visual coverage.** Extend the accepted system to currently playable Level 2 rooms and staff without broadening gameplay scope.
7. **Visual acceptance and regression.** Capture and inspect desktop, phone, Build Door, normal-vs-Build, active chart, founder creator, happy ending, and character-QA views; run functional, save, performance, type, build, and Pages checks.
8. **Canonical layer registration correction.** Use `Photos for Codex/Head body issue.PNG` as the defect reference; give every authored head and body frame a shared neck/body registration datum across React and Phaser, verify all directions and poses, and replace hair-color-based founder head labels with unique neutral hairstyle/accessory names while preserving all stable IDs and variants.
9. **Unified founder identities and clean directional actors.** Use `Photos for Codex/Head body mismatch.PNG` as the controlling regression image. Replace the new-campaign mix-and-match controls with 30 unified founder identities, scrub neighbouring-contact-sheet debris from every live pose, guarantee skin/neck coherence for new founders and generated patients/staff, and mirror the complete actor eastward in Phaser. Preserve the existing `headId`, `bodyId`, descriptor, and save schema as a compatibility layer. Record a separate future target of approximately 150 visually distinct, human patient identities spanning age and gender presentation; do not pretend repeated combinations are a finished 150-character art library.

## File or module ownership

### Milestone 1 Terra ownership

- New asset-manifest/loading/render-adapter modules under `apps/player/src/art/` and focused tests.
- Minimal asset preload/render seams in `apps/player/src/facility/FacilityScene.ts` and `apps/player/src/ui/PixelAvatar.tsx` only as required.
- Asset-directory conventions under `apps/player/public/art/` or a Vite-managed equivalent.
- Progress/Discoveries/Exact next action in this ExecPlan.

### Later ownership

- Sol selects and visually accepts generated/reference-guided asset outputs.
- Terra integrates one bounded room/environment or character pack at a time.
- Only one write-capable worker normally edits the repository at once.

## Acceptance criteria

- At ordinary desktop play scale, the live clinic is materially comparable to the supplied integrated reference in pixel density, palette, wall/floor finish, furniture credibility, landscape richness, and character readability.
- Front Desk, Waiting, Examination, Bathroom, X-ray, Imaging Control, Minor Procedure, and hallways are identifiable without labels and do not resemble symbolic geometric placeholders.
- Characters resemble the supplied pose/identity sheets in proportions and native detail, stay inside cutaway walls, and remain readable while walking, sitting, working, and interacting.
- Every portrait visibly matches the map character's hair, skin, facial structure, outfit, accessories, and nonhuman identity while adding close-up detail.
- The 30 head and 30 body choices remain available, correctly named, mixable, persistent, and represented through the new asset system.
- Exterior grass, sidewalk, shrubs, flowers, and trees read as an illustrated world rather than sparse procedural marks.
- Doors, candidate highlights, room rotations, routing, collision, depth, furniture occlusion, save/reload, and phone behavior remain functional.
- No supplied full-scene reference is used as a flattened live background.
- Live screenshots are inspected side-by-side with the supplied references before the milestone is reported ready for owner review.

## Validation

- Focused asset-manifest, missing-asset fallback, anchor, orientation, and base-path tests.
- Character descriptor-to-layer, pose coverage, identity persistence, and portrait/map consistency tests.
- Facility fixture coverage, door-clear zone, cutaway, depth, routing, and save tests.
- Full player and game-domain suites.
- Full repository `npm test`.
- `npm run typecheck`.
- `npm run build:pages` and Pages base-path verification.
- Health-checked Playwright captures and interaction walkthroughs.
- Browser memory/performance check with multiple moving characters and repeated zoom/pan.
- `git diff --check`.

## Progress

- [x] Inspected all 21 current reference images and excluded the one explicitly marked outdated.
- [x] Compared the supplied references with the current actual-app screenshots and renderer.
- [x] Determined that the existing structural renderer is reusable but the procedural art payload is not sufficient.
- [x] Milestone 1: bitmap/layered asset seam.
- [x] Milestone 2: Level 1 architecture and environment pack (implementation and live Sol review complete).
- [x] Milestone 3: Level 1 room fixture pack (implementation and live Sol review complete).
- [x] Milestone 4: canonical character pack (transparent v1 atlases, stable
  30x30 descriptor mapping, Phaser layered map objects, React portraits,
  creator/QA representation coverage, and procedural fallback).
- [x] Milestone 5: golden-slice live integration (continuous normal-mode turf,
  independent transparent landscaping, scale/anchor/depth review, and live
  desktop/phone/Build captures inspected and accepted by Sol for owner review).
- [x] Milestone 6: current Level 2 visual coverage (transparent specialty
  fixture atlases, room-scoped semantic overrides, live desktop/Build/phone
  captures, and regression coverage inspected by Sol).
- [x] Milestone 7: engineering visual acceptance and regression.
- [x] Milestone 8: canonical layer registration and founder-head naming correction.
- [x] Milestone 9: unified founder identities, artifact-free actors, east/west facing, and patient-roster expansion seam.

## Discoveries

- The reference characters are approximately 40-70 native pixels tall with individually authored-looking silhouettes, hair, clothing, and poses; the live 24x36 frames cannot match them at ordinary map scale.
- The reference portraits are separate high-detail compositions, not rescaled map frames.
- The reference rooms derive much of their cohesion from reusable architectural and surface assets plus individually illustrated fixtures, not from palette alone.
- The current domain/render separation is favorable: art can change without changing saves, route state, room IDs, or door legality.
- `Play, pause, fast forward.PNG` confirms that HUD controls should remain visually restrained while environmental art carries the detail.
- Milestone 1 provides source-path, native-size, floor-anchor, orientation, Phaser preload/render-plan, React render-plan, and promise-deduplicated browser-preload primitives while the authored bitmap registry remains intentionally empty. Therefore the current procedural render path is byte-for-byte the active visual fallback until an approved art pack registers original transparent files.
- Milestone 2 registers the original `clinic-environment-atlas-v1.png` through a single base-path-safe Phaser texture, then adds explicitly measured non-uniform source rectangles for terrain, sidewalk, floors, north walls, and side walls. Floors, terrain, sidewalk, walls, doors, fixtures, and landscaping remain separately rendered objects. The procedural draw path remains active until asynchronous decoding succeeds and remains the fallback if loading fails.
- The generated atlas is RGB rather than alpha-bearing. The live v1 integration therefore uses only tightly bounded architectural and material source rectangles; it intentionally does not use the atlas's tree/shrub cells whose surrounding checkerboard would be visible. Existing independently rendered project landscaping remains in place until a transparent landscaping pack is accepted.
- Build-mode grid drawing moves to the architecture overlay only while the authored environment is active, so normal-mode floor textures cannot obscure its logical placement grid.
- A focused real-app desktop Playwright capture completed after the atlas load. It confirms that the Pages-relative image URL resolves and the dynamic Phaser loader replaces fallback floor/terrain/wall layers without breaking chart, employee, or facility rendering. Sol still needs to judge visual fidelity against the reference before accepting the milestone.
- Milestone 3 uses six original RGBA Level 1 room fixture source atlases under `public/art/rooms/level-1-v1`, each registered through measured, non-uniform source rectangles. The live scene renders those frames as independent Phaser images with floor-contact anchors and the existing semantic fixture/depth/door/routing layers intact; procedural pixels remain the loading/error fallback and for assets not supplied by this bounded pack.
- Milestone 4 stores original transparent v1 character atlases under
  `public/art/characters/v1`. Every 5x6 sheet follows the already-persisted
  `headVariant`/`bodyVariant` 0-29 order, so no campaign migration or identity
  reroll is needed. A connected edge-background preprocessing pass removes
  only the generated sheet background, preserving internally enclosed white
  coats and facial highlights.
- Phaser now creates persistent head/body containers per live actor and moves
  those containers with the existing route interpolation. It preloads the
  atlas family once, uses measured frame keys and floor anchoring, and hides
  (rather than deletes) the existing procedural Graphics layer when authored
  art is available. React creator, portrait, and QA surfaces use the same
  saved variants through CSS atlas cropping; the procedural renderer remains
  a load-error fallback.
- Milestone-4 review correction: displayed body art is now role-safe but
  presentation-only. Founder/non-human selections stay direct; patients,
  front-office staff, clinical technicians/nurses, physicians/NPs, and EVS
  resolve through deterministic approved outfit pools without changing saved
  descriptors. Route samples carry a render-only `rightFacing` signal so the
  authored left-facing body/head layers mirror correctly on eastward movement
  and retain that facing at rest. The authored v1 front star-jump body sheet
  is registered for the happy-ending/QA pose rather than reusing idle art.
- Milestone 5 adds a separately transparent original landscaping atlas for
  trees, shrubs, three flower colors, an exterior bench, and planters. Its
  renderer remains decoration-only: placement is deterministic from the live
  clinic bounds, route/collision data remains domain-owned, and every prop is
  independent rather than a flattened world background.
- Normal mode no longer uses one grass TileSprite per logical cell. The source
  grass swatch's dark edge pixels made that approach look like a construction
  checkerboard at real scale, so live turf is now one continuous, stable
  illustrated stipple field below opaque room floors. Build Mode retains the
  explicit translucent logical grid overlay.
- Direct live screenshot inspection after the change confirms normal mode has
  no construction grid, Build Mode does, the exterior ends exactly at the
  sidewalk, and room/character/fixture depth remains ordered by their floor
  contact baseline. The room/character packs still leave a final owner visual
  judgement rather than claiming reference equivalence from test results.
- Milestone-5 correction after Sol visual review: tree width/height were
  reduced by roughly one third, then redistributed as a small varied edge
  grouping. The west tree now renders beneath room floors (so its room-overlap
  portion is naturally occluded instead of canvas-clipped); two varied east
  trees remain clear of the sidewalk and clinic paths. Refreshed desktop and
  phone capture inspection confirms no single tree dominates the composition.
- Final Milestone-5 anchor correction places the three trees in an irregular
  west/southeast/northeast triangle. Their crowns now remain inside the live
  world bounds, avoid the entrance/sidewalk route, and do not form a vertical
  ornamental column.
- Milestone 6 adds three original transparent RGBA fixture atlases under
  `public/art/rooms/level-2-v1`. The maps use deliberately measured,
  non-uniform content frames. A room-definition-specific override resolves a
  specialty bitmap before the generic Level 1 semantic fixture mapping, so
  endoscopy/recovery/coffee/telehealth fixtures do not replace the unrelated
  Level 1 furniture that shares semantic IDs.
- The Level 2 source sheets were edge-background processed with the same
  connected near-white method as the character sheets. All three produced PNGs
  have transparent corner alpha (0); live Phaser asset loading remains
  base-path safe and procedural fixture rendering remains the safe
  missing/failed-load fallback.
- Direct Level 2 desktop and Build Mode capture inspection shows the new
  ultrasound, CT, phlebotomy, EVS, endoscopy, recovery, training, coffee, and
  telehealth objects as separate layered fixtures in the established Level 1
  art language. At the full-facility default camera some equipment is
  necessarily small; its dedicated detailed silhouette is most apparent when
  the player zooms or works in Build Mode.
- `Head body issue.PNG` confirmed a production creator mismatch, not merely an
  unattractive combination: v1 head and body contact sheets have different
  native sizes, irregular inter-figure boundaries, and figures which can cross
  an assumed uniform cell boundary. Both React CSS cropping and Phaser frame
  registration had incorrectly treated them as uniform 5-by-6 grids and then
  applied unrelated layer scales/offsets.
- Milestone 8 preserves the v1 sources but generates transparent v2 sheets in
  a common 160-by-240 local canvas. Measured source boundaries prevent a
  character from borrowing a neighbouring contact-sheet figure. Every head
  ends at neck y=102 and every body uses floor y=220; React and Phaser now
  layer the complete normalized cells at the same origin. This is a shared
  registration contract, not a founder-preview-specific nudge.
- Human head labels are now neutral hairstyle/accessory names. Stable
  `head.01` through `head.30` IDs, variants, descriptors, groups, and Cat /
  Penguin labels remain unchanged; neutral display naming does not alter any
  saved campaign identity.
- `Head body mismatch.PNG` exposed a second source-normalization defect after
  Milestone 8: source-row cut points were too low for the fourth through sixth
  side-pose rows, so they combined a selected body with a head portion from a
  neighbouring source band. The v3 build tool uses measured row-gap boundaries
  and connected component ownership, then emits one transparent full-actor
  frame for each identity/pose. React and Phaser now render that one frame,
  eliminating a head/body seam and applying eastward mirroring to the actual
  Phaser image.
- The founder creator now exposes 30 paired identities rather than two
  independent selectors. It continues to write the stable `headId`, `bodyId`,
  head/body variants, and descriptor fields; legacy mixed pairs receive a
  deterministic render-only projection based on the saved head identity.
- Generated staff and patient descriptors now choose matched human
  head/body variants. This is presentation-only and does not affect clinical
  case selection, demographics, or seeded simulation streams. The current
  patient catalog explicitly contains only 20 authored human identities and
  reserves a stable expansion seam for the future approximately 150-identity
  target instead of claiming duplicate combinations meet it.

## Exact next action

Owner review of the Milestone 9 captures is next. Sol inspected all regenerated
v3 pose sheets, the unified 30-choice founder creator, the live Level 1 map,
and the QA gallery's west/east pair; independently reran the 226 player tests,
123 game-domain tests, focused browser captures, Pages build/typecheck, the
270-frame atlas check, and `git diff --check`. The approximately 150-person
patient-art roster remains a later authored-art expansion, not a completed
part of this correction. All work remains local on the dirty `beta` branch;
do not publish it without separate authorization.
