# APP character-art batch v6e worker handoff

Completed 2026-10-09 by the assigned Sol worker. Eight additional APP candidates
(`app-gapfill-v6e.001`-`.008`) have all 64 transparent standing/seated S/E/W/N
poses packaged at 160x320. Four women and four men span visual ages 28-60;
exactly two identities wear glasses. Seven CLI validation commands passed.
All art remains candidate content: manager visual acceptance and browser
validation are pending, `runtimeReady` is false, and runtime integration is a
separate manager-controlled milestone. The current runtime still has two APP
looks, 318 identities, 2574 assets and 179 selectable patient designs.

## Review artifacts

- [Main gallery](../../../artifacts/character-statics/app-gapfill-v6e/review/index.html)
- [Manager gallery: APP/style/all-pose sheets](../../../artifacts/character-statics/app-gapfill-v6e/review/manager/index.html)
- [Two approved APPs on top; eight new APPs below](../../../artifacts/character-statics/app-gapfill-v6e/review/manager/approved-apps-top-new-eight-below.png)
- [v6d above/new APPs below at the same frame scale](../../../artifacts/character-statics/app-gapfill-v6e/review/manager/v6d-top-v6e-bottom.png)
- [Native final source sheets](../../../artifacts/character-statics/app-gapfill-v6e/review/source-review.html)
- [All 318 existing identities and closest matches](../../../artifacts/character-statics/app-gapfill-v6e/comparison/all-catalog.html)
- [Both existing APPs and within-batch role comparisons](../../../artifacts/character-statics/app-gapfill-v6e/comparison/index.html)
- [Authored four-direction contact review](../../../artifacts/character-statics/app-gapfill-v6e/contact-review/index.html)
- [Authentic Front Desk chair proofs](../../../artifacts/character-statics/app-gapfill-v6e/placement-qa/index.html)

The direct comparison PNG is
`artifacts/character-statics/app-gapfill-v6e/review/manager/approved-apps-top-new-eight-below.png`.
It composites exact standing-south and seated-east PNGs at native frame scale.
Both approved APPs occupy the top row and all eight candidates occupy the two
rows below. Their source/pose hashes are bound by `style-review-manifest.json`
and independently checked by the worker-review validator.

## Identity realization

All eight wear a white provider coat or jacket over long scrub trousers and
dark clinical shoes. Scrub colors avoid the approved APPs' cobalt and plum and
the other provider roles' signature combinations. These are appearance facts
only; no diagnosis, probability, demographic-selection rule or clinical claim
was authored.

| ID suffix | Sex / age | Scrubs | Distinguishing appearance | Glasses |
| --- | --- | --- | --- | --- |
| 001 | Female / 28 | Coral | Golden-tan; short black curls, tapered nape | No |
| 002 | Female / 38 | Ochre | Fair freckled; straight auburn center-part bob | No |
| 003 | Female / 49 | Russet | Warm brown; high braided black/silver knot | No |
| 004 | Female / 60 | Charcoal | Light warm brown; straight silver side-part bob | Amber |
| 005 | Male / 31 | Taupe | Olive-tan; black high ponytail and undercut, clean-shaven | No |
| 006 | Male / 41 | Apricot | Fair pink; ginger crop and neat beard | No |
| 007 | Male / 53 | Cocoa | Deep brown; bald, salt-and-pepper beard | Black rectangular |
| 008 | Male / 58 | Brick red | Fair warm; silver waves, older clean-shaven face, stockier waist | No |

Per-identity inspection, distinctions and realization differences are recorded
in `worker-review-notes.json` and hash-bound in
`artifacts/character-statics/app-gapfill-v6e/worker-review/visual-review.json`.

## Sources, packaging and authored contacts

Built-in image generation made 16 initial calls: one standing-cardinal identity
sheet and one complete eight-pose sheet per identity. No regeneration or
deterministic art correction was needed. All 16 native PNGs, exact prompts,
tool arguments and provenance receipts are retained under
`artifacts/character-statics/app-gapfill-v6e/sources/001`-`008`; byte-exact copies
and original native output paths/hashes are recorded. Style references are the
two approved APP looks and the v6d provider-style examples. Packaging reuses the
unchanged GS026 extractor, 160x320 canvas, center axis 80, floor anchor 287 and
standing-south target height 246. No manual repainting, procedural character
construction, mirroring, recoloring or alpha cleanup was applied.

Four seated contacts per identity were manually authored from the normalized
seated support regions. Source-bound overlays and the authentic south-facing
Front Desk chair proof were inspected; E/W/N are directional contact evidence,
not invented runtime chair rotations. Coordinates remain worker candidates.

