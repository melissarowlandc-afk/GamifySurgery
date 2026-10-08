# Twenty future employees and patients — batch 5

Owner approved GS-033 on October 7, 2026: "I reviewed the character stills in
033, those are approved and can be implemented into the game." The exact source,
pose, gallery, alpha and authored-contact hashes are bound in `owner-approval.json`.
The original review artifacts and their historical pending labels are frozen;
the separate `artifacts/character-statics/future-roster20-v5/runtime-integration.json`
supersedes those labels after promotion. No approval claim for another batch changes.

Integration uses the pre-edit `runtime-integration-baseline` (225 identities,
1,830 assets, 116 adult patients), appends 20 identities / 160 exact approved PNGs,
and results in 245 identities / 1,990 assets / 120 adult patients. Radiologist art
enters only `staff.radiologist` (4 existing + 12 new designs). APP and executive
entries have empty eligible role lists and no runtime role; their roadmap metadata
does not make them selectable. Patient occupancy, LRU, saved IDs and selection
code remain unchanged. Approved artwork must not be regenerated with `build-roster.mjs`.

Run from the root using the existing Node runtime and dependencies:

```powershell
node tools/character-mapping/future-roster20-v5/capture-integration-baseline.mjs
node tools/character-mapping/future-roster20-v5/promote-runtime.mjs
node tools/character-mapping/future-roster20-v5/validate-roster.mjs --require-root-review
node tools/character-mapping/future-roster20-v5/validate-placement-qa.mjs --require-root-review
node tools/character-mapping/future-roster20-v5/runtime-baseline.mjs
node tools/character-mapping/future-roster20-v5/validate-runtime-integration.mjs
node tools/character-mapping/future-roster20-v5/validate-promotion-rerun.mjs
```

Promotion performs strict source validation in-process and refuses changed sources,
controls, prior entries, destination images or provenance. Re-running it does not
rewrite any runtime or approved art file. This is local integration only. The owner
opening pathway remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the same browser
profile. No save origin, browser storage, deployment or Git operation is changed.

The following describes the historical art-production milestone; its pending labels
are retained as source history and are superseded by the approval above.

This is an art-only review batch with twenty adult identities and eight poses per
identity: standing and seated south, east, west and north. Employee coverage is
selected first from the current staffing and facility roadmap audit; the remaining
identities fill patient demographic gaps. Root owns `roster.json`, the prompts,
native source selection and `review-acceptance.json`.

The new stills remain pending owner visual approval and runtime registration.
Packaging never changes the game catalog, runtime registry, existing public art,
staff definitions, clinical content or saves. Future role metadata distinguishes
existing jobs, referenced but undefined job IDs, and roadmap display roles with no
invented stable ID.

The allocation pins the historical coverage audit at
`12cd31f5b08a89b8e48152a7151e8c0d82ab2c961a5b34482acf60648bf54d5f`,
which passed its exact check when captured. Later concurrent reducer edits make
that historical audit's strict `--check` fail as designed. The supplemental
`analysis/coverage-post-review-recheck.json` and
`analysis/coverage-post-review-drift.json` record a fresh execution PASS with
unchanged employee capacity, recommendation, patient model and validation fields;
only the reducer hash and fourteen citation line positions changed. The pinned
allocation was not rebased. The independent art baseline and strict art validators
pass. Later runtime integration must inspect the fresh shared state.

## Build and review

Use the repository's existing Node 24 runtime and dependencies; no install is
required. Run from the repository root:

```powershell
node tools/character-mapping/future-roster20-v5/runtime-baseline.mjs
node tools/character-mapping/future-roster20-v5/build-roster.mjs
node tools/character-mapping/future-roster20-v5/validate-roster.mjs
node tools/character-mapping/future-roster20-v5/build-placement-qa.mjs
node tools/character-mapping/future-roster20-v5/validate-placement-qa.mjs
```

The initial baseline pins all 225 existing identities, 1,830 registered assets,
116 selectable adult patient designs, catalog data, GS026 pipeline, style
reference and approved chair sources. Subsequent runs verify exact hashes and
stop on drift rather than recapturing the baseline.

Sources live under `artifacts/character-statics/future-roster20-v5/sources/NNN`.
Each native generation requires a byte-exact workspace copy, exact prompt, tool
arguments, native output receipt and ordered reference hashes. Stage 1 must match
the planned standing prompt; original Stage 2 must match the planned eight-pose
prompt. A correction must reference an immutable history sheet whose complete
verified chain reaches the original Stage 2 generation. The tools do not generate,
repaint or replace native source images.

`build-roster.mjs` uses the existing GS026 `extractEight` and `normalizeCells`
unchanged. It derives eight unique transparent 160×320 frames, light/dark/full
proofs, native source boards, a paired standing/seated overview and a local HTML
gallery. Pose manifests pin source evidence, transforms, hashes and measured
alpha. The staging manifest reports employee counts, active role counts, planned
role counts, patient counts and demographic bands.

Before overwriting a packaged review, the builder preserves its byte-exact
manifest, eight poses, four proof PNGs and contact coordinates under
`packages/NNN/review-history/<manifestSha256>/`, with a hash receipt. This keeps
earlier manual review evidence recoverable when selected sources or authored
contacts change. These historical review copies are excluded from the active
160-pose staging count.

Inferred seated contacts are written only to `seat-contact-candidates.json`.
Root must manually review all four directions for every identity and bind those
coordinates to each exact selected source hash in the read-only acceptance ledger.
Strict root review also requires twenty `manualContactEvidence` receipts with a
nonempty manual method and exact PNG hashes. Their preserved overlays must resolve
inside this batch's `root-review/contact-overlays/`; rebuilt package grids are
deliberately not durable manual evidence.
Root must also explicitly accept the exact measured faint-alpha report. Clipping
source alpha of 13/255 or above is always a hard failure; lower-alpha fringe loss
and output-border alpha are measured rather than silently discarded.

Chair proofs use the approved south-facing Front Desk support and its recorded
asset crop, draw destination, seat inset and actual 52px-tile character geometry.
They are offline review composites; no unauthored chair geometry for other
directions is claimed. Root reviews all twenty individual placements and the five
four-character boards before binding the board hashes in the ledger.

After all sources and contacts are accepted by root:

```powershell
node tools/character-mapping/future-roster20-v5/build-roster.mjs
node tools/character-mapping/future-roster20-v5/build-placement-qa.mjs
node tools/character-mapping/future-roster20-v5/build-roster.mjs
node tools/character-mapping/future-roster20-v5/validate-roster.mjs --require-root-review
node tools/character-mapping/future-roster20-v5/validate-placement-qa.mjs --require-root-review
node tools/character-mapping/future-roster20-v5/validate-gallery.mjs
```

The second package build includes the completed chair links in the gallery.
These builders are deterministic and never write the root ledger. Complete
validation is available before root review with `--require-complete`.

The gallery is
`artifacts/character-statics/future-roster20-v5/review/index.html`.
Browser validation uses an already installed browser in fresh, ephemeral
contexts at 1440px and 390px. It opens only local artifact files; it does not
access the owner game origin or campaign storage. Owner playtesting keeps its
usual pathway: `START_GAME.cmd` → `http://127.0.0.1:4173` in the existing browser
profile. This batch does not yet appear in that game.
