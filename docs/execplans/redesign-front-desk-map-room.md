# Redesign the Front Desk Map Room

> **Owner-rejected on 2026-08-31.** The landscaping portion was liked, but the
> room still read as the prior design. The completed implementation record is
> retained for provenance; active replacement work is now controlled by
> `docs/execplans/rebuild-front-desk-v5-from-reference.md`.

## Goal

Redesign and implement only the fixed Front Desk room so the live map matches the supplied pixel-art mockups: a clean rectangular five-tile-by-four-tile room centered immediately above the sidewalk, with the accepted reception fixtures and substantial flower beds flanking the unobstructed front walk. Preserve the game's independent characters, interactive objects, navigation, doors, and saves.

## Requirements

- Treat the detailed image in the ignored local room-reference workspace as the furnishing and atmosphere reference.
- Treat the rectangular architecture image and the room-in-map / entrance-landscaping image in the ignored local room-reference workspace as the corresponding references.
- Keep the logical and visible floor exactly five spaces wide by four spaces tall. The Front Desk remains fixed above the middle of the sidewalk with its public entrance centered on the south wall.
- Preserve the existing rectangular Front Desk v4 shell. Its perspective, inset floor, wall depth, central front opening, and measured five-by-four floor already match the new rectangular reference.
- Preserve the reference fixture package as independent scene elements: filing cabinet and plant at the rear-left, noticeboard and clock on the north wall, founder/secretary chair behind the central reception counter, interactive water cooler and waste bin at the rear-right, and no visitor chair in the southeast corner.
- Keep live founders, staff, patients, doors, water-cooler interaction, and other interactive elements separate from architecture and fixture artwork.
- Replace the current tiny entry flower clumps with visibly substantial, stone-edged flower beds on both sides of the front walk, using the supplied overall-vibe reference for density, color, and placement. The central path between room and sidewalk must remain visually and logically unobstructed.
- Preserve at least one contiguous furniture-free candidate door span on each of the north, east, south, and west walls. The south span remains the visible public entrance. Do not render cyan mockup/debug door markers in the live game.
- Save a reviewable Front Desk room mockup or generated design candidate in the ignored local owner-review asset workspace. Use the remote Cortan ComfyUI service for incremental raster generation or editing when it adds value; do not use Codex's native image generator for this task.
- If a Cortan result is less coherent or less faithful than the existing authored shell and fixture art, retain it only as a review candidate and do not force it into the runtime.

## Constraints and non-goals

- This is a graphics-only Front Desk milestone. Do not change gameplay, economy, progression, clinical content, routing rules, room placement rules, collision, save data, or domain behavior.
- Do not modify the appearance or presentation contracts of other rooms.
- Do not flatten the room, characters, doors, or interactive water cooler into one screenshot texture.
- Do not install ComfyUI nodes, models, or other software on Cortan for this milestone.
- Do not overwrite accepted existing art. Any new runtime bitmap must use a new path and manifest entry.
- Preserve every unrelated working-tree change. The ignored local owner-review asset workspace is user-supplied and untracked; only add deliberate review outputs there and do not rename, rewrite, or stage reference files.
- The prior accepted Front Desk decision to omit the southeast visitor chair remains in force. It also agrees with the new overall-vibe reference and leaves the east wall visually usable.

## Relevant repository state

- `apps/player/public/art/rooms/front-desk-v4/front-desk-shell-v4.png` is the active coherent rectangular shell and already appears among the user's new room references.
- `apps/player/public/art/rooms/level-1-v1/front-desk-fixtures-v1.png` and the Front Desk v2 atlas contain the accepted independent cabinet, plant, counter, chair, cooler, bin, noticeboard, and clock artwork.
- `apps/player/src/facility/frontDeskPresentation.ts` owns the fixed five-by-four logical presentation, fixture contacts, character anchors, and two declared entrance planters.
- `apps/player/src/facility/roomVisualLayout.ts` already declares one Front Desk candidate door-clear zone on every wall. Domain door validation remains authoritative.
- `apps/player/src/facility/FacilityScene.ts` renders the live Front Desk fixtures independently. Its exterior threshold currently draws only two small flower clusters near the sidewalk and does not consume `FRONT_DESK_PRESENTATION.entrancePlanters`.
- `tests/e2e/front-desk-visual.spec.ts` already provides controlled occupied, vacant, exterior, and close Front Desk captures.
- The current baseline screenshot `artifacts/screenshots/front-desk-grounded-occupied.png` confirms that the architecture and core fixture identities are sound, but the landscaping is too small and sparse compared with the new reference.

## Decisions already made

