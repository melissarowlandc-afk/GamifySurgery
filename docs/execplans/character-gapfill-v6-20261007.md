# Character gap-fill program (v6)

## Goal and authorization
Owner (2026-10-07, to the Claude manager thread): "use codex to design
characters to fill in all the gaps, make sure the style of these characters is
matching the style of all the previously generated characters. If they look
okay to you, you can implement them into the game." The owner delegates visual
acceptance to the manager for this program. Duplicates are acceptable when
necessary; recency history may stay patient-only.

## Targets
Pressure metric from `tools/character-mapping/future-roster20-v5/analysis/coverage-audit.md`:
modeled encounter share per design. Target <= 0.6% per design for every adult
patient band (young adults are already well below it).

| Band (pool age band) | Share | Designs now | Target | Add |
| --- | ---: | ---: | ---: | ---: |
| Female 30-44 (adult) | 17.60% | 21 | 30 | 9 |
| Male 30-44 (adult) | 14.34% | 15 | 24 | 9 |
| Female 45-64 (middle_aged) | 21.57% | 22 | 36 | 14 |
| Male 45-64 (middle_aged) | 18.19% | 19 | 31 | 12 |
| Female 65+ (older_adult) | 12.05% | 13 | 20 | 7 |
| Male 65+ (older_adult) | 11.85% | 12 | 20 | 8 |

Patients: 59. Staff rehire variety: +2 looks each for roles whose pool equals
their built-room ceiling with <= 3 looks (imaging technician, phlebotomist,
laboratory technician, surgeon, OR nurse, pharmacist, repair person): 14.
Total 73 identities, 8 poses each (stand/sit x S/E/W/N), in three batches.

| Batch | Contents |
| --- | --- |
| v6a | 20 patients: F45-64 x7, M45-64 x6, F30-44 x4, M30-44 x3 |
| v6b | 20 patients: F45-64 x7, M45-64 x6, M30-44 x4, F30-44 x3 (adjust after v6a) |
| v6c | 19 patients (remaining 30-44 and all 65+) + 14 staff |

## Process per batch
1. Sol worker: design rows, built-in image generation, packaging and
   validators mirroring `tools/character-mapping/future-roster20-v5/`, review
   gallery. No runtime edits.
2. Manager: visual review of every identity against existing stills (style,
   proportions, outline, palette, pose consistency, seated contacts); request
   regenerations as needed; record acceptance.
3. Sol worker: append-only runtime integration mirroring the v5 integration
   (`docs/execplans/future-roster20-v5-integration-20261007.md`).
4. Manager: full-suite review, HTTP delivery check.

Style rule: match the existing character stills exactly (same canvas
160x320, anchors, outline weight, shading, head/body proportions, palette
family, pixel finish). Diversity of skin tone, hair, build, clothing and
mobility aids is visual only; never tie appearance to diagnosis, and race or
ethnicity is never a selection variable.

## Progress
- 2026-10-07: program planned; v6a generation worker launched.
- 2026-10-07: v6a process step 1 complete in the assigned generation/packaging lane: 20 adult patients (`patient-gapfill-v6a.001`–`.020`), 160 transparent poses, exact assigned band allocation. Built-in image generation used 40 initial calls plus one sleeve-consistency correction each for 007 and 008; original receipts preserved. Worker roster/pose/alpha/anchor/hash, 80 authored-contact, 20 chair-proof, 397 existing same-band comparison and 45 within-batch comparison checks PASS (zero near-duplicate flags); runtime baseline remains 245 identities / 1,990 assets / 120 selectable patients. Gallery: `artifacts/character-statics/patient-gapfill-v6a/review/index.html`. Exact output: `artifacts/character-statics/patient-gapfill-v6a/validation/worker-validation.txt`. Handoff and stylistic uncertainties: `tools/character-mapping/patient-gapfill-v6a/HANDOFF.md`. Manager visual acceptance and browser gallery validation pending; no runtime integration or Git operations. Artifacts remain local only.
- 2026-10-07: v6a MANAGER VISUAL ACCEPTANCE (owner-delegated: "If they look okay to you, you can implement them into the game"). Manager reviewed the 20-identity overview and an old-vs-new comparison sheet (`artifacts/character-statics/patient-gapfill-v6a/review/manager/old-top-new-bottom.png`): style matches the recent v3/v4/v5 cohorts (compact proportions, dark stepped outline, smooth cel shading); ages read correctly; no near-duplicates. Note: the oldest gs018 patients use an earlier grainier style; the gap-fill follows the newer style. Manager ran `validate-gallery.mjs`: PASS (50 pages/viewports, 60 images). Approved for append-only runtime integration. v6b generation launched in parallel.


- 2026-10-08: v6b generation/packaging step complete: 20 adult patients (`patient-gapfill-v6b.001`-`.020`), 160 transparent standing/seated S/E/W/N poses, exact F45-64 x7 / M45-64 x6 / M30-44 x4 / F30-44 x3 allocation. Built-in image generation used 40 initial calls plus one 006 rear-cane hand correction; immutable originals and receipts preserved. Roster/pose/alpha/anchor/hash, 80 authored-contact, 20 chair-proof, 500 same-band and 5,300 all-catalog comparisons (245 original +20 v6a), all 190 within-batch pairs, 26 static gallery pages and 22 module syntax checks PASS; zero near-duplicate flags. Prior 245 entries/1,990 assets and accepted v6a art are preserved; authorized concurrent v6a integration is now at 265 runtime identities. Gallery: `artifacts/character-statics/patient-gapfill-v6b/review/index.html`; direct style sheet: `review/manager/v6a-top-v6b-bottom.png` under that artifact root. Exact output: `artifacts/character-statics/patient-gapfill-v6b/validation/worker-validation.txt`; per-identity handback, correction and style concerns: `tools/character-mapping/patient-gapfill-v6b/HANDOFF.md`. Manager visual/alpha acceptance and browser validation pending; no v6b runtime integration or Git commands. Local-only checkpoint; manager owns the GitHub backup reminder.

## v6a runtime integration — Sol worker handoff, 2026-10-07

Process step 3 is complete locally. All 20 manager-accepted adult patients and
160 exact accepted pose PNGs are registered and selectable. The owner-delegated
manager approval recorded in this plan's Progress is bound in
`tools/character-mapping/patient-gapfill-v6a/owner-approval.json` and copied
byte-exactly to `artifacts/character-statics/patient-gapfill-v6a/owner-runtime-approval.json`.
The original worker review ledger, pending/root labels, source controls, pose
manifests, coordinates, proofs, galleries and history remain frozen. The separate
approval and runtime receipts are the current status authority.

### Counts and preservation

| Runtime quantity | Before | After |
| --- | ---: | ---: |
| Registered identities | 245 | 265 |
| Cardinal poses | 1960 | 2120 |
| Clipboard poses | 30 | 30 |
| Assets / provenance records | 1990 | 2150 |
| Selectable adult patient designs | 120 | 140 |
| Staff designs | 77 | 77 |
| Selectable radiologists | 16 | 16 |

| Exact patient pool | Before | Added | After |
| --- | ---: | ---: | ---: |
| Female 18–29 | 9 | 0 | 9 |
| Male 18–29 | 9 | 0 | 9 |
| Female 30–44 | 21 | 4 | 25 |
| Male 30–44 | 15 | 3 | 18 |
| Female 45–64 | 22 | 7 | 29 |
| Male 45–64 | 19 | 6 | 25 |
| Female 65+ | 13 | 0 | 13 |
| Male 65+ | 12 | 0 | 12 |

The baseline was captured **before every runtime or test edit**, after binding
approval: 41 immutable file snapshots, original catalog entries and 3362
source/control/art hashes. Authority:
`artifacts/character-statics/patient-gapfill-v6a/runtime-integration-baseline/manifest.json`.
All prior 245 registry/catalog entries, 1990 asset bytes and anchors, provenance
records/input claims and compatible saved IDs are preserved. Selection source
`packages/game-domain/src/appearance.ts` is byte-identical to that baseline.

Stable IDs are `patient-gapfill-v6a.001`–`.020`, in the accepted roster order.
`.001`–`.007` are Female 45–64; `.008`–`.013` Male 45–64;
`.014`–`.017` Female 30–44; `.018`–`.020` Male 30–44.
They enter only their existing compatible `patientStillEligibleEntries` pools.
Tests exhaust all four affected pools without collisions, reach every new ID,
verify occupied/free/LRU reuse, check age-band boundaries and retain saved IDs.
There are no new selection weights, clinical rules or demographic fields.

### Files created or changed

Created under `tools/character-mapping/patient-gapfill-v6a/`:

- `bind-owner-approval.mjs`, `owner-approval.json` (exact delegated instruction,
  manager acceptance statement, source/pose/contact/alpha/gallery/review hashes).
