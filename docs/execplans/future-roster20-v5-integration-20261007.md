# GS-033 future-roster20-v5 runtime integration

## Goal and authorization
Owner (2026-10-07, to the Claude manager thread): "I reviewed the character
stills in 033, those are approved and can be implemented into the game."
This approves the 20 identities / 160 standing and seated poses in
`artifacts/character-statics/future-roster20-v5` (12 radiologists, 2 APPs,
2 executives, 4 patients) for append-only runtime integration. It does not
authorize a commit, push, merge, release or Pages publication.

## State and constraints
- Shared, heavily dirty tree. Four Claude threads (character popups/seat
  clicking, patient question layout, ethics/stats overhaul, next-level room
  design) and owner work are concurrent. Preserve all unrelated changes.
- Prior proven flow: `docs/execplans/patient-demographics20-v4-integration-backup-20261007.md`
  with `tools/character-mapping/patient-demographics20-v4/`
  (`capture-integration-baseline.mjs`, `owner-approval.json`,
  `promote-runtime.mjs`). Mirror it; do not edit its files.
- Batch tools and evidence: `tools/character-mapping/future-roster20-v5/`
  (roster, runtime-baseline, validators, review-acceptance).
- Append-only: every existing registry/catalog entry, image byte and anchor,
  saved still ID and source/control hash must be unchanged.
- APP and executive staffing limits are undefined. Register those four
  identities, but they must not appear in any current hiring/staff pool until
  a role that uses them exists. Radiologists join the radiologist pool;
  patients join compatible age/sex patient pools with existing occupancy/LRU.

## Milestones and ownership
1. Manager (Claude): bind approval, write this plan, brief the worker.
2. Sol worker (`gpt-6.1-sol`, max): owns new
   `tools/character-mapping/future-roster20-v5/` integration tools
   (owner-approval record, integration baseline, promote-runtime, contract
   checks), batch status metadata, new public cohort assets, still
   catalog/registry and their focused tests, and append-only runtime
   provenance. No Git, dependency installs, deployment, clinical content or
   planning-doc edits other than its handoff section below.
3. Manager: review the actual diff against the immutable baseline, rerun
   validation, confirm idempotence, check canonical HTTP delivery, and report.

## Acceptance
- 20 new identities / 160 URLs serving exact approved pose bytes; prior
  identities/assets byte-identical.
- Radiologists and patients selectable as described; APPs/executives
  registered but not selectable.
- Re-running promotion makes no changes.
- Batch validators PASS; `npm run typecheck`; focused player and domain tests
  for catalog/registry/selection PASS, with any pre-existing unrelated
  failure documented with evidence that it predates this work.

## Progress
- 2026-10-07: approval bound; Sol integration worker launched via `codex exec`
  (thread `01a118fe-c632-7c23-a229-31f5795e7136`, gpt-6.1-sol, max,
  workspace-write, unelevated sandbox).
- 2026-10-07: manager review ACCEPTED. Manager inspected live source against
  the worker's pre-edit snapshots (characterStillCatalog.ts,
  characterStillRegistry.ts: additive only; four APP/executive rows have empty
  role lists). Manager reran in its own environment: runtime-integration,
  promotion-rerun (5404 hashed files unchanged), runtime-baseline, roster and
  placement validators PASS; gallery validator PASS (8 pages/viewports, the
  browser check the worker sandbox could not launch); `npm run typecheck`
  exit 0; focused domain 45/45 and player 33/33 tests PASS with default
  config; three sampled new PNGs served byte-exact from
  http://127.0.0.1:4173. Local only; no GitHub backup yet.

## Worker handoff
(Worker appends: files changed, counts before/after, exact validation output,
risks and open decisions.)

### Milestone 2 handback — 2026-10-07

Sol worker completed append-only local integration. No agents, Git commands,
dependency installs, external messages, deployment, clinical edits, movement,
rooms, panels or session view-model changes. Other batches' tools were read only.
The manager owns acceptance and the common handoff; this worker appended only here.

| Runtime quantity | Before | After |
| --- | ---: | ---: |
| Registered identities | 225 | 245 |
| Cardinal poses | 1800 | 1960 |
| Clipboard poses | 30 | 30 |
| Assets / provenance records | 1830 | 1990 |
| Adult patient designs | 116 | 120 |
| Selectable radiologist designs | 4 | 16 |
| New registered inactive APP/executive designs | 0 | 4 |