- Reuse the current v4 room shell rather than regenerate or replace a stronger accepted asset.
- Reuse the accepted independent fixture art unless a focused Cortan edit is demonstrably better at normal gameplay zoom.
- Use Cortan first for a review mockup or a narrowly isolated flower-bed candidate, not for a flattened room replacement.
- Interpret the detailed close-up as the furnishing reference and the overall-vibe image as the authoritative rectangular/map-context adaptation.
- Keep the previously accepted no-visitor-chair composition.
- Make the declared entrance-planter presentation data drive the live exterior beds so composition and tests share one contract.
- Keep the room's logical footprint, contact anchors, sprite envelopes, and door-clear spans separate.

## Milestones

1. Produce a reviewable rectangular Front Desk composition or focused flower-bed design candidate through Cortan, save it in the ignored local owner-review asset workspace, and compare it with the supplied references and existing authored art. Do not alter runtime code in this milestone.
2. Implement the Front Desk-only live visual composition: consume declarative entrance-planter placement, render broad flower beds outside the south wall, keep the central walk clear, and make any minimal fixture-placement adjustment needed to match the references while preserving the four wall-clear spans.
3. Add or refine focused unit and visual-regression coverage, run the live capture at useful zoom, and review the resulting actual-app screenshots against the supplied room and overall-vibe references.
4. Record the accepted result, validation evidence, and any rejected generated candidates in this plan and in `docs/handoffs/CURRENT_THREAD_HANDOFF.md` without closing the user's explicitly ongoing graphics thread.

## File or module ownership

- Milestone 1 Terra owns only deliberate generated/review outputs in the ignored local owner-review asset workspace and progress notes in this ExecPlan.
- Milestone 2 Terra owns `apps/player/src/facility/frontDeskPresentation.ts`, its focused test, the Front Desk/entrance-landscaping branches of `apps/player/src/facility/FacilityScene.ts`, and a new Front Desk-only bitmap/manifest entry only if Sol explicitly accepts the candidate after review.
- Milestone 3 Terra owns focused Front Desk unit tests, `tests/e2e/front-desk-visual.spec.ts`, and generated screenshots under `artifacts/screenshots/`.
- Sol owns reference interpretation, generated-art acceptance, actual diff review, cross-thread conflict resolution, final validation review, and the handoff.

## Acceptance criteria

- The live Front Desk visibly reads as one clean rectangle whose floor is exactly five logical tiles by four logical tiles.
- It remains fixed above the center of the sidewalk with a centered, unobstructed public walk and entrance.
- At normal and close gameplay zoom, the room composition clearly matches the supplied references: rear-left cabinet/plant, north-wall noticeboard/clock, centered desk and secretary position, rear-right cooler/bin, and open southeast floor.
- Broad, attractive flower beds visibly flank both sides of the entrance and resemble the density and stone edging in the overall-vibe reference without entering the central walk.
- A furniture-free candidate door span remains on every wall, with focused automated coverage for all four sides and visual evidence that fixtures do not occupy those spans.
- Founders/staff remain behind the counter, checked-in patients remain on the public side, and the empty chair still hides while an eligible worker occupies it.
- The water cooler remains independently interactive and aligned with its existing domain target.
- No other room or non-graphical behavior changes.
- At least one actual-app occupied Front Desk screenshot and one exterior/entry screenshot are reviewed by Sol at useful zoom.

## Validation

- `npm run test --workspace @gamify-surgery/player -- src/facility/frontDeskPresentation.test.ts src/facility/roomVisualLayout.test.ts`
- Any focused manifest or scene-helper unit test added for the flower beds.
- `npm run typecheck --workspace @gamify-surgery/player`
- `npm run build --workspace @gamify-surgery/player`
- `npx playwright test tests/e2e/front-desk-visual.spec.ts`
- Sol inspects the generated candidate, the actual diff, and the occupied/exterior actual-app screenshots rather than relying on a worker summary.

## Progress

- [x] Read the repository instructions, current graphics handoff, art direction, prior Front Desk plans, and dirty working tree.
- [x] Inspect the supplied room and overall-vibe references, current Front Desk shell/fixture art, live screenshots, presentation data, door-clear zones, and visual E2E coverage.
- [x] Confirm the existing v4 shell is the requested rectangular base and the main visible gap is the entrance landscaping/composition at gameplay scale.
- [x] Complete Milestone 1 through a Terra worker and make the candidates available for Sol review.
- [x] Sol reviewed both Milestone 1 PNGs at native resolution and rejected them for runtime integration; retain them only as review/prompt evidence.
- [x] Complete Milestone 2 through a Terra worker and review the actual diff.
- [x] Sol accepted the Milestone 2 source/test diff and independently reran its focused unit, typecheck, and whitespace validation successfully.
- [x] Complete Milestone 3 through a Terra worker; Sol review of the actual-app screenshots remains required.
- [x] Sol corrected the two landscaping depth constants exposed by the first close proof, preserved the legacy capture order, reran every final check, and accepted the refreshed normal/close actual-app composition.
- [x] Update the graphics handoff.

