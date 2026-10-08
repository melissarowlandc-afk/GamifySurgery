# Patient gap-fill v6a — accepted art and append-only runtime integration

Manager visual acceptance was recorded on 2026-10-07 in the program plan,
under the owner's delegated approval. `owner-approval.json` binds that exact
statement, native sources, 160 pose hashes, 80 authored contacts, alpha report,
worker review, gallery and manager comparison sheet. Original generation and
worker-review artifacts below remain byte-exact historical evidence.

The v5 integration flow is mirrored by `bind-owner-approval.mjs`,
`capture-integration-baseline.mjs`, `promote-runtime.mjs`, `runtime-contract.mjs`,
`validate-runtime-integration.mjs` and `validate-promotion-rerun.mjs`.
The pre-edit baseline is in this batch's `runtime-integration-baseline/` artifact
directory. Promotion refuses drift or overwrites, preserves 245 existing
identities / 1,990 assets, and appends 20 patients / 160 exact PNGs. The result is
265 identities / 2,150 assets / 140 selectable patients, with unchanged
`appearance.ts` selection code. Historical pending labels are superseded by
the separate manager-approval and `runtime-integration.json` receipts.

Post-integration checks:

```powershell
node tools/character-mapping/patient-gapfill-v6a/validate-roster.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6a/validate-placement-qa.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6a/validate-worker-review.mjs
node tools/character-mapping/patient-gapfill-v6a/runtime-baseline.mjs
node tools/character-mapping/patient-gapfill-v6a/validate-runtime-integration.mjs
node tools/character-mapping/patient-gapfill-v6a/validate-promotion-rerun.mjs
```

The worker-review comparison validator uses the immutable pre-integration
catalog for its historical 77-design comparison inventory. Live runtime status
comes from the separate approval/integration contract. The gallery and native
art are not regenerated. Full game-domain and player suites use threads/native
configuration in this sandbox; the player-only test config is in this folder.
Manager acceptance includes a successful gallery-browser run. Worker browser
startup is blocked by `spawn EPERM`; manager owns final browser/HTTP delivery
review. No launcher, origin, profile, save, clinical content or art edit occurs.

The following sections describe the frozen generation milestone.

Twenty new adult patient identities, `patient-gapfill-v6a.001`–`.020`, with
standing and seated S/E/W/N poses: **160 transparent 160×320 PNGs**. This is
process step 1 of `docs/execplans/character-gapfill-v6-20261007.md`.

| Assigned band | Identities |
| --- | --- |
| Female 45–64 | 001–007 (7) |
| Male 45–64 | 008–013 (6) |
| Female 30–44 | 014–017 (4) |
| Male 30–44 | 018–020 (3) |

All content is visual appearance metadata. There are no diagnoses, disease
weights, ethnicity fields, clinical claims or gameplay-selection rules.

## Review entry points

- Main: `artifacts/character-statics/patient-gapfill-v6a/review/index.html`
- Comparisons: `artifacts/character-statics/patient-gapfill-v6a/comparison/index.html`
- Eight-pose native boards: `artifacts/character-statics/patient-gapfill-v6a/review/source-review.html`
- Four-direction contacts: `artifacts/character-statics/patient-gapfill-v6a/contact-review/index.html`
- Existing Front Desk chair proofs: `artifacts/character-statics/patient-gapfill-v6a/placement-qa/index.html`
- Worker receipt: `artifacts/character-statics/patient-gapfill-v6a/worker-review/visual-review.json`
- Exact validation log: `artifacts/character-statics/patient-gapfill-v6a/validation/worker-validation.txt`
- Per-identity handoff: `tools/character-mapping/patient-gapfill-v6a/HANDOFF.md`

The main gallery shows all eight poses on light and dark backgrounds for each
identity, its nearest six existing same-band designs, and links to a page with
**every** existing patient in that sex/age band. Existing public images are read
in place. No runtime catalog, registry or public art was edited.

Open these as static review files. This gallery does not start the game or
access campaign saves. The canonical game launcher and storage origins are
unchanged.

## Generation and style provenance

The worker confirmed and used the built-in `image_gen.imagegen` tool. No API
image calls, installations, downloads or procedurally drawn characters were
used. There were **40 initial calls plus two targeted regeneration calls**.

Before generation, eight v3/v4/v5 identities were inspected using `view_image`;
the exact examples are pinned in `worker-review/visual-review.json`. All 77
existing runtime patients in the requested bands were also reviewed on four
comparison boards. Prompts reuse v5 identity 018's established two-stage
structure and the original GS026 employee 001 cardinal sheet as the shared
style reference. Stage 2 also references that identity's own stage 1 sheet.
Starting at 009, prompts explicitly reinforce full sleeves in seated north.

