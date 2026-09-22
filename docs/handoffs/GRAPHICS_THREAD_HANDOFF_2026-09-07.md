# GamifySurgery graphics thread handoff

**Prepared:** 2026-09-07

**Thread status:** continuous, graphics-only; latest Founder repair is local and still needs one clean individual browser-test exit before owner playtest.

**Facts vs. inferences:** statements labelled **Fact** are supported by local files, captured test output, or inspected images. Statements labelled **Inference** are a diagnosis to recheck rather than a guarantee.

## Read this first

For a new account/thread, start in this exact order:

1. Read the repository-root [AGENTS.md](../../AGENTS.md), then this document.
2. Read the active plan, [fix-founder-head-feet-clipping.md](../execplans/fix-founder-head-feet-clipping.md), and the broader [CURRENT_THREAD_HANDOFF.md](CURRENT_THREAD_HANDOFF.md).
3. Run `git status --short --branch`; this is a deliberately shared, heavily dirty tree. Reconcile this handoff with the result before editing.
4. Keep this thread strictly graphics/presentation-only. Do not reset, clean, revert, broadly stage, commit, push, deploy, or delete anything merely to make the tree appear clean.
5. Rerun the Founder anatomy browser spec individually before declaring the current repair green (exact command appears in [Next actions](#next-actions)).

This thread owns map-room appearance, walls, floors, furniture presentation, characters/sprites, generated art, and visual-only display placement. It does **not** own gameplay, routing, staff behavior, logical occupancy, collisions, buildability rules, saves, progression, clinical content, or general UI/system behavior. When a visual symptom exposes one of those systems issues, capture the evidence here and move the decision/implementation to a systems or gameplay thread.

## Owner art direction and working folders

The owner made `Photos for Codex 2` the local visual authority and output convention:

| Reference inputs | Codex review/output counterpart |
| --- | --- |
| `Photos for Codex 2/Founders` | `Photos for Codex 2/Codex Founders 2` |
| `Photos for Codex 2/Objects or Furniture` | corresponding `Codex ... 2` output folder |
| `Photos for Codex 2/Overall Vibe` | corresponding `Codex ... 2` output folder |
| `Photos for Codex 2/Patients or Staff or Other Characters` | corresponding `Codex ... 2` output folder |
| `Photos for Codex 2/Rooms` | `Photos for Codex 2/Codex Rooms 2` |

Use the source folders as visual references and place new reviewable mockups/candidates only in the corresponding `Codex ... 2` area. Relevant reference images are:

- Front Desk: [exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png](../../Photos%20for%20Codex%202/Rooms/exec-01994978-adfc-4ad7-9bbe-5d82fd18c80c.png)
- Examination: [exec-7bebc262-1a11-414b-b9a2-ec6ddc2223e1.png](../../Photos%20for%20Codex%202/Rooms/exec-7bebc262-1a11-414b-b9a2-ec6ddc2223e1.png)
- Overall vibe: [exec-cecfa7f7-9fff-4d97-acd3-01fbc5dc38fe.png](../../Photos%20for%20Codex%202/Overall%20Vibe/exec-cecfa7f7-9fff-4d97-acd3-01fbc5dc38fe.png), [exec-a921f897-d3b4-4632-9e4f-0ed6791bef2f.png](../../Photos%20for%20Codex%202/Overall%20Vibe/exec-a921f897-d3b4-4632-9e4f-0ed6791bef2f.png), and [exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png](../../Photos%20for%20Codex%202/Overall%20Vibe/exec-44a3ea02-2ce5-4318-822f-a5b1e05e1a86.png)
- Owner diagnostic screenshots: [Wall fix.PNG](../../Photos%20for%20Codex%202/Screenshot%20Issues/Wall%20fix.PNG), [Feet off.PNG](../../Photos%20for%20Codex%202/Screenshot%20Issues/Feet%20off.PNG), and [Head off.PNG](../../Photos%20for%20Codex%202/Screenshot%20Issues/Head%20off.PNG)

The desired style is the mockup-like, readable isometric/top-down surgery center: all rooms share an architectural grammar, while colors/materials/furniture may vary. People and fixtures must read at correct relative scale; wall art belongs on walls, not on the floor plane; avoid filling rooms until they become cluttered.

## Canonical map and room visual rules

These rules were accumulated from owner feedback and are the graphics contract unless superseded by a newer explicit owner request.

- A room's logical/buildable footprint is its floor tiles only; visual wall thickness/height does not consume an additional non-buildable world tile.
- Tile grammar is rows as letters from top to bottom and columns as numbers left to right (for example, `A1`). Use that grammar in owner conversations and presentation plans.
- The fixed Level 0 Front Desk is above the sidewalk in the middle of the map and has a true `5 x 4` floor footprint, not a four-row floor with a back wall occupying a floor row.
- Front Desk layout: filing cabinet at `A1` against the north/back wall; corkboard/clock above `A2`; water cooler and trash at `A5`; counter/desk spans `C2-C3`; seated founder/secretary is immediately behind the desk at the junction of `B2`, `B3`, `C2`, and `C3`; waiting chair is `D5`, facing left. The chair must not face into the corner.
- Front Desk legal door locations: north above `A2`, `A3`, or `A4`; east at `B4` or `C4`; west at `B1`, `C1`, or `D1`. Maintain at least one legal door location on every room wall; furniture cannot block an entire wall.
- Two adjacent doors into the same room make one wide opening; adjacent doors into different rooms/hallways remain separate openings.
- Flowerbeds sit immediately against either side of the Front Desk entrance. They overlap the rear sidewalk band enough to make the surgery-center buildable edge abut the sidewalk, but may not obstruct the walkable lane along the front of the screen.
- All rooms use the same wall structure, border treatment, and heights as the Front Desk/Examination baseline. Wallpaper/floor color and texture can vary.
- The south/front wall uses the shared low Front Desk/Examination wall band so
  it does not hide most of the room interior; its border/baseboard style still
  matches the other canonical walls.
- East/west (“vertical”) walls are top-down caps with no angled/deep side face. Their width/appearance must match the Front Desk vertical wall. They extend continuously to the top level of the north wall; if the adjacent north segment is shallow due to a north room/hall, connect continuously to that shallow segment.
- North/south (“horizontal”) walls retain their intended face treatment. A north/back wall with no room/hall immediately north may be full height. If a room/hall exists immediately north, use the short backed-north segment: a small wallpaper strip above the floor board/baseboard, still visibly separating rooms but not hiding the foreground behind it.
- Close all wall segments unless there is an actual door. Contents (characters, furniture, and their shadows) layer behind west/east/south walls and in front of north-facing walls.
- A doorway is a complete cutout of that wall segment: no dark seam, wall, baseboard, or vertical separator remains in the opening; room/hall floor texture directly touches adjacent floor texture. Baseboards decorate walls, not floor seams.
- Thick shared east/west partition lines sit exactly on tile borders, and disappear only where a door occupies that connection.
- Floor, sidewalk, and hallway patterns are world/room-fixed during camera pan; they must not slide relative to their owning room or sidewalk.

For the detailed source contracts, read the linked plans below rather than reconstructing a room by inference.

## Milestone map and authoritative local records

The current broad handoff records older checkpoints and deploy state. The following plans are the concise local history for the graphics work; several later refinements are local-only and must not be described as deployed unless a fresh git/history audit proves it.

| Subject | Local plan | Outcome / principal files |
| --- | --- | --- |
| Initial Front Desk redesign/reference rebuild | [redesign-front-desk-map-room.md](../execplans/redesign-front-desk-map-room.md), [rebuild-front-desk-v5-from-reference.md](../execplans/rebuild-front-desk-v5-from-reference.md) | Fixed-position Front Desk presentation, visual reference work, flowerbeds and desk composition. Main renderer: [FacilityScene.ts](../../apps/player/src/facility/FacilityScene.ts); Front Desk architecture/presentation modules. |
| Front Desk floor, fixture grounding, and exact door positions | [correct-front-desk-four-row-floor-and-door-layout.md](../execplans/correct-front-desk-four-row-floor-and-door-layout.md), [refine-front-desk-object-grounding.md](../execplans/refine-front-desk-object-grounding.md) | True 5x4 logical floor and owner tile-coordinate fixture contract. |
| Canonical room shell and Examination layout | [unify-canonical-room-shell-and-examination-grid.md](../execplans/unify-canonical-room-shell-and-examination-grid.md), [unify-examination-room-architecture.md](../execplans/unify-examination-room-architecture.md) | Shared room-wall grammar and sparse Examination furniture/art. Examination objects were reduced to avoid clutter. |
| Waiting, Bathroom, X-ray, Imaging Control, Minor Procedure | [redesign-five-level-one-room-interiors.md](../execplans/redesign-five-level-one-room-interiors.md) | Five Level 1 room interiors redesigned under the shared shell. |
| Uniform wall height / vertical caps / backed north walls | [unify-all-room-wall-heights.md](../execplans/unify-all-room-wall-heights.md), [flatten-vertical-room-walls-top-down.md](../execplans/flatten-vertical-room-walls-top-down.md), [shorten-backed-north-room-walls.md](../execplans/shorten-backed-north-room-walls.md), [fix-wall-corner-continuity-and-layering.md](../execplans/fix-wall-corner-continuity-and-layering.md) | Canonical side caps, shallow back segments, and corner/layer continuity. |
| Door cutouts and shared seams | [render-doorways-as-full-floor-continuous-cutouts.md](../execplans/render-doorways-as-full-floor-continuous-cutouts.md), [refine-shared-walls-and-door-seams.md](../execplans/refine-shared-walls-and-door-seams.md) | Floor-only doorway seams and single-owner shared wall rendering. |
| Character resolution / alpha cleanup | [increase-character-resolution-and-clean-alpha.md](../execplans/increase-character-resolution-and-clean-alpha.md), [redesign-30-authored-founders.md](../execplans/redesign-30-authored-founders.md) | Higher-resolution founder/character assets and alpha/crop checks. Runtime mappings: [bitmapAssetManifest.ts](../../apps/player/src/art/bitmapAssetManifest.ts) and [characterBitmapArt.ts](../../apps/player/src/art/characterBitmapArt.ts). |
| Cortan graphics pipeline | [build-cortan-graphics-workflows.md](../execplans/build-cortan-graphics-workflows.md) | Versioned ComfyUI workflow/README convention and remote incremental-edit process. |
| Floor-pattern camera drift | [fix-floor-pattern-camera-drift.md](../execplans/fix-floor-pattern-camera-drift.md) | World/room-stable TileSprite and procedural surface phase; screenshots and E2E proof are local-only unless later committed. |
| Founder head/feet repair (current) | [fix-founder-head-feet-clipping.md](../execplans/fix-founder-head-feet-clipping.md) | Identity-10 standing feet raster repair and Front Desk-only seated silhouette separation; currently local/uncommitted. |

**Fact:** `CURRENT_THREAD_HANDOFF.md` names branch `beta` tracking `origin/beta`, an older current backup commit `3bb92ff`, and a previously deployed graphics baseline `7d8dab437838250b7315a71870ec6ea2d720f3ca`. These are historical checkpoints, not proof that the latest dirty graphics repairs are backed up or deployed. A fresh status shows local modifications, so treat all current graphics work as uncommitted/unpushed unless a new audit demonstrates otherwise.

## Cortan / ComfyUI workflow

**Fact:** remote graphics host is machine `Cortan` on the same Tailscale tailnet. Its known MagicDNS HTTPS endpoint is `https://cortan.taile197db.ts.net` on standard HTTPS port 443. ComfyUI is the required tool for incremental modification of existing artwork.

### Last recorded Cortan inventory

This inventory is a dated baseline, not a permanent promise: the owner was
still installing resources. Refresh the live `/object_info`, `/models/*`, and
queue responses before each new raster task and report additions or missing
dependencies rather than assuming this list is current.

- Last recorded runtime: ComfyUI `0.34.0`, frontend `1.49.6`, templates
  `0.11.48`, 994 registered nodes, and an NVIDIA RTX 4070 Ti SUPER with 16 GB
  VRAM.
- Confirmed useful resources included SDXL Base, the `pixel-art-xl` checkpoint
  and pixel-art LoRA path, SDXL ControlNet/IP-Adapter support, BiRefNet
  foreground extraction, and the Qwen Image Edit 2511 multi-reference stack.
- The canonical Qwen workflow was matched to these exact local files:
  `qwen_image_edit_2511_int8_convrot.safetensors`,
  `qwen_2.5_vl_7b_fp8_scaled.safetensors`,
  `qwen_image_vae.safetensors`, and
  `Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors`.
- Recorded limitations were an empty upscale-model folder and unavailable
  SAM/Grounding-DINO/InsightFace/ONNX endpoints. Manager package-version
  endpoints also returned 404, so the live node registry—not guessed package
  versions—is the compatibility authority.
- Preserve Cortan's original `Pixel Art Sprite Starter.json` byte-for-byte.
  Versioned GamifySurgery workflows are separate files and must never overwrite
  it.

- Do not fall back to Codex/native local image generation when modifying existing art. Local/native generation is permitted only for completely new artwork.
- If Cortan, ComfyUI, models, custom nodes, or a required resource cannot be accessed, say so clearly in commentary/final response and preserve the blocked state for the owner to repair; do not silently substitute a different generation tool.
- Canonical workflow templates are [GamifySurgery - Pixel Art Sprite Starter v2.json](../../tools/comfyui/workflows/GamifySurgery%20-%20Pixel%20Art%20Sprite%20Starter%20v2.json) and [GamifySurgery - Incremental Asset Edit Qwen v1.json](../../tools/comfyui/workflows/GamifySurgery%20-%20Incremental%20Asset%20Edit%20Qwen%20v1.json). Read [tools/comfyui/README.md](../../tools/comfyui/README.md) before changing a workflow.
- Managed founder-foot scripts are [prepare-founder-foot-repair.mjs](../../tools/comfyui/prepare-founder-foot-repair.mjs), [run-managed-incremental-edit.mjs](../../tools/comfyui/run-managed-incremental-edit.mjs), and [compose-founder-foot-repair.mjs](../../tools/comfyui/compose-founder-foot-repair.mjs). Exact accepted source cells live under [tools/comfyui/accepted-assets/founder-11-foot-repair](../../tools/comfyui/accepted-assets/founder-11-foot-repair).
- The managed runner owns only its uniquely named uploads/outputs, checks that the queue is empty before a run, polls only its own job history, and must never clear another user’s queue/history. It uses a fixed seed and writes audit/provenance output. For Qwen reference conditioning, an optional reference must be wired to **both** encoders. Masks are bounded, and raw/transparent/masked-composite QA must be reviewed before accepting a cell.
- The latest founder repair used Cortan/ComfyUI only; no Codex-native generator was used. Source candidates and QA are retained under [Photos for Codex 2/Codex Founders 2/founder-11-foot-repair](../../Photos%20for%20Codex%202/Codex%20Founders%202/founder-11-foot-repair).

## Current Founder repair: exact state

### Diagnosis

**Fact:** the reported standing issue and seated issue had different causes.

- Standing: zero-based founder identity `10` / `founder.11` had front-, left-, and right-idle source cells ending in flat dark trouser cuffs without recognizable shoes. The renderer was not cropping those pixels; open-floor runtime screenshots reproduced the same source silhouette.
- Seated: identity 10's seated source cell contains a complete head. `drawPixelPerson` has no crop/mask and uses the full 128x192 frame with a `181/192` floor origin. Canvas differential evidence found a lower-depth `staff.receptionist` overlapping behind the founder, causing dark silhouettes to merge and look like a missing head. This is a visual-composition problem, not a seated atlas crop.
- **Inference:** the underlying reason two staff/founder actors can occupy adjacent desk positions may deserve a gameplay/staffing-system decision. Do not make that decision here; the graphics-only fix deliberately leaves logical state unchanged.

### Accepted asset contract

The actual accepted source files are:

- [front idle](../../tools/comfyui/accepted-assets/founder-11-foot-repair/founder-11-front-idle-composed-candidate.png): `FEC79447F6CDBA9EA84904920D7617C7583C751F2C0F2E7390061013FF79C47B`
- [left idle](../../tools/comfyui/accepted-assets/founder-11-foot-repair/founder-11-left-idle-composed-candidate.png): `B416965AD55E1EC5E9114D6E75F01C3217B6E9BC8DBB26BFEFFC2D7FC363B08C`
- [right idle](../../tools/comfyui/accepted-assets/founder-11-foot-repair/founder-11-right-idle-composed-candidate.png): `99A48BBEE1EC6D890CE3B5435C4262F772D0401EE4AA3AEAA4492AFC17AF9442`

**Fact:** only zero-based identity-10 cells in the front/left/right idle atlases changed. Each is pixel-exact to the accepted source. The other 29 cells in each affected atlas remain exact. Atlas cells remain `128 x 192`; the floor anchor is at y=`181` and alpha is not allowed below that floor baseline. Runtime and manifest revision are `founders-v4-r10-feet` in [manifest.json](../../apps/player/public/art/characters/founders-v4/manifest.json). The build and verifier preserve/enforce the repair: [build-founder-actors-v4.mjs](../../tools/build-founder-actors-v4.mjs), [verify-founder-actors-v4.mjs](../../tools/verify-founder-actors-v4.mjs).

The illustrative source/candidate proof is [source-vs-composed-proof.png](../../Photos%20for%20Codex%202/Codex%20Founders%202/founder-11-foot-repair/composed-candidates-424242/source-vs-composed-proof.png). Current runtime proof screenshots are:

- [front idle source](../../artifacts/screenshots/founder-render-clip-source-id10-front-idle.png)
- [seated source](../../artifacts/screenshots/founder-render-clip-source-id10-front-seated.png)
- [seated Wall-fix identity, normal](../../artifacts/screenshots/front-desk-founder-anatomy-seated-wall-fix-identity-10-100-desktop.png)
- [seated Wall-fix identity, Build](../../artifacts/screenshots/front-desk-founder-anatomy-seated-wall-fix-identity-10-build-100-desktop.png)
- [open-floor Wall-fix identity at 100%](../../artifacts/screenshots/front-desk-founder-anatomy-open-floor-wall-fix-identity-10-100-desktop.png)
- [open-floor Wall-fix identity at 160%](../../artifacts/screenshots/front-desk-founder-anatomy-open-floor-wall-fix-identity-10-160-desktop.png)

### Seated visual-only separation

**Fact:** [frontDeskPresentation.ts](../../apps/player/src/facility/frontDeskPresentation.ts) applies a `-0.72` tile westward *center* presentation offset only when all of these conditions hold: a stationary `staff.receptionist` is at `B2` and the founder is quietly seated at `B3`. The receptionist remains in its persisted tile with the same route, role, and depth category. No logical/domain mutation was made. The focused tests are in [frontDeskPresentation.test.ts](../../apps/player/src/facility/frontDeskPresentation.test.ts), and Canvas-specific proof is in [front-desk-founder-anatomy.spec.ts](../../tests/e2e/front-desk-founder-anatomy.spec.ts).

## Validation evidence and current caveat

**Fact:** Sol-reviewed local validation on 2026-09-03 included successful focused unit checks, typecheck, atlas checks, fresh native inspection, and individual worker evidence for the founder anatomy spec. The founder verifier now asserts exact accepted identity-10 cells, dark toe-band coverage/pose extension, floor baseline, transparent perimeter, and atlas geometry; flat cuffs cannot pass.

**Fact:** the normal-mode Canvas differential reported `457` changed head pixels of `458` isolated source pixels (`99.78%`). One same-color pixel is permitted by the `99.5%` threshold. Build mode uses the same complete isolated source-row proof but does not use a full-scene RGB-difference assertion because the Build overlay intentionally changes the palette.

**Important incomplete final run:** a combined, parallel desktop-Chrome Playwright run of three specs did **not** finish cleanly: `character-resolution-zoom` and `front-desk-occlusion-polish` passed; `front-desk-founder-anatomy` emitted successful normal/Build Canvas evidence but was then marked failed after roughly 1.1 minutes due to a timeout/hang. The anatomy spec had passed individually in worker validation. **Inference:** this may be parallel resource/contention behavior, but that is not established. Do not call the combined run green until an individual anatomy rerun exits `0`, then repeat any chosen combined regression run as needed.

## Dirty worktree and ownership warning

**Fact:** at handoff preparation, branch was `beta...origin/beta` with many modified and untracked paths. Do not broad-stage, reset, checkout, or clean this shared tree.

Graphics-owned or graphics-adjacent current paths include:

- Founder atlases/manifest under `apps/player/public/art/characters/founders-v4/`
- `apps/player/src/art/bitmapAssetManifest.ts` and test; `characterBitmapArt.ts` and test; `characterArt.ts`
- `apps/player/src/facility/FacilityScene.ts`, `frontDeskPresentation.ts` and test, canonical room/examination/front-desk architecture files, environment/presentation/surface phase modules/tests
- `tools/build-founder-actors-v4.mjs`, `tools/verify-founder-actors-v4.mjs`, `tools/verify-character-resolution-alpha.mjs`, managed Cortan scripts/assets
- graphics E2E files under `tests/e2e/` including `front-desk-founder-anatomy.spec.ts`, `front-desk-occlusion-polish.spec.ts`, `character-resolution-zoom.spec.ts`, `floor-pattern-pan-stability.spec.ts`, wall/door specs
- `artifacts/screenshots/` graphics proofs and the active [Founder plan](../execplans/fix-founder-head-feet-clipping.md)

Known unrelated/concurrent systems/gameplay/UI paths include broad `packages/game-domain/` changes and tests; `packages/balance-config/`; `apps/player/src/session/` repositories/view models/storage; `App.tsx`, `AppShell.tsx`, global/UI CSS and SaveCloseDialog; package manifests/lockfile; staffed-checkin/pathing and non-editable-cursor E2E files. Some shared render/session files may have overlapping hunks, so inspect diffs at hunk level and preserve all unrelated changes.

Historical backup/deploy facts are in [CURRENT_THREAD_HANDOFF.md](CURRENT_THREAD_HANDOFF.md). The latest repair and other current dirty local changes have **not** been established as committed, pushed, or deployed by this handoff.

## Next actions

1. Confirm fresh `git status --short --branch`, active plan, and the accepted founder SHA-256 values above.
2. Start the local game only via `START_GAME.cmd`, then run the individual anatomy proof first:

   ```powershell
   npx.cmd playwright test tests/e2e/front-desk-founder-anatomy.spec.ts --project=desktop-chrome
   ```

   Do not accept the old combined run as green based on its partial evidence. If it passes, rerun the tightly relevant unit/typecheck/build/atlas validations recorded in the plan; do not change systems to “fix” a graphics test.
3. Natively inspect freshly produced 100% normal/Build screenshots, especially head separation, feet, wall occlusion, and no white alpha rim. If a live browser session was already open, perform a normal reload before judging assets; Phaser can retain a stale decoded texture in its long-lived scene.
4. Owner playtest: launch `START_GAME.cmd` and use exactly `http://127.0.0.1:4173` in the intended persistent browser profile. A normal reload reconstructs the current Phaser texture while retaining the same-origin local save. Do not substitute `localhost`, another port/host, incognito, or the Pages URL: each has separate browser storage.
5. If all green, update the active plan and shared current handoff with precise validation/commit state. If the owner wants a GitHub backup, they must explicitly say **“push to GitHub”**. That instruction authorizes a scoped audit/commit/push only; it does not authorize deployment or release.

## Accountability history

- Terra `founder_clip_repro`: service handoff failed with HTTP 404; partial diagnostic test work was preserved.
- Terra `founder_clip_repro_retry`: failed immediately with the same HTTP 404.
- Spark `founder_foot_asset_integration`: failed before edits because quota was exhausted.
- Terra `founder_foot_asset_integration_terra`: completed the bounded accepted-cell integration, revision/verifier work, and validation evidence.
- Terra `founder_seated_silhouette_separation`: completed the Front Desk-only visual offset and focused proof.
- Sol directly performed Cortan orchestration, source/renderer diagnosis, asset/candidate review, and acceptance integration when initial worker starts failed; this was a bounded fallback, not a reason to broaden scope.
- Terra `prepare_graphics_account_handoff` prepared this document only; it did not alter production code, assets, plans, or shared current handoff.

## Things not to redo / common traps

- A transparent frame gutter is not proof of recognizable anatomy: the old identity-10 standing cells were frame-safe but lacked shoes.
- The seated founder head was not cropped. Do not regenerate/reposition the founder globally to address the overlap appearance.
- Rectangle/bounds overlap is not alpha-pixel occlusion. Phaser image envelopes (notably a transparent desk-shadow envelope) can overlap without covering visible feet.
- Build overlay changes RGB; do not use raw full-scene RGB-difference equality there.
- A stale Phaser texture can survive live file replacement; reload the canonical origin before judging an updated atlas.
- `generated_images/` source material is ignored/non-durable. The tracked canonical repair source is `tools/comfyui/accepted-assets/...`; preserve its exact candidate pixels and SHA values.
- The full founder-atlas builder can rewrite all 20 atlases/proofs. For this repair, preserve the exact accepted three cells and ensure only identity 10 differs in the three affected idle atlases.
- Do not solve desk logical occupancy, routing, collision, staffing, or saves in this graphics thread. Record any need and hand it to the appropriate systems/gameplay thread.
