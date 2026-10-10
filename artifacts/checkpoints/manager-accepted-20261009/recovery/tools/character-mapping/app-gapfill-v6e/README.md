# APP gap-fill v6e

Art-only candidate batch: `app-gapfill-v6e.001` through `.008`, four women and
four men aged 28-60, with eight standing/seated S/E/W/N poses each. All 64
transparent frames are 160x320. Eligibility is the existing `staff.app` role;
appearance is visual only. Manager acceptance and runtime integration are pending.

## Review entry points

- Main gallery: `artifacts/character-statics/app-gapfill-v6e/review/index.html`.
- Manager gallery: `artifacts/character-statics/app-gapfill-v6e/review/manager/index.html`.
- Approved APPs on top/new eight below:
  `artifacts/character-statics/app-gapfill-v6e/review/manager/approved-apps-top-new-eight-below.png`.
- Existing/all-catalog comparisons: `comparison/index.html` and
  `comparison/all-catalog.html` beneath the artifact root.
- Authentic chair proofs: `placement-qa/index.html` beneath the artifact root.
- Exact validation output: `validation/worker-validation.txt` and
  `validation/worker-validation.json` beneath the artifact root.
- Per-identity findings and limits: [HANDOFF.md](HANDOFF.md).

## Source and package workflow

The workflow mirrors `staff-gapfill-v6d`, using built-in image generation for
eight standing identity sheets followed by eight complete pose sheets. Native
outputs, exact prompts, arguments, provenance and reference hashes are preserved
in `sources/001` through `sources/008` beneath the artifact root. There were 16
initial calls and no corrections. Derived art uses the unchanged GS026 extractor
and normalization policy; no repainting, mirroring or alpha cleanup occurs.

Run scripts from the repository root. `prepare-request.mjs <number> <stage>`
prepares an initial request; `save-native.mjs` preserves its native output and
receipt. The finalized batch already has all sources and should not be regenerated
or overwritten during review. Packaging modules are `build-roster.mjs`,
`build-placement-qa.mjs`, `build-comparison.mjs`, `build-style-review.mjs` and
`build-qa-atlases.mjs`. Manually authored contact coordinates are in
`authored-contacts.json`; `bind-worker-contacts.mjs` binds them and their overlays.
`bind-worker-review.mjs` binds actual worker inspection notes to immutable proof
hashes. Worker QA never grants manager approval.

The exact seven commands are in `validation-commands.json`. Launch them directly
from the shell, capture each named stdout/stderr/exit/timing file beneath
`validation/`, then run `record-worker-validation.mjs`. `check-syntax.mjs` uses
`node --experimental-vm-modules` to avoid child-process parsing. No installs,
game tests or runtime writes are needed for this art-only batch.

The manager runs `node tools/character-mapping/app-gapfill-v6e/validate-gallery.mjs`
in its browser-capable environment. This prepared check covers 16 local pages at
desktop and phone sizes, for 32 page/viewports. It uses fresh ephemeral browser
contexts and file URLs (`location.origin` is `null`), without owner game storage.
Owner playtesting remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in the same
persistent profile. The review gallery creates no campaign-save pathway change.

The shared tree includes concurrent Level 4 M5 work. Only this tool lane, its
artifact lane and the expressly authorized append to the character program plan
belong to this worker. Existing runtime art and extraction/chair controls are
hash-pinned; concurrent gameplay sources are outside that preservation snapshot.