## Discoveries

- The user's new rectangular room reference is effectively the same accepted v4 shell already active in the game, so replacing that shell would risk a regression rather than improve fidelity.
- The detailed close-up's clipped outer corners are architectural only; its furniture package can remain independent inside the rectangular shell.
- The new overall-vibe reference shows the preferred rectangular Front Desk in map context, with no southeast visitor chair and with flower beds extending along both sides of the front walk.
- The live room already has four declarative door-clear spans, but the exterior flower-bed presentation is split between unused declarative planter data and a separate pair of tiny hard-coded sidewalk flower clusters.
- Cortan has the existing SDXL pixel-art workflow and background-removal support but no installed reference adapter or ControlNet. A low-denoise core img2img pass or isolated flower-bed generation is appropriate; model/node installation is not.
- Milestone 1 generated a review-only 1024x1024 Front Desk candidate in the ignored local owner-review asset workspace, then opened it locally. It is not a runtime asset.
- The requested local reference PNG upload to Cortan was blocked by the execution environment because it would send a private project artifact to the remote host without fresh explicit authorization. The worker therefore used the materially safer text-only Cortan fallback rather than circumventing that restriction.
- Reproducible Cortan workflow: core `CheckpointLoaderSimple` model `sd_xl_base_1.0.safetensors`; `EmptyLatentImage` 1024x1024; positive prompt: `pixel art game environment concept, orthographic cutaway front desk room, an exact 5 tiles wide by 4 tiles tall clean rectangular clinic room centered above a horizontal stone sidewalk, centered south entrance and clear walkway, substantial stone-edged flower beds with white pink yellow flowers on both sides of the front walk. Back left filing cabinet and potted green plant, north wall notice board and small round clock, central polished wooden reception counter with empty secretary chair behind it, back right water cooler and small waste bin. Warm ivory plaster walls, stone base, pale tan checkered floor, moss sage green architectural accents, crisp detailed 16-bit pixel art, coherent game-ready dollhouse perspective, no people, no text, no debug markers.` Negative prompt: `people, patients, staff, visitor chair, clipped corners, irregular footprint, rounded room, cyan, blue debug marker, word, letters, logo, watermark, photorealistic, blurry, isometric distortion`. `KSampler` seed `835190496`, 30 steps, CFG 6.5, `dpmpp_2m_sde`, `karras`, denoise 1.0; prompt ID `11da5250-9d92-4048-8358-9c1931023fee`; Cortan output `Codex-FrontDesk-rectangular-candidate_00001_.png`.
- Fidelity assessment: this candidate captures a central desk, rear-side service/storage details, empty secretary position, pale floor, and flower-bed intent, but it drifted to a frontal lobby perspective, added excessive interior/exterior greenery, and does not reliably demonstrate the exact 5x4 footprint or the specified separate wall-clear spans. It is suitable only as loose landscaping/material inspiration. The accepted v4 shell and existing independent fixture artwork remain substantially more faithful and must be preserved for the runtime implementation.
- A focused transparent alternative is also saved in the ignored local owner-review asset workspace (1024x512, `Format32bppArgb`) and was opened locally. It uses the installed `birefnet.safetensors` background-removal model after generation to preserve alpha. Reproducible positive prompt: `single isolated pixel art game sprite: a low broad rectangular stone-edged clinic entrance flower bed, three-quarter top-down side view, dense restrained sage and moss green foliage with small white pink and purple flowers, pale gray stone border and dark soil, clear clean silhouette, compatible with 16-bit warm ivory and stone clinic architecture, designed as one half of a mirrored pair flanking a one-tile-wide entrance walkway, no other furniture.` Negative prompt: `background scene, room, floor, wall, sidewalk, person, pot, tree, text, logo, watermark, cyan, blue marker, photorealistic, blurry, multiple objects`. Core workflow: SDXL base model, 1024x512 latent, KSampler seed `946271830`, 30 steps, CFG 6.5, `dpmpp_2m_sde`, `karras`, denoise 1.0; `RemoveBackground` with `birefnet.safetensors`; `JoinImageWithAlpha`; prompt ID `df8e5ae3-c533-4178-b5b4-b07134593726`; Cortan output `Codex-FrontDesk-flowerbed-isolated-candidate_00001_.png`.
- Isolated-candidate fidelity assessment: it is genuinely transparent and demonstrates a stone-bordered, bloom-accented entry-bed treatment, but it depicts one long framed planter composition rather than the current atlas's compact perspective and would need selective extraction/redraw before runtime use. Retain it only as design inspiration; do not add it to the manifest or live scene without Sol's acceptance.
- Sol's native-resolution review rejected both candidates for runtime use. The full-room candidate loses the required dollhouse/top-down five-by-four geometry, while the isolated candidate invents a large window-like frame and has neither the silhouette nor material fidelity needed for a map-scale planter. The existing v4 shell and independent landscaping atlas remain the accepted implementation sources.
- Milestone 2 now makes `FRONT_DESK_PRESENTATION.entrancePlanters` the single declarative source for two substantial, stone-edged entrance beds and their restrained white/pink bloom accents. The scene renders all display envelopes from those room-local tile/setback coordinates and no longer draws the two hard-coded sidewalk flower clusters.
- The Front Desk presentation test proves every declared bed and bloom remains within the five-tile frontage and one-tile grass setback while staying outside the centered one-tile public walk. The focused room-visual test now proves an eligible integer door candidate on each wall of the exact five-by-four Front Desk. Fixture positions, shell, anchors, and domain door logic are unchanged.
- Milestone 2 validation passed: `npm.cmd run test --workspace @gamify-surgery/player -- src/facility/frontDeskPresentation.test.ts src/facility/roomVisualLayout.test.ts` (2 files, 22 tests) and `npm.cmd run typecheck --workspace @gamify-surgery/player`. `git diff --check` passed.
- Milestone 3 added a real-control owner-review capture at `artifacts/screenshots/front-desk-redesign-entrance-close.png`. The E2E uses the actual `Zoom facility in` HUD control twice after returning from its real canvas pan, then captures the production `.facility-frame`; it does not apply CSS scaling or postprocess an image. Existing normal, panned, occupied, vacant, and detail captures remain in the same controlled test.
- Milestone 3 validation passed: `npm.cmd run test:e2e -- tests/e2e/front-desk-visual.spec.ts --project=desktop-chrome` (confirmed by `test-results/.last-run.json`: `status: passed`, no failed tests); `npm.cmd run build --workspace @gamify-surgery/player` (Vite build passed); and `git diff --check` passed. The build emitted its pre-existing chunk-size advisory only.
- Visual review by the Milestone 3 worker: the close capture cleanly shows the full rectangular shell, centered entrance/walk, rear-left cabinet/plant, north noticeboard/clock, central desk with seated founder and public-side patient, rear-right cooler/bin, and the two dark planter bases. Compared with the supplied references, the flower beds do not yet read as substantial bloom-accented beds at this player-visible zoom: their bases appear as narrow dark blocks alongside the entrance and the white/pink bloom accents are not visibly legible. This is a runtime visual defect reported to Sol, not accepted artwork; no runtime source was changed during Milestone 3.
- Sol independently repeated the Milestone 2 checks after inspecting the actual diff: 2 focused files and all 22 tests passed, player typecheck passed, and `git diff --check` passed. The accepted display envelopes span X `0.175..1.725` and `3.275..4.825` across the five-tile frontage, leaving the central X `2..3` public walk unobstructed; all vertical envelopes remain inside the one-tile setback.
- Sol traced the first visual defect to an exact render-depth conflict: the beds/blooms were at world depths `+16`/`+18..19`, behind the Front Desk v4 foreground crop at `+29` and doorway architecture at `+30`. A tiny review correction raises only these exterior beds to `+31` and their blooms to `+32..33`; their tested bounds exclude the doorway, so they cannot cover the public route.
- Sol also moved the new zoomed screenshot after the legacy detail/occupied captures so those established proofs remain at their original 110% player camera while only `front-desk-redesign-entrance-close.png` uses 130%.
- Final Sol visual review accepted `artifacts/screenshots/front-desk-v4-shell-normal.png`, `artifacts/screenshots/front-desk-grounded-occupied.png`, and `artifacts/screenshots/front-desk-redesign-entrance-close.png`: the two beds now read as broad stone-edged foliage beds with visible white/pink blooms, remain symmetric but not duplicated, and visibly stop before the centered walk. The rectangular shell and all independent fixture/actor relationships remain intact.
- Final post-correction validation passed: focused E2E `1 passed` on `desktop-chrome`; player build passed with only its pre-existing chunk-size advisory; both focused unit files and all 22 tests passed; player typecheck passed; and `git diff --check` passed.

## Exact next action

Preserve the accepted exterior planters, but treat the room architecture and
fixture composition as rejected. Follow
`docs/execplans/rebuild-front-desk-v5-from-reference.md`; do not resume this
superseded plan or describe its room result as owner-accepted.