The exact pre-edit baseline was captured before any runtime edit: 40 byte-exact
snapshots, original registry/catalog data and 3354 immutable source/control/art
hashes. `artifacts/character-statics/future-roster20-v5/runtime-integration-baseline/manifest.json`
is the authority. Original `runtime-baseline.json`, roster, review ledger, source
receipts, prompts, 160 packaged poses, authored coordinates, galleries, chair
proofs and historical review manifests remain byte-identical. Existing 225
registry/catalog entries, all 1830 public image bytes, anchors, provenance records,
input claims and compatible saved IDs were preserved. Selection source
`packages/game-domain/src/appearance.ts` remains byte-identical.

New stable IDs are `future-roster20-v5.001`–`.020`, in roster order. `.005`–`.016`
join only `staff.radiologist`. `.017` Male age 41, `.018` Female age 54, `.019` Male
age 57 and `.020` Female age 69 join existing compatible patient pools. Tests
exhaust each pool without collisions and verify existing occupancy/LRU reuse and
saved-ID retention. `.001`–`.002` APPs and `.003`–`.004` executives are registered
staff art with **empty `eligibleStaffRoleDefinitionIds`** and **no runtime `role`**.
`staffStillEligibleEntries` admits only explicit role membership. Tests enumerate
every current balance-defined staff role and the future APP/executive seam names,
including supplying an inactive ID as a saved/current ID; none selects these four.
Roadmap metadata does not grant eligibility or invent executive job IDs/capacities.

### Files created or changed

Created under `tools/character-mapping/future-roster20-v5/`:

- `bind-owner-approval.mjs`, `owner-approval.json` (verbatim instruction, exact
  source/pose/ledger/gallery/alpha/contact hashes and selectability scope).
- `runtime-contract.mjs`, `capture-integration-baseline.mjs`.
- `promote-runtime.mjs` (strict in-process preflight; refuses overwrites/drift).
- `validate-runtime-integration.mjs`, `validate-promotion-rerun.mjs`.
- `vitest-player.config.mjs` (focused tests only; no shared Vite config edit).

Changed only these existing implementation/tool paths:

- `packages/game-domain/src/characterStillCatalog.ts` and its focused test.
- `apps/player/src/art/characterStillRegistry.generated.json`,
  `characterStillRegistry.ts` and its focused test.
- `tools/character-mapping/gs026-runtime-stills/provenance-manifest.json`
  (160 records and one input appended; registry fingerprint/counts advanced;
  prior records/claims unchanged).
- This batch's `runtime-baseline.mjs`, `validate-roster.mjs` and
  `validate-placement-qa.mjs` accept only the authorized append-only expansion
  and continue verifying historical art/runtime bytes. `build-roster.mjs` now
  refuses regeneration after approval; `README.md` documents the receipt/status.

Created 160 byte-exact PNGs under
`apps/player/public/art/characters/future-roster20-v5/future-roster20-v5.NNN/`.
Every runtime URL/hash maps to an exact owner-approved pose. Created the immutable
baseline directory (40 copied files, catalog entries and manifest),
`owner-runtime-approval.json`, `runtime-integration.json` and validation logs/reports
under `artifacts/character-statics/future-roster20-v5/`. Only this plan's Worker
handoff was appended. The validation root-review result now reports actual runtime
status; historical art-review labels remain frozen and are explicitly superseded
by the owner approval and runtime-integration receipts.

Actual source diffs were inspected against the pre-edit filesystem snapshots,
without Git. The manager can inspect
`artifacts/character-statics/future-roster20-v5/validation/scoped-source-diff.patch`
and `scoped-change-report.json`. Generated registry diff: 3091 additions / 3
removals (counts plus new entries); provenance: 3533 additions / 4 removals
(new input/records plus fingerprint/counts). No prior JSON entry changed.

### Exact validation output and commands

Full captured stdout/stderr is in this batch's `validation/*.txt`; outputs below
are verbatim command results, with exit status stated. Node additionally emits
its existing `ExperimentalWarning: stripTypeScriptTypes is an experimental
feature and might change at any time`; the PowerShell logger decorates stderr
as `NativeCommandError` even for successful exit-0 commands.

`node tools/character-mapping/future-roster20-v5/bind-owner-approval.mjs` — exit 0:

```text
{"status":"PASS","approvedIdentities":20,"approvedPoses":160,"sourceAndReviewControlsUnchanged":true}
```

