# Room thumbnails from the actual game renderer

## Blank-room recovery (Ambulatory OR, Staff Break, Reading)

The manager's 157-image run completed, but these three rooms were solid fills
at all five tiers. They were **lighting overlays**, not missing/hidden room
sprites or unloaded art. Inside each inset footprint the old PNG had exactly
one color: OR `#e3edfb`, Staff Break `#ffeed8`, Reading `#8a8c8c`. Those are
the authored always-on MULTIPLY tints in `roomTouchups.ts`.

Phaser 4.2.1 checks Canvas blend support asynchronously, initially false.
Constructing Game immediately (as the QA entry does) can cache `source-over`
for MULTIPLY/SCREEN. The renderer never refreshes that table when the probe
finishes. An alpha-1 tint then covers the floor, furniture and most walls.
The installed Phaser capability/factory code reproduces this stale table in
a native deferred-image probe; no browser was run by the worker.

**Live-game finding:** `FacilityCanvas.tsx` also selects Canvas, so an early
live boot can have the same defect. It is timing-dependent, not a room-specific
missing asset. `FacilityScene.create()` now synchronously checks the native
context's support and repairs only the two required mappings. Context state,
room art/coordinates/depth and unrelated blend modes remain intact. QA also
asserts the mappings before becoming ready. Actual full `drawRoom` command
tests find 10 / 20 / 9 visible images respectively and identical live/capture
shell/floor/furniture/lighting commands. These are native command checks;
the manager must regenerate and review pixels, and check a fresh live boot.

Both pre-frame stage pixels and final frame pixels must pass the shared
`roomThumbnailPixels.mjs` guard. It measures the room's floor interior with
4% excluded on each edge, ignoring the vignette, shadow and surviving walls.
It requires at least 90% opaque coverage, 24 exact colors, 8 coarse RGB bins,
and 2% contrasting pixels (at least 3 four-bit bins from the dominant bin in
one channel). This rejects solid/near-solid/noisy/transparent fills and the
neutral gradient alone. The PNG decoder bundled with the existing pinned
Playwright independently applies this guard **before staging** and during
`--verify`; stored success flags, metrics or matching hashes cannot waive it.
There is no new dependency, browser requirement for verification, or art filter.

Against the manager's existing 157 PNGs the new guard passes **142/142 valid
images** and rejects **15/15 blank images**. The sparse hallway passes with
40 colors, 14 bins and 14.6% contrast; the lowest valid contrast is 11.6%.
Failures keep the existing per-room continuation/report/no-publication policy.
Generation records source/frame/decoded-PNG quality metrics for review. All
renderer/quality `.ts`, `.mts`, `.mjs` sources and decoder version are hashed.

**Waiting Room:** tiers 1 and 5 really do have identical live appearance.
The full room command streams and existing PNG hashes are equal, consistent
with its current upgrade catalog (`appearanceChanges: false`). No art change
was made. Regenerate **all 157** using the :5186 commands below; the worker
has not replaced the existing PNGs. Old generation hashes are now stale.
Evidence: `.local-dev/room-thumbnails-20261102/recovery-blank/` (diagnosis,
actual room commands, Phaser cache probe, 157-image quality audit, validations).

## Capture-88 recovery

The manager's existing QA server is `http://127.0.0.1:5186`. Keep that separate
save-free server for this rerun:

```powershell
node tools/art/generate-room-thumbnails.mjs --url http://127.0.0.1:5186/room-thumbnails.html --channel chrome
node tools/art/generate-room-thumbnails.mjs --verify
```

Workshop capture 88 exposed a real live-renderer defect: concrete-floor bloom
ellipses escaped the footprint because the proof's floor clip was omitted.
The first ellipse's room-local bounds were `[-415,-368]` to `[-85,-38]`, or
stage coordinates `[-55,-8]` to `[275,322]`. The floor is `[0,0]` to `[360,360]`.
The renderer now clips floor ellipses using Phaser's same 32-segment outline;
it preserves the existing in-room pattern, room/furniture placement and depth.
The same correction confines Vending floor speckles, which also escaped their
floor, though they did not reach the 3-tile stage margin.

The generator now attempts **all 157 jobs** even when a room capture, decode or
staging write fails. Every failure logs its attempt number, definition, tier
and error. `generation.json` and the local `capture-run.json` contain the full
failure list and explicit `complete` / `published` flags. An incomplete batch
exits **1**, keeps successful PNGs staged, and updates no public PNGs. Its review
sheet shows successful staged captures and clear failed-room cards; it never
substitutes an old staged image for a failed room. `--verify` rejects incomplete
reports, any failed capture, identity mismatches and every missing/changed PNG.
Older generation reports need a fresh complete run.

Static inspection/regression covers captures **88-157**, including all tiers
of Workshop and every later room: floors, normalized furniture, touchups,
lighting, procedural partitions and canonical shell geometry. The native
command test also checks Workshop painting at different world origins/scales.
This is coordinate evidence, not browser-image acceptance. Manager still
reruns Chrome and reviews the images before accepting wiring. Owner gameplay
remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in the intended profile;
QA :5186 is disposable and has no save connection.

