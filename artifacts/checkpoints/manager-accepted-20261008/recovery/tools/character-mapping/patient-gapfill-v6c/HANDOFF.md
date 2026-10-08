# v6c .018 adult regeneration handoff - 2026-10-08

**Manager-requested revision complete:** patient-gapfill-v6c.018 is regenerated as Male age33 with a mature lower face, short black side part, visible jaw/upper-lip stubble, adult torso and full-length rust chinos. All eight standing/seated S/E/W/N poses, contacts, chair proof, gallery, overview and duplicate evidence are rebuilt. **All seven final worker validation commands PASS.**

The other18 identities were manager-accepted. Their144 pose PNGs and all686 pinned source/package/contact/chair files remain byte-identical. The regenerated018 awaits manager visual acceptance. No runtime integration or browser validation was performed.

## Review entry points

- Main gallery: `artifacts/character-statics/patient-gapfill-v6c/review/index.html`.
- Original left / revised right, all eight poses: `review/manager/018-original-left-revised-right.png`.
- Original, revised and accepted adults at actual55x110 game frame size, plus4x inspection: `review/manager/018-adult-before-after-game-scale.png`.
- Revision-proof inputs/hashes: `review/manager/018-revision-review-manifest.json`.
- Updated19-identity overview: `review/owner-overview-stand-south-sit-east.png`.
- New018 chair proof: `placement-qa/018-front-desk-chair-placement.png`.
- New018 contacts: `worker-review/contact-overlays/018.png`.
- New018 nearest boards: `comparison/018-nearest-six.png` and `018-all-catalog-nearest-six.png`.
- Accepted v6b/v6c style sheet and all152 final poses: `review/manager/v6b-top-v6c-bottom.png`, `normalized-dark-*.png`.
- Exact final output: `validation/worker-validation.txt`, `018-regeneration-validation.txt`.
- Actual revision log and rejected-layout excerpt: `validation/018-regeneration-log.json`.
- Fresh manager browser check is required: `validation/browser-revalidation-needed.json` preserves the original manager receipt hash and binds the revised source.
- Initial batch logs: `validation/history/pre-018-regeneration/`.
- Original handoff/notes/contacts/README and frozen intake: `tools/character-mapping/patient-gapfill-v6c/analysis/018-regeneration/`.

Relative paths above use the v6c artifact root. Both revision sheets are linked in the main gallery. Its018 standing reference is labeled **historical original seed**; the active eight-pose source controls final appearance.

## .018 revision and regeneration history

| Item | Original rejected appearance | Revised final appearance |
| --- | --- | --- |
| ID, sex, age | patient-gapfill-v6c.018, Male,33 | Unchanged |
| Hair/face | Bowl fringe; youthful clean-shaven face | Short side part/taper; defined adult lower face and dark stubble |
| Build | Small/lean reading at game scale | Average solid adult torso and shoulders |
| Clothes | Navy/ochre mock-neck; rust knee shorts; exposed cream calf socks | Navy/ochre mock-neck; full-length rust chinos; slate lace-up shoes |
| Contacts S/E/W/N | 240/247/247/249 | **236/240/241/246** |
| Geometry | 160x320; body axisX80; floorY287; standing-south246px | Unchanged; one uniform whole-identity scale |

**Two built-in image generation calls** were used in this revision. The first replaced all eight faces/builds/hair/shorts with the adult design. The unchanged extractor rejected its row spacing with `figure rows overlap; reject rather than bisect feet`. The second corrected whole-sheet spacing while preserving the adult appearance, yielding exactly eight valid components. No extractor rule was relaxed, no procedural art substituted, and no source pixels manually repainted or moved.

| Attempt | SHA-256 | Status/location |
| --- | --- | --- |
| Original018 | `f1e06de40115b8ae82bc84fe9017d09a5112765a48427105b88f236617dc1ba7` | Manager rejected teen reading. `sources/018/history/original-teen-reading/` preserves source, prompt, args, provenance, standing seed/receipts and original chair proof. |
| First adult layout | `03d2b562aab145000a5f8d945c4ffbab641a1e8a5b4c85db85d172ac4f8d82c9` | Rejected for row overlap. Immutable `sources/018/history/adult-first-tight-rowgap/`. |
| Final adult source | `4bf3c14e8b4b9965510cea919be7f229a3dc3af5b7a556d4c68cf511717d976a` | Active `sources/018/source.png`, byte-exact built-in output. Source chain verifies through both preserved ancestors. |