`node tools/character-mapping/future-roster20-v5/capture-integration-baseline.mjs`
before all runtime edits — exit 0:

```text
{"status":"PASS","identities":225,"assets":1830,"patients":116,"immutableSnapshots":40,"approvedInputHashes":3354}
```

`node tools/character-mapping/future-roster20-v5/promote-runtime.mjs` — exit 0,
strict preflight output in `validation/promotion.txt`; final line:

```text
{"status":"PASS","integrated":20,"poses":160,"runtime":{"identities":245,"cardinalPoses":1960,"clipboardPoses":30,"assets":1990},"selectableRadiologists":16,"inactiveRegisteredStaff":4,"patients":120,"published":false}
```

`node tools/character-mapping/future-roster20-v5/runtime-baseline.mjs` — exit 0,
`validation/runtime-baseline.txt`:

```text
{"status":"PASS","preservedIdentities":225,"preservedAssets":1830,"priorSelectablePatients":116,"protectedFiles":10,"runtimeReady":true,"ownerApproval":"approved"}
```

`node tools/character-mapping/future-roster20-v5/validate-roster.mjs --require-root-review`
— exit 0, `validation/roster.txt`:

```text
{"status":"PASS","requireComplete":true,"requireRootReview":true,"identities":20,"poses":160,"reportedIssues":0,"immutableReviewSnapshots":58,"rosterContract":{"identities":20,"posesPerIdentity":8,"totalPoses":160,"categoryCounts":{"staff":16,"patient":4},"staffRoleCounts":{"staff.radiologist":12},"plannedStaffRoleCounts":{"Advanced practice provider (APP) (level 4; referenced-not-yet-defined)":2,"Executive (level 5; roadmap-only)":2},"demographicCounts":{"Female":{"young_adult":0,"adult":3,"middle_aged":6,"older_adult":1},"Male":{"young_adult":1,"adult":3,"middle_aged":5,"older_adult":1}}},"reviewStatus":"review-ready-pending-owner-approval","runtimeBaseline":"225 identities/1830 assets and116 selectable patients preserved","runtimeReady":true,"ownerApproval":"approved","reviewStatusPolicy":"Original art-review labels are frozen evidence; the separate owner approval and runtime-integration receipts supersede them."}
```

`node tools/character-mapping/future-roster20-v5/validate-placement-qa.mjs --require-root-review`
— exit 0, `validation/placement.txt`:

```text
{"status":"PASS","diagnostics":20,"requireRootReview":true,"runtimeReady":true,"ownerApproval":"approved","frozenChairEvidenceUnchanged":true,"schemaVersion":"future-roster20-v5-placement-qa/v2"}
```

`node tools/character-mapping/future-roster20-v5/validate-runtime-integration.mjs`
— exit 0, `validation/runtime-integration.txt`:

```text
{"status":"PASS","preservedIdentities":225,"preservedAssets":1830,"preservedSourceControlArtHashes":3354,"appendedIdentities":20,"appendedAssets":160,"totalIdentities":245,"totalAssets":1990,"adultPatientDesigns":120,"selectableRadiologists":16,"inactiveRegisteredStaff":4,"provenanceRecords":1990,"exactApprovedRuntimeURLs":160,"frozenReviewMetadataUnchanged":true,"ownerApproved":true,"published":false}
```

`node tools/character-mapping/future-roster20-v5/validate-promotion-rerun.mjs`
— exit 0. Re-executes the entire promoter in-process, including strict source
preflight. All 5404 hashed inputs, tools, snapshots and runtime files stay exact.
Full preflight/promoter lines in `validation/promotion-rerun.txt`; final line:

```text
{"status":"PASS","hashedFilesUnchanged":5404,"runtimeAssetsUnchanged":1990,"registryUnchanged":true,"catalogUnchanged":true,"provenanceUnchanged":true,"integrationReceiptUnchanged":true,"approvalAndReviewEvidenceUnchanged":true}
```

`npm.cmd run typecheck` from repository root — exit 0 (`npm run typecheck` semantics;
the Windows `.cmd` shim avoids PowerShell's pre-existing npm.ps1 execution-policy
restriction). Exact output in `validation/typecheck.txt`:

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

`npm.cmd run test --workspace @gamify-surgery/game-domain -- src/characterStillCatalog.test.ts src/appearance.test.ts tests/character-still-persistence.test.ts tests/employee-still-uniqueness.test.ts tests/patient-appearance-rotation.test.ts --pool=threads --maxWorkers=1 --configLoader=native`
— exit 0, `validation/domain-tests.txt`:

```text
> @gamify-surgery/game-domain@0.0.1 test
> vitest run src/characterStillCatalog.test.ts src/appearance.test.ts tests/character-still-persistence.test.ts tests/employee-still-uniqueness.test.ts tests/patient-appearance-rotation.test.ts --pool=threads --maxWorkers=1 --configLoader=native


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain


 Test Files  5 passed (5)
      Tests  45 passed (45)
   Start at  21:00:25
   Duration  5.34s (transform 2.27s, setup 0ms, import 4.38s, tests 296ms, environment 0ms)
```

`npm.cmd run test --workspace @gamify-surgery/player -- src/art/characterStillRegistry.test.ts src/art/characterBitmapArt.test.ts src/facility/characterPresentation.test.ts src/content/patientAppearanceCatalog.test.ts src/content/founderAppearancePresets.test.ts --config ../../tools/character-mapping/future-roster20-v5/vitest-player.config.mjs --configLoader=native`
— exit 0, `validation/player-tests.txt`:

```text
> @gamify-surgery/player@0.0.1 test
> vitest run src/art/characterStillRegistry.test.ts src/art/characterBitmapArt.test.ts src/facility/characterPresentation.test.ts src/content/patientAppearanceCatalog.test.ts src/content/founderAppearancePresets.test.ts --config ../../tools/character-mapping/future-roster20-v5/vitest-player.config.mjs --configLoader=native


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player


 Test Files  5 passed (5)
      Tests  33 passed (33)
   Start at  21:00:26
   Duration  5.52s (transform 2.47s, setup 0ms, import 4.56s, tests 313ms, environment 0ms)
```

### Existing environment failures and manager follow-up

`node tools/character-mapping/future-roster20-v5/validate-gallery.mjs` — exit 1
both **before runtime edits** and after integration. Exact repeated failure:

```text
browserType.launch: spawn EPERM
    at C:\Users\rowla\Projects\GamifySurgery\tools\character-mapping\future-roster20-v5\validate-gallery.mjs:23:32
```

Full before/after stderr (including browser launch arguments) is preserved in
`validation/pre-integration-gallery.txt` and `validation/gallery.txt`. The browser
never launched. Gallery script, HTML, images and links were not edited, and frozen
review checks prove unchanged bytes. Earlier successful gallery evidence remains
in `validation/gallery-browser-results.json`; this worker does not claim a fresh
browser PASS. Manager should rerun the same validator in its working execution
environment, then perform its assigned canonical HTTP delivery check.

Default Vitest child-process startup also failed before implementation with
`spawn EPERM`: `validation/pre-integration-domain-tests.txt` (no tests ran) and
`pre-integration-player-tests.txt` (Vite config startup). Domain `--pool=threads`
and native loading passed before edits (2 files / 21 tests), recorded in
`pre-integration-domain-threads.txt`. Player native loading of the shared Vite
config additionally hits its existing extensionless plugin import; the isolated
test-only config passed before runtime edits (2 files / 15 tests), recorded in
`pre-integration-player-native-config.txt`, and the final five-file runs above pass.
Shared configs and dependencies were preserved. Root typecheck passed before
implementation as well (`pre-integration-typecheck.txt`).

No product/architecture decision is pending. APP/executive capacities and role
implementation remain intentionally undefined, per the brief. Review/status
history is preserved rather than relabeled: the runtime receipt is the current
status authority. No HTTP server or owner browser/storage was accessed by this
worker. Owner opening pathway stays `START_GAME.cmd` → exactly
`http://127.0.0.1:4173` in the same persistent profile; existing saves stay there.
This milestone remains local only, without a GitHub backup. Manager should review
the diff and rerun acceptance, then provide the checkpoint reminder under the
repository's explicit "push to GitHub" rule. Worker writes are complete.

### Post-acceptance correction — 2026-10-07 (manager)
Full game-domain suite showed two `tests/reading-stations.test.ts` assertions
hardcoding the old four-look radiologist roster (`level3-roster-v2.001`–`.004`;
eligible pool length 4). Manager made a tiny test-only correction: hires must be
four distinct radiologist-eligible looks, and the eligible pool must cover the
four posts (>= 4). File now 3/3 PASS. Lesson: worker briefs and manager review
run the full suite of every touched package, not only focused tests.