- `runtime-contract.mjs`, `capture-integration-baseline.mjs`.
- `promote-runtime.mjs`, `validate-runtime-integration.mjs`,
  `validate-promotion-rerun.mjs` (v5 flow; strict preflight and overwrite/drift refusal).
- `vitest-player.config.mjs` (full player suite, native loading/threads;
  shared Vite configuration untouched).
- `audit-scoped-changes.py` (read-only filesystem diff; writes review artifacts only).

Changed existing implementation paths:

- `packages/game-domain/src/characterStillCatalog.ts` and `characterStillCatalog.test.ts`.
- `apps/player/src/art/characterStillRegistry.generated.json`,
  `characterStillRegistry.ts`, `characterStillRegistry.test.ts`.
- `tools/character-mapping/gs026-runtime-stills/provenance-manifest.json`:
  appended 160 records and one cohort input; count/fingerprint updates only.
  Every prior record/input claim is identical.

Changed existing v6a tool paths:

- `runtime-baseline.mjs`: permits only the authorized, baseline-proven expansion.
- `validate-roster.mjs`, `validate-placement-qa.mjs`: validate frozen review
  history and report current integration status separately.
- `validate-worker-review.mjs`: recomputes its historical comparisons against
  the immutable pre-edit catalog; `--check-only` supports a mutation-free preflight.
- `README.md`: documents the integration flow and superseding approval receipts.

Existing hard-coded count tests changed (complete list):

1. `packages/game-domain/src/characterStillCatalog.test.ts`: catalog/unique IDs
   245 → 265; patient count 120 → 140. Added two v6a pool/selection tests.
2. `apps/player/src/art/characterStillRegistry.test.ts`: identities/unique IDs
   245 → 265; cardinal poses 1960 → 2120; assets 1990 → 2150; seated poses
   980 → 1060. Added the cohort URL mapping and one exact approval/contact test.

Created 160 byte-exact public PNGs at
`apps/player/public/art/characters/patient-gapfill-v6a/patient-gapfill-v6a.NNN/{stand,sit}-{south,east,west,north}.png`.
All 160 URLs, SHA-256 values and numeric anchors map to the accepted packages.
Created baseline snapshots, approval/runtime receipts, this handoff and validation
reports/logs under `artifacts/character-statics/patient-gapfill-v6a/`.
Only this worker handoff was appended to the program plan; original text is preserved.

Actual filesystem diffs were inspected against pre-edit snapshots:
`validation/scoped-source-diff.patch` and `scoped-change-report.json`.
Registry diff: 3003 added / 3 removed lines (new entries and counts).
Provenance diff: 3535 added / 4 removed lines (new input/records, fingerprint/counts).
All 11 changed snapshot paths are in the lane. Of 378 pre-integration domain/player
source/test/data hashes, only the five intended catalog/registry source/test/data
paths changed; all 373 other hashes stayed exact.

### Exact validation output

Complete stdout/stderr and command/exit/hash records:
`artifacts/character-statics/patient-gapfill-v6a/validation/integration-validation-receipt.json`
and the adjacent UTF-8 `*.txt` logs. Node's existing experimental warnings are
formatted by PowerShell as `NativeCommandError` even for exit-0 commands.

`node tools/character-mapping/patient-gapfill-v6a/bind-owner-approval.mjs` — exit 0:

```text
{"status":"PASS","approvedIdentities":20,"approvedPoses":160,"approvedAuthoredContacts":80,"approvedBy":"GamifySurgery manager (Claude Code)","ownerDelegated":true,"sourceAndReviewControlsUnchanged":true}
```

`node tools/character-mapping/patient-gapfill-v6a/capture-integration-baseline.mjs`
before runtime edits — exit 0 (later logged repeat reads that immutable capture):

```text
{"status":"PASS","identities":245,"assets":1990,"patients":120,"immutableSnapshots":41,"approvedInputHashes":3362}
```

`node tools/character-mapping/patient-gapfill-v6a/promote-runtime.mjs` — exit 0;
full strict preflight output in `validation/promotion.txt`, final line:

```text
{"status":"PASS","integrated":20,"poses":160,"runtime":{"identities":265,"cardinalPoses":2120,"clipboardPoses":30,"assets":2150},"patients":140,"ownerDelegatedManagerApproval":true,"published":false}
```

`node tools/character-mapping/patient-gapfill-v6a/validate-roster.mjs --require-complete`
— exit 0. The original ledger names the Sol generation worker; manager acceptance
is proven by the separate exact approval receipt, rather than fabricated root
labels. Promotion additionally executes the complete placement and worker-review
checks before its first runtime write.

```text
{"status":"PASS","requireComplete":true,"requireRootReview":false,"identities":20,"poses":160,"reportedIssues":0,"immutableReviewSnapshots":41,"rosterContract":{"identities":20,"posesPerIdentity":8,"totalPoses":160,"categoryCounts":{"staff":0,"patient":20},"staffRoleCounts":{},"plannedStaffRoleCounts":{},"demographicCounts":{"Female":{"young_adult":0,"adult":4,"middle_aged":7,"older_adult":0},"Male":{"young_adult":0,"adult":3,"middle_aged":6,"older_adult":0}}},"reviewStatus":"candidate-review-root-checks-pending","runtimeBaseline":"245 identities/1990 assets and120 selectable patients preserved","runtimeReady":true,"ownerApproval":"approved","reviewStatusPolicy":"Original art-review labels are frozen evidence; the separate owner approval and runtime-integration receipts supersede them."}
```

`node tools/character-mapping/patient-gapfill-v6a/validate-placement-qa.mjs --require-complete`
— exit 0:

```text
{"status":"PASS","diagnostics":20,"requireRootReview":false,"runtimeReady":true,"ownerApproval":"approved","frozenChairEvidenceUnchanged":true,"schemaVersion":"patient-gapfill-v6a-placement-qa/v2"}
```

`node tools/character-mapping/patient-gapfill-v6a/validate-worker-review.mjs` — exit 0:

```text
{"status":"PASS","identities":20,"poses":160,"authoredSeatedContacts":80,"reviewedChairProofs":20,"existingSameBandIdentities":77,"existingComparisons":397,"withinBatchPairs":45,"nearDuplicateFlags":0,"staticGalleryPages":25,"mainGalleryImages":60,"managerVisualAcceptance":"approved","browserValidation":"manager-accepted-gallery-run-recorded-in-program-plan"}
```

`node tools/character-mapping/patient-gapfill-v6a/runtime-baseline.mjs` — exit 0:

```text
{"status":"PASS","preservedIdentities":245,"preservedAssets":1990,"priorSelectablePatients":120,"protectedFiles":10,"runtimeReady":true,"ownerApproval":"approved"}
```

`node tools/character-mapping/patient-gapfill-v6a/validate-runtime-integration.mjs` — exit 0:

```text
{"status":"PASS","preservedIdentities":245,"preservedAssets":1990,"preservedSourceControlArtHashes":3362,"appendedIdentities":20,"appendedAssets":160,"totalIdentities":265,"totalAssets":2150,"adultPatientDesigns":140,"patientPools":{"Female.young_adult":9,"Female.adult":25,"Female.middle_aged":29,"Female.older_adult":13,"Male.young_adult":9,"Male.adult":18,"Male.middle_aged":25,"Male.older_adult":12},"provenanceRecords":2150,"exactApprovedRuntimeURLs":160,"frozenReviewMetadataUnchanged":true,"ownerDelegatedManagerApproval":true,"selectionSourceByteIdentical":true,"published":false}
```

`node tools/character-mapping/patient-gapfill-v6a/validate-promotion-rerun.mjs` — exit 0;
reruns the entire promoter/preflight, final line:

```text
{"status":"PASS","hashedFilesUnchanged":5589,"runtimeAssetsUnchanged":2150,"registryUnchanged":true,"catalogUnchanged":true,"provenanceUnchanged":true,"integrationReceiptUnchanged":true,"approvalAndReviewEvidenceUnchanged":true}
```

`npm.cmd run typecheck` — exit 0, before and after integration; exact complete
output is in `validation/pre-integration-typecheck.txt` and `validation/typecheck.txt`.
All workspace TypeScript checks passed, including player and game-domain.
Native syntax parsing of all 24 v6a `.mjs` modules — exit 0:

```text
{"status":"PASS","syntaxParsedModules":24}
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --configLoader=native`
— exit 0, **FULL suite**, `validation/domain-full.txt`:

```text
 Test Files  96 passed (96)
      Tests  3159 passed (3159)
   Start at  23:21:06
   Duration  454.57s (transform 3.23s, setup 0ms, import 44.83s, tests 399.98s, environment 6ms)
```

Pre-integration full domain — exit 0 (`validation/pre-integration-domain-full.txt`):

```text
 Test Files  96 passed (96)
      Tests  3157 passed (3157)
   Start at  23:11:30
   Duration  451.28s (transform 3.81s, setup 0ms, import 43.59s, tests 398.37s, environment 6ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --configLoader=native --config ../../tools/character-mapping/patient-gapfill-v6a/vitest-player.config.mjs`
