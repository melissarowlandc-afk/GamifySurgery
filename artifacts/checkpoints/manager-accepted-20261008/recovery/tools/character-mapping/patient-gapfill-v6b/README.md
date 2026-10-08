# Patient gap-fill v6b generation and packaging

This lane contains 20 adult patient candidates and 160 transparent standing /
seated S/E/W/N poses. Allocation: Female 45-64 x7, Male 45-64 x6,
Male 30-44 x4, Female 30-44 x3. Stable IDs are `patient-gapfill-v6b.001`-`.020`.
Appearance is visual only. Manager acceptance is pending; runtime integration
is outside this lane.

The direct template is accepted v6a. Prompt structure comes from v6a.001;
every native request uses v6a.004's accepted eight-pose source as its style
reference. Native artwork is generated or corrected only with the built-in
image generation tool. No procedural character art, alternate provider, paid
API, dependency installation or web retrieval was used.

## Evidence

- Full handoff and per-identity final appearance/contact table: `HANDOFF.md`.
- Roster/design intent: `roster.json`, `design-rows.json`, `prompts/`.
- Final visible appearance and actual worker QA: `worker-review-notes.json`.
- Source-bound contacts: `authored-contacts.json`, `review-acceptance.json`.
- Main gallery: `artifacts/character-statics/patient-gapfill-v6b/review/index.html`.
- Overview: `review/owner-overview-stand-south-sit-east.png` under that artifact root.
- Direct style comparison: `review/manager/v6a-top-v6b-bottom.png`.
- Exact commands, stdout/stderr and exit codes: `validation/worker-validation.txt`
  and `validation/worker-validation-log.json` under the artifact root.

Each `sources/NNN/` contains immutable native PNGs, exact prompts, tool
arguments and provenance receipts. The one rejected 006 sheet and its receipts
remain in `sources/006/history/original-cane-rear-wrong-hand/`.
Each `packages/NNN/` contains eight 160x320 PNGs, hash/anchor manifests,
light/dark pose proofs, a seated contact grid and frozen review history.

## Geometry and review contract

Use the unchanged GS026/v6a extraction and normalization pipeline: eight
connected figures, identity-wide uniform scale, x80 body axis and floor Y287.
Standing south provides the 246px target visible height, with the inherited
whole-identity width/floor guards. Never mirror missing poses, reshape body
parts, repaint pixels or replace native art. All 80 seated contacts are authored
against the final sources. The approved south-facing Front Desk chair fixture
provides 20 actual compositor proofs; other chair orientations are not invented.

The near-duplicate checks cover all 265 prior catalog identities (245 original
plus 20 accepted v6a), not merely the 97 matching patient-band identities. They
recompute 5,300 catalog comparisons and all 190 within-v6b pairs. The inherited
RGB RMSE flag threshold is 8; this is a visual-review aid, not an identity or
style certificate. Original same-band evidence is also retained (500 comparisons
and 45 same-band pairs).

The preservation baseline pins the original 245 catalog/registry entries,
1,990 asset byte hashes, seven extraction/chair source files, and accepted
v6a's 160 packaged poses plus 40 native sources. It permits only the explicitly
authorized concurrent v6a registry/catalog additions. All v6b output remains
outside the runtime.

## Rebuild existing native inputs

From the repository root, run these sequentially. No generation call is made by
these commands. Do not rebuild after manager acceptance without an authorized
review change, because rebuilding replaces pending review artifacts.

```text
node tools/character-mapping/patient-gapfill-v6b/build-roster.mjs
node tools/character-mapping/patient-gapfill-v6b/build-placement-qa.mjs
node tools/character-mapping/patient-gapfill-v6b/build-comparison.mjs
node tools/character-mapping/patient-gapfill-v6b/build-all-catalog-comparison.mjs
node tools/character-mapping/patient-gapfill-v6b/build-style-review.mjs
node tools/character-mapping/patient-gapfill-v6b/build-qa-atlases.mjs
node tools/character-mapping/patient-gapfill-v6b/bind-worker-review.mjs
```

