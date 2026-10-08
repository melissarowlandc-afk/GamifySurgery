# Patient gap-fill v6c generation and packaging

This lane contains 19 adult patient candidates and 152 transparent standing/seated S/E/W/N poses. Stable IDs: `patient-gapfill-v6c.001`-`.019`. Allocation: Female 65+ x7, Male 65+ x8, Female 30-44 x2, Male 30-44 x2. Appearance is visual only. Manager acceptance and browser validation remain pending; runtime integration is outside this lane.

Accepted v6a/v6b are the template and style anchor. Every initial native request used accepted v6a.004's eight-pose sheet, the same direct anchor used for v6b. Prompt structure comes from v6a.001. Built-in image generation produced 38 initial sheets, one 017 east-hair correction and two manager-requested 018 adult/layout corrections. Original art and receipts are preserved; other18 identities are accepted and byte-identical, while revised018 awaits acceptance. No procedural character art, alternate provider, paid API, installs or web.

## Evidence

- Full per-identity table, contacts, regenerations, exact validator output and style concerns: `HANDOFF.md`.
- Intended designs and generation prompts: `roster.json`, `design-rows.json`, `prompts/`.
- Observed final appearance and glasses review: `worker-review-notes.json`.
- Authored contacts and worker-only review ledger: `authored-contacts.json`, `review-acceptance.json`.
- Main gallery: `artifacts/character-statics/patient-gapfill-v6c/review/index.html`.
- Overview: `review/owner-overview-stand-south-sit-east.png` under that artifact root.
- Same-scale accepted v6b above / v6c below: `review/manager/v6b-top-v6c-bottom.png`.
- All attempts and exact final output: `validation/worker-validation-log.json`, `worker-validation.txt`, `build-runs.json` under the artifact root.

Each source directory stores byte-exact native PNGs, exact prompts, tool arguments and hash-bound provenance. The rejected 017 sheet remains in `sources/017/history/original-east-shaved-side-mismatch/`. Each package has eight 160x320 PNGs, hash/anchor manifests, light/dark proofs, seated grid and frozen review history.

## Geometry and review contract

Use unchanged GS026/v6a/v6b extraction: body axis X80, floor Y287, standing-south visible-height target 246px and one identity-wide scale. No mirroring, reshaping, repainting or procedural replacement. All 76 contacts are manually authored from final sources. Approved south-facing Front Desk geometry supplies 19 compositor proofs; other chair orientations are not invented.

All-catalog checks cover 285 previous designs (245 original +20 v6a +20 v6b), 5,415 comparisons and all 171 within-batch pairs. Same-band checks retain 75 prior patients, 287 comparisons and 51 pairs. RMSE <8 is only a flagging aid. Actual visual review is source-bound separately.

The preservation baseline pins original 245 entries/1,990 assets, seven pipeline/chair files, and all 320 poses/80 native sources from accepted v6a/v6b. Authorized concurrent v6b append-only registry/catalog integration is allowed. No v6c runtime entry is permitted. Four observed glasses identities (002/006/010/013) give 21.1%; no gray curls+glasses. One cane and two hearing aids are visual only.

## Rebuild existing native inputs

Run from repository root, sequentially, only for an authorized review revision. No generation calls occur. Do not regenerate or replace accepted review evidence.

```text
node tools/character-mapping/patient-gapfill-v6c/build-roster.mjs
node tools/character-mapping/patient-gapfill-v6c/build-placement-qa.mjs
node tools/character-mapping/patient-gapfill-v6c/build-comparison.mjs
node tools/character-mapping/patient-gapfill-v6c/build-all-catalog-comparison.mjs
node tools/character-mapping/patient-gapfill-v6c/build-style-review.mjs
node tools/character-mapping/patient-gapfill-v6c/build-qa-atlases.mjs
node tools/character-mapping/patient-gapfill-v6c/build-018-revision-review.mjs
node tools/character-mapping/patient-gapfill-v6c/bind-worker-review.mjs
```

`build-roster` rewrites the main gallery. Run chair proofs before `build-comparison`; that comparison builder restores comparison links and adds verified chair links. Intake helpers `setup-v6c.mjs`/`build-prompts.mjs` are not routine rebuild steps. Never reinitialize the populated ledger. If source poses change, visually review them, revise authored contacts and run `bind-worker-contacts.mjs` before packaging; never mutate the ledger while a build is running.

## Validate

```text
node tools/character-mapping/patient-gapfill-v6c/validate-roster.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6c/validate-placement-qa.mjs --require-complete
node tools/character-mapping/patient-gapfill-v6c/validate-worker-review.mjs
node tools/character-mapping/patient-gapfill-v6c/validate-all-catalog-comparison.mjs
node tools/character-mapping/patient-gapfill-v6c/runtime-baseline.mjs
node tools/character-mapping/patient-gapfill-v6c/018-revision-baseline.mjs verify
node --experimental-vm-modules tools/character-mapping/patient-gapfill-v6c/check-syntax.mjs
```

All worker checks passed. Manager alone runs `validate-gallery.mjs` for browser validation as requested. No game origin/storage was used. LOCAL ONLY; manager owns final acceptance, common handoff and the GitHub checkpoint reminder. See workflow-notes.md for the acknowledged intake read-only Git command and resolved packaging issues.

## Manager-requested 018 adult revision

Revised018 has a mature lower face with stubble, short side-parted black hair, adult torso and full-length rust chinos. Original teen source and standing receipts: `sources/018/history/original-teen-reading/`; rejected first adult layout: `sources/018/history/adult-first-tight-rowgap/`. Active source SHA256:`4bf3c14e8b4b9965510cea919be7f229a3dc3af5b7a556d4c68cf511717d976a`. Contacts S/E/W/N:236/240/241/246.

Review `review/manager/018-original-left-revised-right.png` and `018-adult-before-after-game-scale.png` under the artifact root. The latter uses actual55x110 frames and accepted adult references. Fresh exact output: `validation/018-regeneration-validation.txt`; prior logs: `validation/history/pre-018-regeneration/`. All seven fresh checks PASS, including686-file preservation of other18 identities.

The018 standing seed is historical and unchanged; current eight-pose adult source supersedes its shorts/young face. Original prompts are frozen provenance. Do not run `build-prompts.mjs` over them. `build-018-revision-review.mjs` restores new gallery links and labels the standing seed historical after rebuilding. Manager owns fresh browser validation and acceptance.