— exit 1, **FULL suite**, `validation/player-full.txt`:

```text
 Test Files  1 failed | 110 passed (111)
      Tests  1 failed | 845 passed (846)
   Start at  23:21:06
   Duration  51.08s (transform 3.53s, setup 0ms, import 26.71s, tests 12.85s, environment 8ms)
```

### Attributed failure and manager follow-up

The player failure predates every runtime edit. The same full command on the
245-identity baseline failed identically (`validation/pre-integration-player-full.txt`):

```text
 Test Files  1 failed | 110 passed (111)
      Tests  1 failed | 844 passed (845)
   Start at  23:11:30
   Duration  53.87s (transform 4.32s, setup 0ms, import 28.22s, tests 14.06s, environment 8ms)
```

Both runs fail at `apps/player/src/session/surgeryCenterServicePreviews.test.ts:85`,
test `ignores the retired concealment flag and preserves the scheduled external service after an answer`:

```text
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
```

The failure test remains SHA-256
`aedd1e37d7507eccb05c7aa6292d7f8a539b538e725dec5387d4084907dbf849`;
`apps/player/src/session/viewModels.ts` remains
`c4ef918561e5d227c00e05712c919525e74c7fbfe7e3f657e48df04fdb055f5f`.
All other domain/player source/test/data files outside the five intended catalog/
registry paths also remain byte-identical to the recorded pre-integration source
state. The player assertion and UI/session code were left for their owning lane.

`node tools/character-mapping/patient-gapfill-v6a/validate-gallery.mjs` — exit 1
before and after integration (`validation/pre-integration-gallery.txt`, `gallery.txt`):

```text
browserType.launch: spawn EPERM
    at C:\Users\rowla\Projects\GamifySurgery\tools\character-mapping\patient-gapfill-v6a\validate-gallery.mjs:24:32
```

The browser never launched. This is the worker sandbox limitation, and no fresh
worker browser PASS is claimed. The manager's accepted gallery run (50 pages/
viewports, 60 images) remains recorded in Progress and the original
`validation/gallery-browser-results.json`; gallery script, HTML, art and links
are unchanged. The manager should review the actual scoped diff, rerun acceptance
in its environment and perform canonical HTTP delivery checks. There is no open
v6a design decision or new integration failure.

Sol executed directly; no agents were dispatched. No installs, art regeneration,
clinical edits, reducer/UI edits, external messages, commits, pushes, deployment
or publication. One inadvertent read-only `git status` was run during intake;
no subsequent Git commands or Git mutations occurred. All subsequent review used
filesystem snapshots/diffs. Concurrent v6b and GS-038 lanes were preserved.

The owner pathway remains `START_GAME.cmd` → exactly `http://127.0.0.1:4173` in
the same persistent profile. No server, owner browser, origin or campaign storage
was accessed or changed. This is **LOCAL ONLY**, without a new GitHub backup.
Manager owns final acceptance/common handoff and the checkpoint reminder to say
**"push to GitHub"**; this worker has no Git authorization. Worker writes are complete.
- 2026-10-08: v6a runtime integration ACCEPTED by manager: catalog diff is append-only (cohort union + 20 rows); 160 PNGs served byte-exact from http://127.0.0.1:4173; worker full domain 3159 PASS; manager full-suite rerun in progress.
- 2026-10-08: v6b MANAGER VISUAL ACCEPTANCE (owner-delegated). Style matches v6a (`artifacts/character-statics/patient-gapfill-v6b/review/manager/v6a-top-v6b-bottom.png`); ages read correctly; gallery validator PASS (52 pages/viewports). Notes for v6c/v6d: glasses are over-represented (~half of v6b) and gray-curly-hair-plus-glasses repeats across 003/007/017; keep glasses <= 30% and avoid that combination. Launched v6b integration, v6c (19 patients) and v6d (14 staff) generation.
- 2026-10-08: manager full-suite rerun after v6a integration: clinical-content 585/585 PASS; typecheck exit 0; game-domain 3156/3159 with 3 failures (diagnostic-orders x2 serial reads, patient-supply inventory) that PASS 17/17 on isolated rerun; attributed to concurrent edits/load from other active workers during the 8-minute run. v6a integration fully accepted.

- 2026-10-08: v6c generation/packaging worker intake: built-in image generation confirmed available; isolated lane `tools/character-mapping/patient-gapfill-v6c/` and `artifacts/character-statics/patient-gapfill-v6c/`. Planned 19 patients /152 poses: F65+ x7, M65+ x8, F30-44 x2, M30-44 x2; four glasses designs (21.1%), straight hair on all glasses designs, one visual-only cane and two hearing aids. Accepted v6a/v6b remain the exact geometry/style anchors. Preservation pins 245 original entries/1990 assets and 320 accepted v6a/v6b poses/80 native inputs; all-catalog checks cover all 285 designs. Concurrent v6b integration and v6d staff lanes are read-only to this worker; no runtime integration, installs, web, or Git mutations. One inadvertent read-only Git status during intake was acknowledged; no further Git commands.


## v6b runtime integration - Sol worker handoff, 2026-10-08