| ID suffix | South | East | West | North |
| --- | ---: | ---: | ---: | ---: |
| 001 | 242 | 248 | 248 | 250 |
| 002 | 242 | 248 | 248 | 251 |
| 003 | 243 | 249 | 249 | 252 |
| 004 | 245 | 252 | 252 | 254 |
| 005 | 240 | 246 | 246 | 248 |
| 006 | 238 | 244 | 244 | 247 |
| 007 | 237 | 240 | 240 | 245 |
| 008 | 238 | 243 | 243 | 247 |

All-catalog comparison independently recomputed 2544 candidate/existing pairs
(8 x 318), 16 candidate/approved-APP pairs and all 28 within-batch pairs. The
near-duplicate threshold remains the v6d RMSE <8 screen. There were zero flags;
minimum existing-catalog RMSE was 56.2489999187717 and minimum within-batch RMSE
was 60.06573513605653. This numeric screen supplements actual visual review.
All 318 existing looks and all sixteen nearest-match boards were inspected.

## Style concerns and acceptance limits

- Build variation is milder than the written petite/lean/broad/full design
  briefs. Faces, hair, age cues, skin tones and uniforms vary clearly, with
  compact proportions consistent with the references. Manager should assess
  the degree of body-type variety.
- 004 has small blank chest rectangles in seated E/W views that are absent
  from standing views. There is no text or logo; this is a minor consistency
  detail for manager review. Her amber frames render rounder than planned.
- 006's apricot is brighter than the muted brief, and its ginger crop is
  swept. 003's silver braid strands and 007's gray beard are stronger than
  planned. Each is coherent across poses and visually distinct.
- Source normalization measured 47 outside-frame pixels in four source poses,
  all at alpha 1; seven derived border pixels occur in two poses, all at alpha
  1. No protected-alpha clipping occurred. Native edge noise is retained and
  recorded for manager alpha acceptance.
- Browser validation was not run. The prepared
  `node tools/character-mapping/app-gapfill-v6e/validate-gallery.mjs` checks
  16 pages at desktop and phone sizes (32 page/viewports) in the manager's
  browser-capable environment. Static image/link/card checks passed and are
  recorded separately. Fresh ephemeral file-gallery contexts have
  `location.origin` equal to `null`; no owner profile or game-save origin is
  used. Owner playtesting remains `START_GAME.cmd` and exactly
  `http://127.0.0.1:4173` in the existing persistent profile.

## Owned files and preservation

Worker changes are contained in `tools/character-mapping/app-gapfill-v6e/`
(design rows, prompts, reference/intake analysis, source receipts, packaging,
validators, contacts, review ledger, notes and this handoff) and
`artifacts/character-statics/app-gapfill-v6e/` (native sources/references, eight
packages, review histories, galleries, comparisons, overlays, chair proofs and
validation receipts). The sole authorized shared-document change is an
append-only v6e progress line in
`docs/execplans/character-gapfill-v6-20261007.md`; its prefix preservation is
recorded in `analysis/plan-progress-append-receipt.json`.

Runtime art/catalog data and seven extraction/chair controls match their intake
hashes, as do 186 accepted prior native source PNGs. Existing identities,
anchors and source bytes are preserved. Concurrent Level 4 M5 gameplay edits
were outside the pinned character-art snapshot and were not modified by this
worker. No `apps/` or `packages/` edit, dependency installation, web access,
external message, commit, push, deploy or publication was performed.

One inadvertent read-only `git status --short` occurred during intake despite
the brief's no-Git restriction. No further Git command or Git mutation occurred.
The Windows inline catalog-read quotation failure and an initial scaffold
fixture assertion error are recorded in `validation/workflow-notes.md`. The
fixture assertion was corrected from 32 back to the authentic value 56; the
proof builder and all approved geometry were always correct. All final checks
pass. Intermediate immutable review snapshots remain preserved.

This checkpoint is local only. No GitHub backup exists. After acceptance the
manager owns integration, common-thread handoff updates and the owner reminder
to say **"push to GitHub"** for an audited checkpoint.

## Exact validation output

Seven commands exited 0. Full stdout, stderr, timestamps, exit files and hashes
are in `artifacts/character-statics/app-gapfill-v6e/validation/`. Canonical
machine receipt: `worker-validation.json`; transcript: `worker-validation.txt`.
Node's experimental-feature warnings are preserved below; PowerShell formats
them as `NativeCommandError` records, while the process exit code and validator
status are both successful. The transcript below is copied verbatim from the
saved validation transcript.