The phone and desktop catalogs resolve `art/rooms/thumbnails/manifest.json`.
All 33 buildable definitions (including the hallway and base Front Desk) are
mapped; the retired Imaging Control Room is intentionally absent. There are
157 captures: base tier 1 plus every supported upgrade tier. Facility unlock
level is metadata, never an upgrade tier. New rooms have no placed doors yet.

The development-only `room-thumbnails.html` entry preloads the game's complete
local room/shell art, then calls `FacilityScene.renderRoomThumbnail()` for a
single clean, unoccupied north-up room. This calls the real `drawRoom` path:
canonical architecture, floor, furniture, clipping, depth, partitions,
touchups, empty chairs, upgrade appearance and lighting. It never replays the
proof transforms or constructs a second renderer. No app shell, campaign,
clinical content request, session, persistence or AI request is started.

## Run (manager; requires a working real browser)

From the repository root in PowerShell, start the disposable Vite QA server:

```powershell
npm.cmd run dev --workspace @gamify-surgery/player -- --host 127.0.0.1 --port 5184 --strictPort
```

In another terminal:

```powershell
node tools/art/generate-room-thumbnails.mjs --url http://127.0.0.1:5184/room-thumbnails.html --channel chrome
node tools/art/generate-room-thumbnails.mjs --verify
```

`--channel msedge` uses installed Edge. Omit `--channel` to use an already
installed Playwright Chromium. No browser/dependency install is part of this
workflow. The capture command itself opens a fresh nonpersistent browser
context and restricts requests to the QA origin. It never opens an owner's
profile, reads or writes localStorage/IndexedDB, or clears existing storage.
If :5184 is occupied, select another **disposable loopback** Vite port and
pass that exact `/room-thumbnails.html` URL to the generator; do not stop an
unrelated server. The normal game remains START_GAME.cmd →
`http://127.0.0.1:4173` in the intended persistent profile, with its own saves.

Open `.local-dev/room-thumbnails-20261102/preview.html` in the browser to review
all tiers at large, phone (76 × 54) and desktop (29 × 25) sizes. Show the owner
the Waiting Room and X-ray Room alongside the actual built rooms, then inspect
every room and tier, especially Founder's Office tier 1/5, MRI floor markings,
Recovery partitions, small rooms and the hallway. Wiring is implemented but
**visual acceptance stays pending until the manager generates and reviews
the images and shows the owner**. No fabricated PNGs are substituted when
browser execution is unavailable; catalogs show a stable icon fallback.

## Outputs and determinism

- PNG assets under `apps/player/public/art/rooms/thumbnails/`, 480 × 336:
  3× a 160 × 112 logical frame, tight alpha crop, even minimum 24px padding,
  centered fit, nearest-neighbor pixel sampling. No blur/filter touches art.
- Neutral cream/sage background, gentle warm vignette behind the room, soft
  contact shadow. Catalog CSS adds the existing rounded frame.
- `generation.json` records every PNG hash, dimensions, source/destination
  bounds, browser version, room metadata, SHA-256 renderer/source-art inputs
  and the complete failure/publication status of the latest attempt.
- `--verify` needs no server/browser. It decodes PNG pixels and fails on blank
  or near-uniform room interiors, missing/changed PNGs, stale manifest, missing
  tiers, changed renderer/assets, or unexpected dimensions.
- All images are staged locally; public PNGs update only after the whole
  run passes. An incomplete attempt still writes an explicitly failed generation
  report so verification cannot mistake stale assets for a completed run.
  No deletion, Git action, upload, deployment or external publication occurs.

Regenerate after room definitions, default appearance, furniture, shells,
lighting, bitmap assets or capture recipe changes. Use the same browser
version for byte-for-byte PNG comparisons; browser versions can encode or
rasterize differently. Review remains necessary after regeneration.

## Tests without a browser

```powershell
node --test --test-isolation=none tools/art/room-thumbnail-options.test.mjs
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/art/roomThumbnailManifest.test.ts src/facility/roomThumbnailCapture.test.ts src/facility/canvasRoomLighting.test.ts src/facility/roomThumbnailBounds.test.ts src/facility/approvedRoomRenderer.test.ts src/facility/roomUpgradeAppearance.test.ts src/facility/roomTouchups.test.ts src/ui/RoomCatalogThumbnail.test.tsx src/ui/BuildPanel.test.tsx src/mobile/build/level5RoomThumbnails.test.tsx src/mobile/build/MobileBuild.test.tsx src/mobile/performance/lazyArt.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
```

The preload is the existing sandbox workaround for Vite's optional Windows
`net use` probe. Manager also reruns real-browser QA/default-config validation
in their environment. Tests prove contracts and geometry; they are not proof
of final image composition or owner acceptance.