Exact prompts: `corrections/018-adult-regeneration.prompt.txt` and `018-adult-row-gap.prompt.txt` in the tool lane. Both calls used the same accepted v6a.004 style anchor used by v6b, SHA `43fdfac5186499b7681637bba1d3729d2d5bef1592d073591cfc6ca1e8a8ab78`, plus the immutable018 whole-sheet target.

Cumulative generation:38 initial calls +3 targeted calls =**41 unique native outputs** (including the unchanged017 hair correction). The source tree holds42 native source/standing PNG copies because the original018 standing seed is also copied into history. The original chair proof is a separate derived PNG.

The original018 standing source and authored generation prompts intentionally remain frozen so historical provenance verifies. Updated roster/design intent and worker QA describe the adult appearance; current eight-pose source supersedes the rejected standing seed's face/clothing. Do not rerun intake prompt initialization over this chain.

## Per-identity handback

IDs are prefixed `patient-gapfill-v6c.`. Every row has eight poses. Other18 are manager-accepted;018 replacement pending. Contacts are authored Y values in S/E/W/N order.

| ID | Sex | Age | Final visible appearance | Contacts S/E/W/N |
| --- | --- | ---: | --- | --- |
| .001 | Female | 65 | Average build; deep brown skin; smooth silver side-part jaw bob; gold bar earrings, no glasses; sage overshirt over plum top; cream trousers; ochre sneakers. | 234/239/239/243 |
| .002 | Female | 68 | Slim; fair freckled skin; white spiky straight pixie; burgundy rectangular glasses; coral boat-neck knit; slate knee skirt; black tights; brown lace-up shoes. | 238/246/246/249 |
| .003 | Female | 72 | Petite; golden brown skin; smooth silver hair in a single long braid; beige hearing aid on anatomical right ear, no glasses; navy cardigan; pale-lime blouse; gray cropped trousers; peach slip-ons. | 234/239/239/243 |
| .004 | Female | 76 | Full figure; warm light-olive/tan skin; loose silver waves; copper hoops, no glasses; plum V sweater over cream collar; moss calf pleated skirt; cream socks; rust loafers. | 234/243/243/245 |
| .005 | Female | 80 | Petite; medium tan skin; charcoal jaw bob with broad white face streak; navy studs, no glasses; ochre tunic with maroon yoke; navy trousers; lilac trainers. | 235/242/242/246 |
| .006 | Female | 84 | Lean; fair skin; smooth white hair in a low bun; teal oval glasses; burgundy tailored waistcoat over cream full-sleeved blouse; teal trousers; brown lace-ups. | 234/240/240/241 |
| .007 | Female | 88 | Sturdy; deep dark brown skin; soft short swept silver crop; pearl studs, no glasses; lilac cardigan over pale-yellow blouse; cream calf skirt; navy slip-ons; brown cane with cream curved handle in anatomical left hand. | 234/237/237/240 |
| .008 | Male | 65 | Athletic; fair freckled skin; silver high quiff; chin-only gray beard, no glasses; burgundy henley with cream placket; mustard trousers; teal trainers. | 234/239/239/243 |
| .009 | Male | 68 | Average build; warm brown skin; compact gray curly crop; clean-shaven, no glasses; dusty-blue zip cardigan with two narrow cream front stripes; camel tee; cream trousers; slate slip-ons. | 235/244/244/248 |
| .010 | Male | 71 | Lean; olive skin; receding smooth sparse gray hair with thinning crown; clean-shaven; gold rectangular glasses; lavender knit vest over sage shirt; navy trousers; rust loafers. | 234/241/241/244 |
| .011 | Male | 74 | Broad; deep brown skin; bald crown with a small white nape fringe; full silver beard, no glasses; terracotta quarter-zip with cream placket; teal trousers; cream trainers. | 235/244/244/249 |
| .012 | Male | 77 | Slim; golden brown skin; swept white top with cropped sides; chin-only white goatee, no glasses; mint/sage herringbone jacket over cream tee; chocolate trousers; burgundy ankle boots. | 235/245/245/247 |
| .013 | Male | 81 | Average build; fair pink-toned skin; smooth white hair in a small low ponytail; clean-shaven; black rectangular glasses; slate sweater with orange elbow patches and cuffs; mustard trousers; navy low boots. | 234/242/242/243 |
| .014 | Male | 85 | Sturdy; tan skin; close silver curls; broad white mustache; beige hearing aid on anatomical left ear, no glasses; aubergine quilted vest over cream henley; blue trousers; moss shoes. | 234/241/241/243 |
| .015 | Male | 88 | Slim; deep brown skin; wide bald crown with wispy white side fringe; clean-shaven, no glasses; forest-green cardigan over coral shirt; cream trousers; chestnut lace-ups. | 234/244/244/243 |
| .016 | Female | 34 | Athletic; fair warm skin; two auburn low braids; blue triangular studs, no glasses; cream mock-neck under lilac dungarees with square chest pocket; purple trainers. | 234/243/243/246 |
| .017 | Female | 42 | Full figure; deep brown skin; smooth black asymmetric bob with anatomical-left shaved side; magenta studs, no glasses; slate wrap top with side tie; teal cropped trousers; ochre ankle shoes. | 234/239/239/240 |
| .018 | Male | 33 | Average solid adult build with broader shoulders; medium olive skin; short side-parted jet-black hair and tapered sides; defined adult lower face with visible short dark jaw and upper-lip stubble, no glasses; navy mock-neck with muted-ochre chest/back panel; full-length rust-red straight chinos; slate lace-up shoes with cream soles. | 236/240/241/246 |
| .019 | Male | 43 | Broad; golden brown skin; tight ginger curls; dark stubble, no glasses; coral sweater with teal shoulder panels; indigo trousers; tan lace-ups. | 234/242/242/248 |