```text
$ node tools/character-mapping/app-gapfill-v6e/validate-roster.mjs --require-complete
exit=0
{"status":"PASS","requireComplete":true,"requireRootReview":false,"identities":8,"poses":64,"reportedIssues":0,"immutableReviewSnapshots":16,"rosterContract":{"identities":8,"posesPerIdentity":8,"totalPoses":64,"categoryCounts":{"staff":8,"patient":0},"staffRoleCounts":{"staff.app":8},"plannedStaffRoleCounts":{},"demographicCounts":{"Female":{"young_adult":1,"adult":1,"middle_aged":2,"older_adult":0},"Male":{"young_adult":0,"adult":2,"middle_aged":2,"older_adult":0}}},"reviewStatus":"candidate-review-root-checks-pending","runtimeBaseline":"318 prior identities/2574 assets and179 selectable patients preserved; existing art pinned","runtimeReady":false,"ownerApproval":"pending","reviewStatusPolicy":"Original art-review labels are frozen evidence; the separate owner approval and runtime-integration receipts supersede them."}
node.exe : (node:13468) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any 
time
At line:11 char:20
+   $stdoutLines = @(& $executable @arguments 2> $stderrPath)
+                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:13468) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)

$ node tools/character-mapping/app-gapfill-v6e/validate-placement-qa.mjs --require-complete
exit=0
{"status":"PASS","diagnostics":8,"requireRootReview":false,"runtimeReady":false,"ownerApproval":"pending","frozenChairEvidenceUnchanged":true,"schemaVersion":"app-gapfill-v6e-placement-qa/v2"}
node.exe : (node:4536) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any 
time
At line:11 char:20
+   $stdoutLines = @(& $executable @arguments 2> $stderrPath)
+                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:4536) Exp...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)

$ node tools/character-mapping/app-gapfill-v6e/validate-worker-review.mjs
exit=0
{"status":"PASS","identities":8,"poses":64,"roles":1,"authoredSeatedContacts":32,"reviewedChairProofs":8,"reviewedRoleSheets":1,"reviewedCatalogIdentities":318,"reviewedComparisonBoards":16,"glassesIdentities":2,"regenerations":0,"staticGalleryPages":16,"mainGalleryImages":24,"managerVisualAcceptance":"pending","browserValidation":"not-run-left-to-manager"}
node.exe : (node:21080) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any 
time
At line:11 char:20
+   $stdoutLines = @(& $executable @arguments 2> $stderrPath)
+                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:21080) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)

$ node tools/character-mapping/app-gapfill-v6e/validate-all-catalog-comparison.mjs
exit=0
{"status":"PASS","priorRuntimeIdentities":318,"allCatalogIdentities":318,"existingRoleLooks":2,"independentlyRecomputedCatalogComparisons":2544,"independentlyRecomputedSameRoleComparisons":16,"withinBatchPairs":28,"sameRoleNewPairs":28,"perRoleComparisonSheets":1,"nearDuplicateFlags":0,"minimumCatalogRmse":56.2489999187717,"minimumWithinBatchRmse":60.06573513605653,"managerVisualAcceptance":"pending","browserValidation":"not-run-left-to-manager"}
node.exe : (node:45508) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any 
time
At line:11 char:20
+   $stdoutLines = @(& $executable @arguments 2> $stderrPath)
+                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:45508) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)

$ node tools/character-mapping/app-gapfill-v6e/runtime-baseline.mjs
exit=0
{"status":"PASS","preservedIdentities":318,"preservedAssets":2574,"priorSelectablePatients":179,"protectedFiles":7,"pinnedNativeSources":186,"currentRuntimeIdentities":318,"runtimeReady":false,"managerAcceptance":"pending"}
node.exe : (node:55264) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any 
time
At line:11 char:20
+   $stdoutLines = @(& $executable @arguments 2> $stderrPath)
+                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:55264) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)

$ node --experimental-vm-modules tools/character-mapping/app-gapfill-v6e/check-syntax.mjs
exit=0
{"status":"PASS","syntaxParsedModules":22}
node.exe : (node:23328) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
At line:11 char:20
+   $stdoutLines = @(& $executable @arguments 2> $stderrPath)
+                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: ((node:23328) Ex...nge at any time:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
(Use `node --trace-warnings ...` to show where the warning was created)

$ python tools/character-mapping/app-gapfill-v6e/validate-text.py
exit=0
{"status":"PASS","textFiles":196,"issues":[]}


```