Process step 3 is complete locally. All 20 manager-accepted adult patients and
160 exact accepted pose PNGs are registered and selectable. The owner delegated
visual acceptance to the manager ("If they look okay to you, you can implement
them into the game"). The **2026-10-08 v6b MANAGER VISUAL ACCEPTANCE** in Progress
is the approval: `tools/character-mapping/patient-gapfill-v6b/owner-approval.json`
binds the exact owner instruction and manager acceptance statement, the accepted
source/pose/contact/alpha/gallery/review hashes, and the allocation. It is copied
byte-exactly to `artifacts/character-statics/patient-gapfill-v6b/owner-runtime-approval.json`.
Historical worker/root pending labels, review ledgers, receipts, art, authored
contacts and proofs are frozen; approval and runtime receipts supersede those
labels without rewriting history. This handoff is worker validation, awaiting
the manager's integration review and canonical HTTP delivery check.

### Counts and preservation

| Runtime quantity | Before | After |
| --- | ---: | ---: |
| Registered identities | 265 | 285 |
| Cardinal poses | 2120 | 2280 |
| Clipboard poses | 30 | 30 |
| Assets / provenance records | 2150 | 2310 |
| Selectable adult patient designs | 140 | 160 |
| Staff designs | 77 | 77 |
| Selectable radiologists | 16 | 16 |

| Exact patient pool | Before | Added | After |
| --- | ---: | ---: | ---: |
| Female 18-29 | 9 | 0 | 9 |
| Male 18-29 | 9 | 0 | 9 |
| Female 30-44 | 25 | 3 | 28 |
| Male 30-44 | 18 | 4 | 22 |
| Female 45-64 | 29 | 7 | 36 |
| Male 45-64 | 25 | 6 | 31 |
| Female 65+ | 13 | 0 | 13 |
| Male 65+ | 12 | 0 | 12 |

The live integration baseline was captured **before every runtime/test edit** at
2026-10-08T04:08:30.563Z: 42 immutable file snapshots, original catalog entries,
3588 source/control/art hashes and all 2150 prior public asset hashes/sizes.
Authority: `artifacts/character-statics/patient-gapfill-v6b/runtime-integration-baseline/manifest.json`.
This is the 265-identity live state, including integrated v6a; the original
245-identity generation baseline plus pinned v6a sources/poses remains exact.
All prior 265 registry/catalog entries, 2150 image bytes and anchors, every
prior provenance record/input claim and compatible saved IDs are preserved.
`packages/game-domain/src/appearance.ts` is byte-identical to intake.

New stable IDs are `patient-gapfill-v6b.001`-`.020` in the accepted roster order:
`.001`-`.007` Female 45-64, `.008`-`.013` Male 45-64, `.014`-`.017` Male 30-44,
`.018`-`.020` Female 30-44. They enter only their exact existing
`patientStillEligibleEntries` sex/age-band pools. Tests cover both age-band
boundaries, pool exhaustion without collisions, every new ID, occupied/free/LRU
reuse and saved-ID retention. No selection code, weights or clinical rules change.

### Files created or changed

New integration tools under `tools/character-mapping/patient-gapfill-v6b/`:

- `bind-owner-approval.mjs`, `owner-approval.json`.
- `runtime-contract.mjs`, `capture-integration-baseline.mjs`.
- `promote-runtime.mjs`, `validate-runtime-integration.mjs`,
  `validate-promotion-rerun.mjs` (proven v5/v6a flow; strict preflight and overwrite/drift refusal).
- `vitest-player.config.mjs` (full native player suite with threads; shared Vite config untouched).
- `audit-scoped-changes.py`, `run-validation.py`, `update-runtime-tests.py`
  (filesystem review, exact output/exit/hash capture, guarded count/test additions).

Existing implementation paths changed (complete list):

- `packages/game-domain/src/characterStillCatalog.ts` and `characterStillCatalog.test.ts`.
- `apps/player/src/art/characterStillRegistry.generated.json`,
  `characterStillRegistry.ts`, `characterStillRegistry.test.ts`.
- `tools/character-mapping/gs026-runtime-stills/provenance-manifest.json`:
  one new cohort input and 160 records appended; count/registry fingerprint updates only.

Existing v6b tool paths changed (complete list):

- `runtime-baseline.mjs`: admits only the authorized, integration-baseline-proven v6b append.
- `validate-roster.mjs`, `validate-placement-qa.mjs`: current runtime/approval status is separate from frozen review metadata.
- `validate-worker-review.mjs`, `validate-all-catalog-comparison.mjs`: preserve the exact historical comparisons, report the bound manager approval, and support mutation-free `--check-only` preflight.
- `README.md`: appends the manager-authorized integration/validation flow.

Hard-coded catalog/pool size tests changed (complete list):

1. `packages/game-domain/src/characterStillCatalog.test.ts`: catalog/unique IDs
   265 -> 285; patients 140 -> 160; v6a's full-pool exhaustion totals increase
   Female adult 25 -> 28, Male adult 18 -> 22, Female middle-aged 29 -> 36,
   Male middle-aged 25 -> 31. The v6a addition counts remain unchanged. Added
   two v6b pool/boundary/occupancy/LRU/saved-ID tests.
2. `apps/player/src/art/characterStillRegistry.test.ts`: identities/unique IDs
   265 -> 285, cardinal poses 2120 -> 2280, assets 2150 -> 2310, seated poses
   1060 -> 1140. Added cohort URL mapping and one exact approved hash/contact test.

Created 160 byte-exact PNGs under
`apps/player/public/art/characters/patient-gapfill-v6b/patient-gapfill-v6b.NNN/{stand,sit}-{south,east,west,north}.png`.
Every runtime URL, SHA-256 and numeric anchor maps to the exact accepted package.
Created baseline snapshots, owner/runtime approval and integration receipts,
validation logs/reports and this handoff evidence under the v6b artifact root.
Only this handoff was appended to the program plan. The manager owns the common
`CURRENT_THREAD_HANDOFF.md`; this worker did not edit outside its lane.

Actual source diffs were inspected against the pre-edit filesystem snapshots:
`validation/scoped-source-diff.patch` and `scoped-change-report.json`.
All 12 changed snapshot paths are in the lane. Registry: 3003 added / 3 removed
lines; provenance: 3535 added / 4 removed (new entries/input/records and counts/
fingerprint only). Of 720 intake domain/player/balance/clinical-content source
hashes, only the five intended catalog/registry source/test/data files changed;
all 715 other existing hashes remain exact. GS-038 reducer/UI and v6c/v6d lanes
were preserved. Source/control/art hashes remain exact after the full suites.

### Exact validation commands and output

Complete stdout/stderr, commands, timestamps, exit codes, hashes, source inventory,
changed paths and open limitations:
`artifacts/character-statics/patient-gapfill-v6b/validation/integration-validation-receipt.json`.
Adjacent UTF-8 `*.txt` files contain unabridged output. Node's existing
`stripTypeScriptTypes` / VM experimental warnings are preserved in those logs.

`node tools/character-mapping/patient-gapfill-v6b/bind-owner-approval.mjs` - exit 0:

```text
{"status":"PASS","approvedIdentities":20,"approvedPoses":160,"approvedAuthoredContacts":80,"approvedBy":"GamifySurgery manager (Claude Code)","ownerDelegated":true,"sourceAndReviewControlsUnchanged":true}
```

`node tools/character-mapping/patient-gapfill-v6b/capture-integration-baseline.mjs`
**before runtime edits** - exit 0:

```text
{"status":"PASS","identities":265,"assets":2150,"patients":140,"immutableSnapshots":42,"approvedInputHashes":3588}
```

`node tools/character-mapping/patient-gapfill-v6b/promote-runtime.mjs` - exit 0:

```text
{"status":"PASS","integrated":20,"poses":160,"runtime":{"identities":285,"cardinalPoses":2280,"clipboardPoses":30,"assets":2310},"patients":160,"ownerDelegatedManagerApproval":true,"published":false}
```

Full preflight executes `validate-roster.mjs`, `validate-placement-qa.mjs`,
`validate-worker-review.mjs` and `validate-all-catalog-comparison.mjs` in-process
with `--require-complete --check-only`, before the first runtime write and again
on promotion rerun. No fabricated root-review ledger is used; approval is the
exact owner-delegated manager receipt. All four validators PASS. Their exact
post-integration outputs, from `promotion-rerun.txt`, are:

```text
{"status":"PASS","requireComplete":true,"requireRootReview":false,"identities":20,"poses":160,"reportedIssues":0,"immutableReviewSnapshots":40,"rosterContract":{"identities":20,"posesPerIdentity":8,"totalPoses":160,"categoryCounts":{"staff":0,"patient":20},"staffRoleCounts":{},"plannedStaffRoleCounts":{},"demographicCounts":{"Female":{"young_adult":0,"adult":3,"middle_aged":7,"older_adult":0},"Male":{"young_adult":0,"adult":4,"middle_aged":6,"older_adult":0}}},"reviewStatus":"candidate-review-root-checks-pending","runtimeBaseline":"245 identities/1990 assets and120 selectable patients preserved","runtimeReady":true,"ownerApproval":"approved","reviewStatusPolicy":"Original art-review labels are frozen evidence; the separate owner approval and runtime-integration receipts supersede them."}
{"status":"PASS","diagnostics":20,"requireRootReview":false,"runtimeReady":true,"ownerApproval":"approved","frozenChairEvidenceUnchanged":true,"schemaVersion":"patient-gapfill-v6b-placement-qa/v2"}
{"status":"PASS","identities":20,"poses":160,"authoredSeatedContacts":80,"reviewedChairProofs":20,"existingSameBandIdentities":97,"existingComparisons":500,"withinBatchPairs":45,"nearDuplicateFlags":0,"staticGalleryPages":26,"mainGalleryImages":60,"managerVisualAcceptance":"approved","browserValidation":"manager-accepted-gallery-run-recorded-in-program-plan"}
{"status":"PASS","originalCatalogIdentities":245,"acceptedV6aIdentities":20,"allCatalogIdentities":265,"independentlyRecomputedCatalogComparisons":5300,"withinBatchPairs":190,"nearDuplicateFlags":0,"minimumCatalogRmse":45.55298209843013,"minimumWithinBatchRmse":53.2102506088514,"managerVisualAcceptance":"approved","browserValidation":"manager-accepted-gallery-run-recorded-in-program-plan"}
```

`node tools/character-mapping/patient-gapfill-v6b/runtime-baseline.mjs` - exit 0:

```text
{"status":"PASS","preservedIdentities":265,"preservedAssets":2150,"priorSelectablePatients":140,"generationPinnedIdentities":245,"generationPinnedAssets":1990,"protectedFiles":7,"pinnedV6aPoses":160,"pinnedV6aNativeSources":40,"currentRuntimeIdentities":285,"concurrentV6aAppendAllowed":true,"runtimeReady":true,"ownerApproval":"approved"}
```

`node tools/character-mapping/patient-gapfill-v6b/validate-runtime-integration.mjs`
- exit 0 before and after the full suites (`runtime-integration.txt`,
`final-runtime-integration.txt`):

```text
{"status":"PASS","preservedIdentities":265,"preservedAssets":2150,"preservedSourceControlArtHashes":3588,"appendedIdentities":20,"appendedAssets":160,"totalIdentities":285,"totalAssets":2310,"adultPatientDesigns":160,"patientPools":{"Female.young_adult":9,"Female.adult":28,"Female.middle_aged":36,"Female.older_adult":13,"Male.young_adult":9,"Male.adult":22,"Male.middle_aged":31,"Male.older_adult":12},"provenanceRecords":2310,"exactApprovedRuntimeURLs":160,"frozenReviewMetadataUnchanged":true,"ownerDelegatedManagerApproval":true,"selectionSourceByteIdentical":true,"published":false}
```

`node tools/character-mapping/patient-gapfill-v6b/validate-promotion-rerun.mjs`
- exit 0. The entire promoter and strict preflight rerun; all 5983 hashed
inputs/tools/snapshots/runtime files, including all 2310 assets, stay exact:

```text
{"status":"PASS","hashedFilesUnchanged":5983,"runtimeAssetsUnchanged":2310,"registryUnchanged":true,"catalogUnchanged":true,"provenanceUnchanged":true,"integrationReceiptUnchanged":true,"approvalAndReviewEvidenceUnchanged":true}
```

`node --experimental-vm-modules tools/character-mapping/patient-gapfill-v6b/check-syntax.mjs`
- exit 0:

```text
{"status":"PASS","syntaxParsedModules":29}
```

`python tools/character-mapping/patient-gapfill-v6b/audit-scoped-changes.py`
- exit 0 after all suites:

```text
{"status": "PASS", "changedSnapshotPaths": 12, "unchangedSourceControlArtHashes": 3588, "suiteSourceDrift": 5}
```

`npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --configLoader=native`
- exit 0 (`domain-full.txt`). Exact full-suite output:

```text

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1 --configLoader=native


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  96 passed (96)
      Tests  3161 passed (3161)
   Start at  00:21:53
   Duration  439.14s (transform 3.29s, setup 0ms, import 41.62s, tests 388.46s, environment 6ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../tools/character-mapping/patient-gapfill-v6b/vitest-player.config.mjs --configLoader=native`
- exit 1 (`player-full.txt`). All integration/rendering tests pass; one proven
pre-existing assertion remains. Exact summary:

```text
 Test Files  1 failed | 110 passed (111)
      Tests  1 failed | 846 passed (847)
   Start at  00:21:53
   Duration  48.17s (transform 3.67s, setup 0ms, import 25.18s, tests 12.26s, environment 7ms)
```

`npm.cmd run typecheck` - exit 0 (`typecheck.txt`). Exact output:

```text

> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

### Failure attribution and manager review

The player failure is
`apps/player/src/session/surgeryCenterServicePreviews.test.ts:85:52`,
"ignores the retired concealment flag and preserves the scheduled external
service after an answer". It expects the route name in `pendingLabel`; the current
view model provides stage-by-stage waiting copy. The same named assertion failed
**before any runtime/test edit** (845/846 passed) and after integration (846/847
passed), with exactly identical Expected/Received strings. The test,
`viewModels.ts`, `reducer.ts` and `appearance.ts` are byte-identical to intake.
Evidence: `validation/pre-existing-player-failure-attribution.json`,
`pre-integration-player-full.txt`, `player-full.txt` and the intake/final source
hash reports. No change was made outside the bounded art lane. Pre-integration
full domain: 96 files /3159 tests PASS; after: 96 files /3161 tests PASS.
Typecheck passed both before and after. The only additional tests are the two
domain and one player integration assertions listed above.

`node tools/character-mapping/patient-gapfill-v6b/validate-gallery.mjs` - exit 1
**before runtime edits**, `validation/pre-integration-gallery.txt`:

```text
browserType.launch: spawn EPERM
    at C:\Users\rowla\Projects\GamifySurgery\tools\character-mapping\patient-gapfill-v6b\validate-gallery.mjs:24:32
```

No browser launched and no fresh worker browser PASS is claimed. This is the
known worker sandbox limitation. The manager's accepted 52-page/viewports run
is in the bound October 8 acceptance statement; gallery script, HTML, images,
links and all art evidence are unchanged. Manager should inspect the actual
diff, rerun acceptance in its environment, and check byte-exact canonical HTTP
delivery. There is no open v6b design decision or new integration failure.

One initial player command used a repository-relative config path inside the
player workspace and failed before tests started. The corrected `../../tools/`
command above ran all 111 files; initial stderr is retained in
`pre-integration-player-config-path-startup.txt`. This was a worker invocation
error, not a product failure.

Sol executed directly; no subagents were dispatched. No Git mutations, installs,
art edits/regeneration, clinical edits, reducer/UI edits, external messages,
deployment or publication. One inadvertent read-only `git status` was run at
intake and acknowledged; no subsequent Git commands occurred. All further
review used filesystem snapshots and hashes. Concurrent user/Claude work is
preserved. This section was appended without rewriting prior plan bytes.

The owner pathway stays `START_GAME.cmd` - exactly `http://127.0.0.1:4173` in
the same persistent profile. No server, owner browser, origin or campaign
storage was changed. This milestone is **LOCAL ONLY**, without a new GitHub
backup. Manager owns final acceptance/common handoff and the checkpoint reminder
to say **"push to GitHub"**; this worker has no Git authorization. Worker writes
are complete.


- 2026-10-08: v6c generation/packaging step complete: 19 adult patients (`patient-gapfill-v6c.001`-`.019`), 152 transparent standing/seated S/E/W/N poses, exact F65+ x7 / M65+ x8 / F30-44 x2 / M30-44 x2 allocation. Built-in image generation used 38 initial calls plus one 017 east-profile hair-side correction; native originals and receipts preserved. Same v6a/v6b geometry/style anchor; 4/19 glasses (21.1%), zero gray-curls-plus-glasses combinations, one visual-only cane and two hearing aids. Independent roster/pose/alpha/anchor/hash, 76 authored-contact, 19 chair-proof, 287 same-band and 5,415 all-catalog comparisons (245 original +20 v6a +20 v6b), all 171 within-batch pairs, 25 static gallery pages and 22 module syntax checks PASS; zero near-duplicate flags. Original 245 entries/1,990 assets, seven pipeline/chair sources, and accepted v6a/v6b 320 poses/80 native sources preserved while authorized concurrent v6b append-only integration reached 285 runtime identities. Gallery: `artifacts/character-statics/patient-gapfill-v6c/review/index.html`; overview: `review/owner-overview-stand-south-sit-east.png`; direct style sheet: `review/manager/v6b-top-v6c-bottom.png` under that artifact root. Exact output: `artifacts/character-statics/patient-gapfill-v6c/validation/worker-validation.txt`; per-identity table, regeneration, realized hairstyle differences and style concerns: `tools/character-mapping/patient-gapfill-v6c/HANDOFF.md`. Manager visual/contact/alpha acceptance and browser gallery validation pending; browser validator intentionally left to manager. No runtime integration, subagents, installs, web, external messages or Git mutations; one acknowledged intake read-only Git status and resolved packaging-order issues are documented in `validation/workflow-notes.md`. Worker writes limited to the two new v6c lanes and its own plan notes; v6b/v6d/runtime files untouched. LOCAL ONLY; manager owns common handoff and GitHub checkpoint reminder. Worker generation/packaging complete.


## Progress continuation - v6d generation/packaging worker handoff

- 2026-10-08: Manager-assigned staff-only v6d generation/packaging complete: `staff-gapfill-v6d.001`-.014, two consecutive identities each for imaging technician, phlebotomist, laboratory technician, surgeon, OR nurse, pharmacist and repair person. Built-in imagegen confirmed at Step 0 and used for all art: 28 initial calls plus one 005 straight-torso native correction; immutable original and exact receipts preserved. 112 transparent 160x320 standing/seated S/E/W/N poses, axis X80/floor Y287/standing-south height246, unchanged v5/GS026 extraction. All 16 eligible existing role looks inspected before generation; all 112 poses, 56 worker-authored contacts, 14 authentic south-chair proofs, seven existing/new role sheets, accepted v6a/v6b style boards, all 285 catalog looks and 28 nearest-comparison boards visually reviewed. Six final worker CLI checks PASS, exit codes [0,0,0,0,0,0]: roster/alpha/anchors/hash/provenance (29 frozen review snapshots), placement, visual/static gallery (22 pages/42 main images), independently recomputed 3,990 all-catalog +32 same-role comparisons and 91 within-batch +7 same-role pairs (zero near-duplicate flags), preservation, and 23-module syntax. Glasses 003/012 only (14.3%). Style notes: flatter final 005 cel shading, brighter blue 008 scrubs, 003 braid/glasses motif checked against perioperative staff; minor realization differences are in the handoff. Native alpha-1 noise retained; no alpha >=13 clipping or pixel cleanup. Gallery: `artifacts/character-statics/staff-gapfill-v6d/review/index.html`; per-role sheets: `comparison/roles.html` under that root. Exact output: `artifacts/character-statics/staff-gapfill-v6d/validation/worker-validation.txt`; per-identity table, regeneration and concerns: `tools/character-mapping/staff-gapfill-v6d/HANDOFF.md`. Prior 265 identities/2,150 assets/140 selectable patients and accepted v6b art preserved; concurrent v6b integration now285 permitted. No v6d runtime registration or writes outside the assigned two folders and this append. Sol direct, no subagents/Git/web/installs/external messages. Manager acceptance and browser gallery validator (prepared44 page/viewports) pending; `runtimeReady:false`. No game pathway/profile/storage change. LOCAL ONLY; manager owns common handoff, acceptance and the reminder to say **"push to GitHub"**.
- 2026-10-08: v6b runtime integration ACCEPTED by manager (append-only catalog diff, byte-exact HTTP delivery; worker full domain 3161/3161). v6c and v6d manager review: styles match; gallery validators PASS (v6c 50, v6d 44 pages/viewports); v6d uniforms match each role's established look (`artifacts/character-statics/staff-gapfill-v6d/review/manager-roles-existing-left-new-right.png`). Requested: v6c.018 regenerate (reads as a teenager: shorts and very young face; needs long trousers and adult features); v6d.008 recolor scrubs/cap to the existing surgeon navy. Accept both batches after these fixes.


- 2026-10-08: v6d.008 manager-requested navy palette correction complete. Manager accepted the other thirteen identities; surgeon 008 scrubs/cap now match the measured existing level3-roster-v2.006 standing-south uniform median RGB 36/63/118 (#243f76), replacing original 31/75/162. One deterministic derived RGB operation across all eight standing/seated S/E/W/N poses, zero imagegen calls/regenerations. Raw RGBA audit independently remeasures the reference, replays every selected RGB pixel and verifies all alpha/unselected RGB/protected ink/silhouette boundary differences and relative-shading violations are zero (73,821 changed RGB pixels); canvas, anchors, bounds, normalization transforms and S235/E248/W248/N249 contacts unchanged. All 104 other accepted pose PNGs and 56 native source/provenance files are byte-identical; original blue 008 native source remains immutable. Original eight packaged poses, receipts, prior validation/manager browser evidence and prior tool docs are retained under artifacts/character-statics/staff-gapfill-v6d/corrections/008-navy-palette-v1/history/. Rebuilt gallery, overview, seven per-role sheets, style/full-pose/nearest boards, contact overlays and authentic chair proofs; inspected the all-eight original/existing/corrected proof, current surgeon sheet, 008 poses/contacts/chair, overview and nearest boards. Seven final worker CLI validators PASS, exit codes [0,0,0,0,0,0,0]: roster/source replay/alpha/anchors, placement, worker/static gallery review, independently recomputed 3,990 catalog +32 role comparisons/91 within-batch +7 role pairs (zero near-duplicate flags), independent raw palette audit, runtime preservation and 28-module syntax. Current correction handoff: tools/character-mapping/staff-gapfill-v6d/NAVY_CORRECTION_HANDOFF.md; exact outputs and full identity table: HANDOFF.md in that tool lane; logs: artifacts/character-statics/staff-gapfill-v6d/validation/worker-validation.txt. Current proof: corrections/008-navy-palette-v1/before-reference-after.png under that artifact root; rebuilt role sheet: comparison/surgeon-old-and-new.png. Prior manager 44-page/viewports PASS and manager-authored combined role image are preserved historical original-blue evidence; fresh browser validation and verification of the corrected 008 remain manager-owned (validation/browser-revalidation-needed.json). Writes limited to the two v6d lanes and this append, preserving previous plan bytes and concurrent v6b/v6c/runtime work. Sol direct; no subagents, Git, web, installs, external messages, clinical edits or runtime integration. Current runtime285/prior265 identities and2,150 assets preserved; runtimeReady:false. No game pathway/profile/storage changes. LOCAL ONLY; manager owns common handoff, final acceptance/integration and the reminder to say "push to GitHub".


## Progress continuation - v6c.018 adult regeneration worker handoff

- 2026-10-08: Manager-requested v6c.018 adult regeneration complete, stable ID patient-gapfill-v6c.018 / Male / age33. Built-in image generation used two calls: adult face/build, short black side part, visible jaw/upper-lip stubble and full-length rust chinos; then native row-spacing repair after the unchanged extractor rejected the first adult layout. Original teen-reading source/seed/receipts/package/chair and rejected adult intermediate are preserved in history. Final source SHA-256 4bf3c14e8b4b9965510cea919be7f229a3dc3af5b7a556d4c68cf511717d976a. All eight poses retain accepted v6a/v6b style and exact160x320 / axisX80 / floorY287 / standing-south246 geometry; newly authored S236/E240/W241/N246 contacts and authentic55x110 south-chair proof PASS. Rebuilt gallery, overview, v6b-vs-v6c sheet, contact/nearest/all-pose evidence and original-left/revised-right plus game-scale adult-reference sheets; worker inspected all eight revised poses and reports adult reading at game scale, pending manager visual judgment. Other18 accepted identities,144 pose PNGs and686 pinned source/package/contact/chair files remain byte-identical. Seven final worker commands PASS, exit codes [0,0,0,0,0,0,0]: batch roster/source/alpha/anchor/hash, placement, visual/static-gallery review (25 pages/57 main images), independently recomputed5,415 all-catalog comparisons against285 prior looks and171 within-batch pairs (zero near-duplicate flags), runtime preservation, revision preservation and25-module syntax. Batch remains19 identities/152 poses/76 contacts/19 chair proofs/4 glasses. Handoff and full per-identity table: tools/character-mapping/patient-gapfill-v6c/HANDOFF.md; exact output: artifacts/character-statics/patient-gapfill-v6c/validation/worker-validation.txt; new game-scale proof: review/manager/018-adult-before-after-game-scale.png under that artifact root. Manager's prior50-page/viewports browser PASS is preserved historical original-018 evidence; validation/browser-revalidation-needed.json explicitly requires a fresh manager gallery run. Revised018 visual acceptance and fresh browser validation remain manager-owned; runtimeReady:false. Writes confined to the two v6c lanes and this append, preserving prior plan bytes and concurrent v6b/v6d/runtime work. Current runtime285 untouched; no Git commands, subagents, web, installs, external messages, clinical changes or runtime integration in this revision. Owner game pathway/profile/save storage unchanged. LOCAL ONLY; manager owns common handoff, final acceptance/integration and GitHub checkpoint reminder.
- 2026-10-08: v6c (.018 regenerated) and v6d (.008 navy correction) MANAGER ACCEPTED; gallery validators PASS after fixes. Launched combined v6c+v6d append-only runtime integration.


## v6c then v6d runtime integration - Sol worker handoff, 2026-10-08

Process step 3 is complete locally in the requested order: 19 accepted adult
patients / 152 poses from `patient-gapfill-v6c`, then 14 accepted staff / 112 poses
from `staff-gapfill-v6d`. Separate per-batch `owner-approval.json` receipts bind the
owner's delegated instruction and the manager's 2026-10-08 acceptance after the
018 adult regeneration and 008 navy correction. Each receipt is copied byte-exactly
to its artifact folder's `owner-runtime-approval.json`; the two runtime-integration
receipts retain each batch's exact integration-state fingerprints.

Sol worker executed directly. No agents, Git commands, dependency installs,
art edits/generation, clinical edits, reducer/UI edits, external messages,
deployment or publication. The manager owns acceptance and the common thread
handoff; this worker appends only this program handoff within the assigned lane.

### Counts, eligibility and preservation

| Runtime quantity | Before v6c | After v6c / before v6d | After v6d |
| --- | ---: | ---: | ---: |
| Registered identities | 285 | 304 | 318 |
| Cardinal poses | 2280 | 2432 | 2544 |
| Clipboard poses | 30 | 30 | 30 |
| Assets / provenance records | 2310 | 2462 | 2574 |
| Selectable adult patient designs | 160 | 179 | 179 |
| Registered staff designs | 77 | 77 | 91 |

| Exact patient pool | Before v6c | Added by v6c | After both batches |
| --- | ---: | ---: | ---: |
| Female 18-29 | 9 | 0 | 9 |
| Male 18-29 | 9 | 0 | 9 |
| Female 30-44 | 28 | 2 | 30 |
| Male 30-44 | 22 | 2 | 24 |
| Female 45-64 | 36 | 0 | 36 |
| Male 45-64 | 31 | 0 | 31 |
| Female 65+ | 13 | 7 | 20 |
| Male 65+ | 12 | 8 | 20 |

`patient-gapfill-v6c.001`-`.007` join only Female older_adult; `.008`-`.015`
only Male older_adult; `.016`-`.017` only Female adult; `.018`-`.019` only Male
adult. Corrected 018 remains Male / age 33 / the same stable ID and binds source
SHA-256 `4bf3c14e8b4b9965510cea919be7f229a3dc3af5b7a556d4c68cf511717d976a`.
Patient tests exhaust each affected pool, reach all additions before reuse,
check age boundaries and exclusions, retain compatible saved IDs, and verify
occupied/free/LRU behavior with unchanged selection code.

| v6d suffixes | Only eligible staff role | Before v6d | Added | After v6d |
| --- | --- | ---: | ---: | ---: |
| 001-002 | staff.imaging_technician | 3 | 2 | 5 |
| 003-004 | staff.phlebotomist | 3 | 2 | 5 |
| 005-006 | staff.laboratory_technician | 2 | 2 | 4 |
| 007-008 | staff.surgeon | 2 | 2 | 4 |
| 009-010 | staff.or_nurse | 2 | 2 | 4 |
| 011-012 | staff.pharmacist | 2 | 2 | 4 |
| 013-014 | staff.repair_person | 2 | 2 | 4 |

Every new staff catalog and registry entry has exactly one explicit
`eligibleStaffRoleDefinitionIds` member. Tests check every current balance-defined
role plus future APP/executive seams, exclude staff from patient pools, reach
every role look without collisions, refuse exhaustion, preserve compatible
current/departing employee saved looks with all other looks occupied, and select
new hires only from free designs. Existing radiologist and inactive APP/executive
entries stay exact. No old employee is reassigned by these tools.

The v6c integration intake was captured before its first runtime/test edit:
38 immutable snapshots / 7012 accepted source-control-art hashes / all 285 old
entries and 2310 asset bytes. The v6d intake was captured only after v6c's
integration contract, focused tests, diff review and 7543-file promotion rerun
passed: 34 snapshots / 6993 source-control-art hashes / 304 entries and 2462 assets.
It also freezes the complete original v6c integration receipt. Authorities:

- `artifacts/character-statics/patient-gapfill-v6c/runtime-integration-baseline/manifest.json`
- `artifacts/character-statics/staff-gapfill-v6d/runtime-integration-baseline/manifest.json`

All original catalog/registry entries, anchors, public PNGs, input claims and
provenance records remain exact. Provenance appends 152 then 112 records and one
input per batch; only aggregate counts and the registry fingerprint advance.
`packages/game-domain/src/appearance.ts` is byte-identical to both intakes:
`ec439709c4ef79ab2de222a8754e64d17cb13699229d6754cccda94eb024d0e9`.
All original generation tools, roster/ledger/source/native/provenance/correction
controls, alpha reports, accepted pose packages, authored contacts, chair proofs,
gallery pages, manager browser receipts and prior histories remain frozen.
The original teen-reading 018 and original-blue 008 source/history remain intact.

### Files changed and created

Exactly six existing implementation/test/data files changed; filesystem diffs
were inspected against both pre-edit snapshots without Git:

- `packages/game-domain/src/characterStillCatalog.ts` (two appended cohorts;
  original source changes only at the recorded append/type seams).
- `packages/game-domain/src/characterStillCatalog.test.ts`.
- `apps/player/src/art/characterStillRegistry.generated.json`.
- `apps/player/src/art/characterStillRegistry.ts` (cohort union additions only).
- `apps/player/src/art/characterStillRegistry.test.ts`.
- `tools/character-mapping/gs026-runtime-stills/provenance-manifest.json`.

Existing hard-coded count test updates (complete list; no other tests edited):

1. `packages/game-domain/src/characterStillCatalog.test.ts`: catalog/unique IDs
   285 -> 304 -> 318; patients 160 -> 179; staff 77 -> 91; existing v6a/v6b
   Female adult totals 28 -> 30 and Male adult totals 22 -> 24. Added four
   meaningful patient/staff eligibility, reachability and saved-ID tests.
2. `apps/player/src/art/characterStillRegistry.test.ts`: identities/unique IDs
   285 -> 304 -> 318; cardinal poses 2280 -> 2432 -> 2544; assets
   2310 -> 2462 -> 2574; seated poses 1140 -> 1216 -> 1272. Added each cohort's
   URL mapping and two exact accepted pose/contact/role rendering tests.

New files in **each** of the two tool folders:
`runtime-contract.mjs`, `bind-owner-approval.mjs`, `owner-approval.json`,
`capture-integration-baseline.mjs`, `integration-validator-hooks.mjs`,
`validate-approved-batch.mjs`, `promote-runtime.mjs`,
`validate-runtime-integration.mjs`, `validate-promotion-rerun.mjs`,
`update-runtime-tests.py`, `audit-scoped-changes.py`, `run-validation.py`,
`vitest-player.config.mjs`, `INTEGRATION.md`.
Also created the v6c-only `setup-runtime-integration.py` (new-tool setup refuses
existing destination overwrites). Total: 29 new tool/approval/document files.
No existing batch tool or README was edited.

New public art is exactly 264 copied PNGs:

- 152 at `apps/player/public/art/characters/patient-gapfill-v6c/patient-gapfill-v6c.NNN/{stand,sit}-{south,east,west,north}.png`.
- 112 at `apps/player/public/art/characters/staff-gapfill-v6d/staff-gapfill-v6d.NNN/{stand,sit}-{south,east,west,north}.png`.

Both artifact folders gained immutable baseline snapshots/catalog/manifests,
`owner-runtime-approval.json`, `runtime-integration.json`, validation logs,
command/exit/hash receipts and scoped diff reports. Exact created tool and PNG
paths/hashes are in
`artifacts/character-statics/staff-gapfill-v6d/validation/worker-file-manifest.json`.
This plan received only this appended handoff; preceding bytes are preserved.

The per-batch `validation/scoped-source-diff.patch` and
`scoped-change-report.json` report only those six changed snapshot paths.
v6d-only registry/provenance diffs: 2159 added / 3 removed and 2479 added /
4 removed lines, respectively (new entries/records and permitted aggregates).
The complete v6c-baseline-to-final diff includes both batches; no old JSON entry
or provenance claim changed. All 16 new integration MJS modules passed `node --check`.

### Frozen validator execution and receipts

The new wrapper executes the **original** batch validators in-process. Its
Node loader extends only their historical allowed-ID seam **after** the strict
integration contract validates the exact before/after runtime state. The original
285-ID set-size assertion still checks the original set. Original validator
source bytes and every historical preservation invariant remain unchanged.
Historical validators therefore continue printing their frozen pending labels;
the wrapper's final line and the separate approval/runtime receipts report the
current manager-approved integrated state. Do not read those historical labels
as a pending manager decision.

Current commands (each wrapper runs roster, placement, worker review, independent
all-catalog comparison and the batch-specific adult-revision/raw navy audit):

```powershell
node tools/character-mapping/patient-gapfill-v6c/validate-approved-batch.mjs
node tools/character-mapping/patient-gapfill-v6c/validate-runtime-integration.mjs
node tools/character-mapping/patient-gapfill-v6c/validate-promotion-rerun.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-approved-batch.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-runtime-integration.mjs
node tools/character-mapping/staff-gapfill-v6d/validate-promotion-rerun.mjs
```

Direct historical generation `runtime-baseline.mjs` commands retain their old
allowed-ID limits; use the new integration wrapper for post-promotion checks.
The first wrapper attempt caught an integration-adapter set-size guard error
before any runtime write (`304 !== 285`); corrected by applying the old size
assertion to the unchanged historical set. The failed log is retained in
`validation/pre-integration-batch-validators.txt`; the corrected run and every
promotion/rerun subsequently passed. There is no unresolved validator exception.

The v6c promoter also recognizes its one authorized successor. Its final rerun
after v6d leaves the entire 318-identity / 2574-asset runtime exact and retains
v6c's earlier receipt hashes against v6d's pre-edit snapshots.

### Exact command output

Full unabridged UTF-8 stdout/stderr and command/cwd/time/exit/SHA receipts are
under both `validation/` folders. Both folders contain
`integration-validation-receipt.json`, which verifies the 23 relevant command
receipts and their log bytes, including the reproduced pre-existing player
failure. Node emits its existing experimental TypeScript-stripping warning;
that warning is included in the full logs and does not change exit-0 results.

Per-batch approval binding, exit 0 (exact final stdout lines):

```text
{"status":"PASS","approvedIdentities":19,"approvedPoses":152,"approvedAuthoredContacts":76,"approvedBy":"GamifySurgery manager (Claude Code)","ownerDelegated":true,"acceptedCorrection":"patient-gapfill-v6c.018","sourceAndReviewControlsUnchanged":true}
{"status":"PASS","approvedIdentities":14,"approvedPoses":112,"approvedAuthoredContacts":56,"approvedBy":"GamifySurgery manager (Claude Code)","ownerDelegated":true,"acceptedCorrection":"staff-gapfill-v6d.008","sourceAndReviewControlsUnchanged":true}
```

Baseline capture before the respective runtime/test edits, exit 0:

```text
{"status":"PASS","identities":285,"assets":2310,"patients":160,"staffPools":{"staff.imaging_technician":3,"staff.phlebotomist":3,"staff.laboratory_technician":2,"staff.surgeon":2,"staff.or_nurse":2,"staff.pharmacist":2,"staff.repair_person":2},"immutableSnapshots":38,"approvedInputHashes":7012}
{"status":"PASS","identities":304,"assets":2462,"patients":179,"staffPools":{"staff.imaging_technician":3,"staff.phlebotomist":3,"staff.laboratory_technician":2,"staff.surgeon":2,"staff.or_nurse":2,"staff.pharmacist":2,"staff.repair_person":2},"immutableSnapshots":34,"approvedInputHashes":6993}
```

First promotion per batch, exit 0 (`promotion.txt` also contains all five batch validator outputs):

```text
{"status":"PASS","batch":"patient-gapfill-v6c","integrated":19,"poses":152,"runtime":{"identities":304,"cardinalPoses":2432,"clipboardPoses":30,"assets":2462},"patients":179,"staffPools":{"staff.imaging_technician":3,"staff.phlebotomist":3,"staff.laboratory_technician":2,"staff.surgeon":2,"staff.or_nurse":2,"staff.pharmacist":2,"staff.repair_person":2},"alreadyPromoted":false,"ownerDelegatedManagerApproval":true,"published":false}
{"status":"PASS","batch":"staff-gapfill-v6d","integrated":14,"poses":112,"runtime":{"identities":318,"cardinalPoses":2544,"clipboardPoses":30,"assets":2574},"patients":179,"staffPools":{"staff.imaging_technician":5,"staff.phlebotomist":5,"staff.laboratory_technician":4,"staff.surgeon":4,"staff.or_nurse":4,"staff.pharmacist":4,"staff.repair_person":4},"alreadyPromoted":false,"ownerDelegatedManagerApproval":true,"published":false}
```

Final integration contracts after both batches, exit 0:

```text
{"status":"PASS","batch":"patient-gapfill-v6c","preservedIdentities":285,"preservedAssets":2310,"preservedSourceControlArtHashes":7012,"appendedIdentities":19,"appendedAssets":152,"totalIdentities":318,"totalAssets":2574,"adultPatientDesigns":179,"staffDesigns":91,"patientPools":{"Female.young_adult":9,"Female.adult":30,"Female.middle_aged":36,"Female.older_adult":20,"Male.young_adult":9,"Male.adult":24,"Male.middle_aged":31,"Male.older_adult":20},"staffPools":{"staff.imaging_technician":5,"staff.phlebotomist":5,"staff.laboratory_technician":4,"staff.surgeon":4,"staff.or_nurse":4,"staff.pharmacist":4,"staff.repair_person":4},"provenanceRecords":2574,"exactApprovedRuntimeURLs":152,"frozenReviewMetadataUnchanged":true,"originalBatchToolsByteIdentical":true,"ownerDelegatedManagerApproval":true,"selectionSourceByteIdentical":true,"authorizedSuccessorIntegrated":true,"published":false}
{"status":"PASS","batch":"staff-gapfill-v6d","preservedIdentities":304,"preservedAssets":2462,"preservedSourceControlArtHashes":6993,"appendedIdentities":14,"appendedAssets":112,"totalIdentities":318,"totalAssets":2574,"adultPatientDesigns":179,"staffDesigns":91,"patientPools":{"Female.young_adult":9,"Female.adult":30,"Female.middle_aged":36,"Female.older_adult":20,"Male.young_adult":9,"Male.adult":24,"Male.middle_aged":31,"Male.older_adult":20},"staffPools":{"staff.imaging_technician":5,"staff.phlebotomist":5,"staff.laboratory_technician":4,"staff.surgeon":4,"staff.or_nurse":4,"staff.pharmacist":4,"staff.repair_person":4},"provenanceRecords":2574,"exactApprovedRuntimeURLs":112,"frozenReviewMetadataUnchanged":true,"originalBatchToolsByteIdentical":true,"ownerDelegatedManagerApproval":true,"selectionSourceByteIdentical":true,"authorizedSuccessorIntegrated":false,"published":false}
```

Final promotion-rerun idempotence, exit 0; v6c is rerun after v6d:

```text
{"status":"PASS","batch":"patient-gapfill-v6c","hashedFilesUnchanged":7656,"runtimeAssetsUnchanged":2574,"registryUnchanged":true,"catalogUnchanged":true,"provenanceUnchanged":true,"integrationReceiptUnchanged":true,"approvalAndReviewEvidenceUnchanged":true}
{"status":"PASS","batch":"staff-gapfill-v6d","hashedFilesUnchanged":7632,"runtimeAssetsUnchanged":2574,"registryUnchanged":true,"catalogUnchanged":true,"provenanceUnchanged":true,"integrationReceiptUnchanged":true,"approvalAndReviewEvidenceUnchanged":true}
```

The earlier v6c-only rerun also passed with 7543 hashed files unchanged and
2462 runtime assets unchanged. Final rerun logs include fresh PASS results for
all five original validators in each batch. The navy audit independently
replays all eight corrected poses and preserves 104 other poses / 56 native
source files; the adult revision audit preserves 18 other identities / 144
poses / 686 pinned files.

Focused validation before the v6d intake, exit 0:

```text
Test Files  5 passed (5)
     Tests  51 passed (51)
```

for game-domain catalog/appearance/persistence/employee uniqueness/patient
rotation, and:

```text
Test Files  5 passed (5)
     Tests  36 passed (36)
```

for player registry/bitmap/character presentation/patient catalog/founder presets.
Exact commands are in v6c's `domain-focused-tests-command.json` and
`player-focused-tests-command.json`.

Full game-domain command, exit 0:

```powershell
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --configLoader=native
```

Exact final output:

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1 --configLoader=native


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  97 passed (97)
      Tests  3167 passed (3167)
   Start at  02:09:50
   Duration  437.34s (transform 2.60s, setup 0ms, import 40.74s, tests 387.48s, environment 6ms)
```

Full player command, exit 1 solely for the pre-existing failure below:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config ../../tools/character-mapping/staff-gapfill-v6d/vitest-player.config.mjs --configLoader=native
```

The isolated full-suite config mirrors accepted v6a/v6b native-loading/threads
execution without changing shared Vite/React configuration. Exact summary:

```text
Test Files  1 failed | 112 passed (113)
     Tests  1 failed | 863 passed (864)
```

The **same** failure was captured before all runtime edits: baseline full player
111 files / 846 passed / 1 failed (847 total); baseline full domain
96 files / 3161 tests PASS. Final player failure is
`apps/player/src/session/surgeryCenterServicePreviews.test.ts:85:52`,
"ignores the retired concealment flag and preserves the scheduled external
service after an answer". Exact assertion lines:

```text
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
```

Both before/after logs have byte-identical expected/received assertion lines;
the test source hash is unchanged. Evidence:
`patient-gapfill-v6c/validation/pre-integration-player-tests.txt` and
`staff-gapfill-v6d/validation/full-player-tests.txt` under the artifact root.
No new character test failed; the pending-result label case is outside this lane
and was preserved for the manager.

`npm.cmd run typecheck`, exit 0, repeated after concurrent source changes;
exact latest stdout:

```text
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Final scoped filesystem audits, exit 0:

```text
{"status": "PASS", "batch": "patient-gapfill-v6c", "changedSnapshotPaths": 6, "unchangedSourceControlArtHashes": 7012, "suiteSourceDrift": 18, "unrelatedConcurrentSuiteChanges": 13}
{"status": "PASS", "batch": "staff-gapfill-v6d", "changedSnapshotPaths": 6, "unchangedSourceControlArtHashes": 6993, "suiteSourceDrift": 18, "unrelatedConcurrentSuiteChanges": 13}
```

### Concurrent work, limits and manager handoff

Initial suite snapshot: 383 source/test/data files. The pre-final snapshot had
390 files, including seven concurrent GS-038 additions. The final audits record
13 changed existing out-of-lane source files, all preserved. During the final
suites, `packages/game-domain/src/facility-experience.ts`, `index.ts` and
`reducer.ts` changed concurrently, and `facility-automation.ts` was added.
These are not integration-worker edits. Exact hashes and scope evidence:
`staff-gapfill-v6d/validation/concurrent-source-changes.json`,
`suite-source-after-validation.json`, both scoped change reports, and the
pre-integration/pre-final suite snapshots. Root typecheck was repeated after
the observed concurrent changes and passed. Full-suite logs are timestamped
shared-tree validation, not a claim that other lanes were frozen.

No product or architecture decision is pending in this lane. All required CLI
batch/integration/rerun/full-suite/type validation is complete; the single
player failure is independently proven to predate integration. Manager should
review the actual diffs and immutable per-batch baselines, then run its normal
acceptance checks and canonical HTTP delivery check in its own environment.
Manager-accepted post-fix browser evidence (50 v6c and 44 v6d page/viewports) is
hash-bound and preserved; this worker did not launch a browser or HTTP server.

Owner pathway remains `START_GAME.cmd` -> exactly `http://127.0.0.1:4173` in the
same persistent browser profile. Origin, launcher, profile and owner save storage
were not accessed or changed. No remote save/publication claim is made.

This validated checkpoint is **LOCAL ONLY**. No GitHub backup was created;
after acceptance the manager should issue the repository reminder to say
**"push to GitHub"** for an audited checkpoint. Worker writes are complete.
- 2026-10-08: PROGRAM COMPLETE. v6c+v6d integration ACCEPTED by manager: role mapping verified in characterStillCatalog.ts; 152+112 PNGs served byte-exact from :4173; worker full game-domain 3167/3167, player 863/864 (known surgeryCenterServicePreviews failure), typecheck 0. Totals: 245 -> 318 identities; adult patient designs 120 -> 179; staff pools imaging 5, phlebotomy 5, lab 4, surgeon 4, OR nurse 4, pharmacist 4, repair 4.