Allocation remains F65+ x7 / M65+ x8 / F30-44 x2 / M30-44 x2. Glasses remain4/19 (21.1%):002,006,010,013, with zero gray curls+glasses. Cane007 and hearing aids003/014 remain unchanged and visual only. No clinical content, diagnosis association, selection weighting or race/ethnicity disease variable was added.

## Validation and preservation

The unchanged GS026/v6a/v6b pipeline validates all152 transparent poses at160x320, axisX80, floorY287, standing-south visible height246;76 authored contact directions and19 authentic south-chair proofs pass. The018 compositor uses the approved55x110 character frame at52px/tile. Other chair directions were not invented.

Duplicate validation independently recomputes5,415 comparisons against285 prior designs (245 original +20 v6a +20 v6b) and all171 within-batch pairs: **zero flags**. Minimum catalog RMSE52.874929201095235; minimum within-batch RMSE55.31435893180412. Same-band evidence covers75 prior patients,287 comparisons and51 pairs. Numerical ranking cannot certify age or style.

Original245 entries/1,990 assets, seven extraction/chair source files and accepted v6a/v6b320 poses/80 native sources remain preserved. Current runtime285 comes from prior manager-authorized integration; **no v6c identity was integrated**. Revision-specific checks pin686 other-identity files, roster objects and source-bound contacts, all unchanged. New immutable snapshots may be added while old bytes remain frozen; roster validation checks40 snapshots.

Current alpha report:7,661 source nonzero pixels with footprint outside across122 poses, max alpha1;125 derived-border nonzero pixels across29 poses, max alpha1; protected clippingfalse. No cleanup/repaint. Exact report remains bound for manager review.

### Exact final output

All seven commands exit0. Full timestamps/stdout/stderr are also in `validation/worker-validation.txt`; Node experimental warnings are retained.

`node tools/character-mapping/patient-gapfill-v6c/validate-roster.mjs --require-complete` — exit 0

```text
(node:20364) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"status":"PASS","requireComplete":true,"requireRootReview":false,"identities":19,"poses":152,"reportedIssues":0,"immutableReviewSnapshots":40,"rosterContract":{"identities":19,"posesPerIdentity":8,"totalPoses":152,"categoryCounts":{"staff":0,"patient":19},"staffRoleCounts":{},"plannedStaffRoleCounts":{},"demographicCounts":{"Female":{"young_adult":0,"adult":2,"middle_aged":0,"older_adult":7},"Male":{"young_adult":0,"adult":2,"middle_aged":0,"older_adult":8}}},"reviewStatus":"candidate-review-root-checks-pending","runtimeBaseline":"245 identities/1990 assets and120 selectable patients preserved","runtimeReady":false,"ownerApproval":"pending","reviewStatusPolicy":"Original art-review labels are frozen evidence; the separate owner approval and runtime-integration receipts supersede them."}
```

`node tools/character-mapping/patient-gapfill-v6c/validate-placement-qa.mjs --require-complete` — exit 0

```text
(node:18924) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"status":"PASS","diagnostics":19,"requireRootReview":false,"runtimeReady":false,"ownerApproval":"pending","frozenChairEvidenceUnchanged":true,"schemaVersion":"patient-gapfill-v6c-placement-qa/v2"}
```