`build-roster` rewrites the main gallery; the two comparison builders restore
its comparison links. The source inventory already exists and is bound to the
immutable baseline. `setup-v6b.mjs` and `build-prompts.mjs` are intake helpers,
not routine rebuild steps; do not reinitialize the populated review ledger.

## Validate

```text
node tools/character-mapping/patient-gapfill-v6b/validate-roster.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6b/validate-placement-qa.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6b/validate-worker-review.mjs
node tools/character-mapping/patient-gapfill-v6b/validate-all-catalog-comparison.mjs
node tools/character-mapping/patient-gapfill-v6b/runtime-baseline.mjs
node --experimental-vm-modules tools/character-mapping/patient-gapfill-v6b/check-syntax.mjs
```

Manager-only browser check, deliberately not run by this worker:

```text
node tools/character-mapping/patient-gapfill-v6b/validate-gallery.mjs
```

That check covers 26 pages at desktop and phone sizes (52 page/viewports),
including all-catalog comparisons, using fresh file-gallery contexts. It does
not open the game or change its origin/storage. No integration, promotion,
deployment or publication command is provided in this generation lane.

## Manager-authorized runtime integration (2026-10-08)

The manager accepted v6b under the owner's delegated visual approval in
`docs/execplans/character-gapfill-v6-20261007.md`. The separate
`owner-approval.json` binds that exact acceptance statement, the owner's exact
instruction, 20 sources, 160 packaged poses, 80 authored contacts, alpha report,
gallery and worker review. Historical pending labels and art evidence stay
byte-identical; approval and runtime receipts report the current status.

This lane follows the proven v5/v6a append-only flow. Capture the immutable
**live** baseline before every runtime/test edit: v6a is already integrated, so
it includes all 265 identities, 2,150 public assets, 140 patients, anchors and
prior provenance. The original generation baseline remains frozen at 245
identities plus pinned accepted v6a sources/poses; it is not rebased.

```text
node tools/character-mapping/patient-gapfill-v6b/bind-owner-approval.mjs
node tools/character-mapping/patient-gapfill-v6b/capture-integration-baseline.mjs
node tools/character-mapping/patient-gapfill-v6b/promote-runtime.mjs
python tools/character-mapping/patient-gapfill-v6b/update-runtime-tests.py
node tools/character-mapping/patient-gapfill-v6b/validate-runtime-integration.mjs
node tools/character-mapping/patient-gapfill-v6b/validate-promotion-rerun.mjs
python tools/character-mapping/patient-gapfill-v6b/audit-scoped-changes.py
```

Promotion preflights complete roster, placement, worker review and all-catalog
checks without rewriting review outputs. It refuses source drift, unrelated
runtime edits, replacement PNG bytes or changed provenance claims. It appends
only `patient-gapfill-v6b.001`–`.020` and the exact accepted PNGs beneath
`apps/player/public/art/characters/patient-gapfill-v6b/`. Result: 285 identities,
2,310 assets and 160 adult patients. The new patients enter only their exact
sex/age-band pools. `appearance.ts` and existing occupancy/LRU/saved-ID logic
remain byte-identical. Repeated promotion performs no input/runtime writes.

Only catalog/registry test counts increase. Additional integration assertions
check sex/age boundaries, complete pool exhaustion, occupied/free/LRU reuse,
saved IDs, accepted pose hashes and authored contacts. Full package validation
uses this batch's native test-only config, leaving shared Vite configuration
unchanged:

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --configLoader=native
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../tools/character-mapping/patient-gapfill-v6b/vitest-player.config.mjs --configLoader=native
npm.cmd run typecheck
```

`run-validation.py <log-name> <command> ...` records exact combined stdout/stderr,
exit codes, timestamps and log hashes in this batch's `validation/` directory.
The manager reviews the filesystem diff and performs canonical HTTP delivery
checks. The owner pathway stays `START_GAME.cmd` → `http://127.0.0.1:4173`, same
persistent profile and saves. This lane does not authorize Git or publication.