Every native source is preserved byte for byte with the exact submitted
prompt, tool arguments, original local output path, ordered reference hashes
and source hashes. Generated references are never silently replaced. The
superseded 007/008 originals and their receipts remain under
`sources/NNN/history/original-short-sleeve-north/`.

- **007 regenerated once:** seated north shortened the sage cardigan sleeves.
- **008 regenerated once:** seated north shortened the coral henley sleeves.
- No other identities were regenerated.

`design-rows.json` and `roster.json` retain the authored design intent. The
handoff and `worker-review-notes.json` describe the final visible appearance,
including the small hair/outfit realizations on 012, 013 and 018.

## Packaging contract and checks

The v5 builder and validators were mirrored into this lane. They import the
unchanged GS026 `extractEight` and `normalizeCells`: one whole-body scale per
identity, body axis x=80, floor y=287, standing south visible height=246. There
is no segmented scaling, mirroring, cleanup, repaint or replacement artwork.

`authored-contacts.json` records all 80 manually reviewed seated contacts.
`bind-worker-contacts.mjs` binds them to final source hashes and saved overlays.
Chair QA uses the existing approved **south-facing** Front Desk fixture and
runtime rendering math. Its E/W/N support is not authored, so those three
directions receive contact overlays rather than fabricated chair composites.

The original v5-style validator independently re-extracts and normalizes all
poses, checks source provenance and unique hashes, alpha-zero transparency,
canvas geometry, anchors, contact values, immutable review history, and the
pinned 245-identity/1,990-asset/120-patient runtime baseline.

The alpha report distinguishes visible-art clipping from sub-threshold noise.
There is no clipped alpha ≥13. Maximum lost source fringe alpha and maximum
output-border alpha are both **1**. Native PNGs are unchanged. The exact report
is bound to the worker review receipt and still awaits manager acceptance.

`validate-worker-review.mjs` also checks all 80 manually authored contacts,
worker review hashes, 20 chair proofs, all static gallery references, 397
comparisons against the 77 existing same-band identities, and 45 within-batch
same-band pairs. It reconstructs the comparison set from the runtime catalog
and recomputes every score independently.

The comparison metric is RGB RMSE on 64×128 light-background thumbnails fitted
to a common visible height. A score below 8 flags near-identical thumbnails.
Zero flags, together with manual visual review, passed worker QA. This metric
is only a review aid; it cannot establish artistic equivalence or prove that
two identities are distinct. Some early catalog sprites have different head
proportions from the recent v3/v4/v5 references.

## Rebuild and validate

Run from the repository root, with the existing Node dependencies:

```powershell
node tools/character-mapping/patient-gapfill-v6a/build-roster.mjs
node tools/character-mapping/patient-gapfill-v6a/build-placement-qa.mjs
node tools/character-mapping/patient-gapfill-v6a/build-comparison.mjs
node tools/character-mapping/patient-gapfill-v6a/bind-worker-review.mjs
node tools/character-mapping/patient-gapfill-v6a/validate-roster.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6a/validate-placement-qa.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6a/validate-worker-review.mjs
node tools/character-mapping/patient-gapfill-v6a/runtime-baseline.mjs
```

The evidence-binding command must only be run after actually inspecting the
current proofs. It records **worker QA**, not manager acceptance. It does not
update the root/manager approval fields. Rebuilding with changed sources or
contacts requires renewed visual review and a new receipt. Intake scaffolding
and prompt-authoring helpers are not normal rebuild commands.

## Manager's remaining checks

The worker did **not** launch a browser. The manager runs:

```powershell
node tools/character-mapping/patient-gapfill-v6a/validate-gallery.mjs
```

This uses an already installed browser in fresh ephemeral contexts, checks 25
pages at desktop/phone widths, verifies all 60 main-gallery images load, checks
local links and horizontal overflow, and saves browser screenshots/results.
It does not touch owner game storage. No browser installation is attempted.

Manager visual acceptance is pending, with particular attention to 007's
slightly smoother native finish and the draped-garment contacts on 003, 006,
007, 016 and 017. The manager can record acceptance in the mirrored v5 ledger
format and then validate `--require-root-review` during a separately authorized
milestone. The worker deliberately leaves `accepted={}`, contact
`approvedDirections=[]`, `runtimeReady=false` and the inherited owner/root
review labels pending. The program already delegates visual acceptance to the
manager; these pending labels are not a request for another owner decision.

No integration, Git operations, push, deployment or publication was performed.