`node tools/character-mapping/patient-gapfill-v6c/validate-worker-review.mjs` — exit 0

```text
(node:3984) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"status":"PASS","identities":19,"poses":152,"authoredSeatedContacts":76,"reviewedChairProofs":19,"existingSameBandIdentities":75,"existingComparisons":287,"withinBatchPairs":51,"nearDuplicateFlags":0,"staticGalleryPages":25,"mainGalleryImages":57,"managerVisualAcceptance":"pending","browserValidation":"not-run-left-to-manager","observedGlasses":4,"maximumGlasses":5,"grayCurlyHairWithGlasses":0}
```

`node tools/character-mapping/patient-gapfill-v6c/validate-all-catalog-comparison.mjs` — exit 0

```text
(node:54404) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"status":"PASS","originalCatalogIdentities":245,"acceptedV6aIdentities":20,"acceptedV6bIdentities":20,"allCatalogIdentities":285,"independentlyRecomputedCatalogComparisons":5415,"withinBatchPairs":171,"nearDuplicateFlags":0,"minimumCatalogRmse":52.874929201095235,"minimumWithinBatchRmse":55.31435893180412,"managerVisualAcceptance":"pending","browserValidation":"not-run-left-to-manager"}
```

`node tools/character-mapping/patient-gapfill-v6c/runtime-baseline.mjs` — exit 0

```text
{"status":"PASS","preservedIdentities":245,"preservedAssets":1990,"priorSelectablePatients":120,"protectedFiles":7,"pinnedAcceptedPoses":320,"pinnedAcceptedNativeSources":80,"currentRuntimeIdentities":285,"concurrentV6bAppendAllowed":true,"runtimeReady":false,"ownerApproval":"pending"}
(node:46172) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

`node tools/character-mapping/patient-gapfill-v6c/018-revision-baseline.mjs verify` — exit 0

```text
{"status":"PASS","unchangedOtherIdentities":18,"unchangedOtherPosePngs":144,"unchangedPinnedFiles":686,"original018Preserved":true,"originalStandingSeedPreserved":true,"stableIdAgeSexPreserved":true,"runtimeReady":false}
(node:18444) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

`node --experimental-vm-modules tools/character-mapping/patient-gapfill-v6c/check-syntax.mjs` — exit 0

```text
{"status":"PASS","syntaxParsedModules":25}
(node:45460) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```


## Visual assessment and manager handback

Worker reviewed both new native outputs, all eight final normalized018 poses, all four contacts, the chair proof, both before/after sheets, both018 nearest boards and rebuilt overview. At actual55x110, trousers, side part and dark stubble remain visible with a more mature lower face and adult torso. Accepted compact proportions, muted palette and dark stepped contours are retained. Chair support looks usable; no unresolved duplicate or pose-consistency concern remains. Age readability remains a manager visual judgment; inspect the regenerated smooth native finish beside accepted references.

Manager next action: inspect018's two new comparison sheets and chair/contact evidence; accept the exact final source hash or request correction, then rerun `node tools/character-mapping/patient-gapfill-v6c/validate-gallery.mjs`. The manager previously checked the original batch's50 pages/viewports. A fresh browser check is left to the manager as instructed. Current static audit passes25 pages/57 main images including new local review links.

## Files and scope

Modified tool files: `roster.json`, `design-rows.json`, `authored-contacts.json`, `review-acceptance.json`, `worker-review-notes.json`, `README.md`, `HANDOFF.md`. New tools: `018-revision-baseline.mjs`, `preview-018-revision.mjs`, `build-018-revision-review.mjs`; two correction prompts and immutable intake copies.

Artifacts are confined to v6c:018 source/history/package/proofs, shared gallery/overview/alpha/staging/comparison evidence and validation logs. All686 pinned other-identity files are unchanged. The program plan receives only an appended completion note. No v6b/v6d or runtime edits.

Sol direct; no subagents, Git commands, installs, web, external messages, commits, push, deployment or publication in this revision. The original task's acknowledged read-only Git intake incident remains in archived workflow notes and was not repeated. Manager owns common handoff and later integration. Owner pathway unchanged: `START_GAME.cmd` -> exactly `http://127.0.0.1:4173`; no server/profile/origin/save changes.

**LOCAL ONLY**, without a new GitHub backup. Manager owns the checkpoint reminder to say **"push to GitHub"**. This generation/packaging revision is complete.
