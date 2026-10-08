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
