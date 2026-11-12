# N4 round 2 handoff — 2026-11-10

## Result and review scope

Packet: [question-new-n4-round2-20261110.json](question-new-n4-round2-20261110.json), labeled **key shown first for review only**. Review the **11 new/versioned drafts**. The four round-1 PASS versions are reproduced exactly and remain frozen. Nothing was added to the ship manifest or default content registries. All new clinical records remain `needs_clinician_review`; Melissa Rowland remains the clinical sign-off. Author self-checks are not independent PASS decisions or clinical approval.

| Disposition | Count |
| --- | ---: |
| Round-1 PASS, exact frozen case/question and review presentation | 4 |
| Revised candidates from the 17 REVISE items | 6 |
| REVISE items parked rather than forcing unsupported difficulty | 11 |
| New candidates from remaining OR/pediatric slots | 5 |
| Prior manual parks retained | 3 |
| Remaining slots parked | 3 |
| Unique parked topics | 17 |
| Anal-fistula owner hold | 1 |
| Pending testis slot covered by revised bilateral-testis item, not counted twice | 1 |

The explicit round-2 stage has **15 cases and 15 concepts**: 7 intra-op, 4 intra-endoscopy, 2 wound/ostomy and 2 pediatric. The explicit catalog has **35 cases**, retaining all 24 round-1 definitions exactly plus the 11 candidates. There are no new wound/ostomy drafts in this round: the proposed harder competitors did not establish unique supported answers. The two wound cases in the stage are the exact prior PASS cases.

## Executable candidates

Import `QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE` from `packages/clinical-content/src/question-new-n4-round2-20261110.ts` for the review stage. `QUESTION_NEW_N4_ROUND2_CATALOG_RELEASE` retains the old versions and parks. These are explicit draft exports. All choices use runtime shuffle. No procedure option orders the operation already in progress, and no authored result gate blocks the current phase on a circular service order.

All candidate IDs below have prefix `question.n4.`.

| Candidate suffix | Status | Interpretation that changes the current decision |
| --- | --- | --- |
| ventral-controlled-enterotomy-mesh-material.v2 | Revision | Infer the actual mesh-contact compartment from the closed posterior layer and bowel separation, then choose a concrete implant material in the selected controlled-enterotomy scenario. |
| unexpected-deep-mass-during-lipoma-excision.v2 | Revision | Reconcile the imaged superficial target with the unexpectedly deep muscle-associated mass; choose immediate handling of the incision/lesion and subsequent planned investigation instead of an unplanned biopsy/excision. |
| ulcer-recurrent-bleeding-after-clips.v2 | Revision | Interpret recurrent bleeding with superficial clips separating at the ulcer edges; choose a different endoscopic capture strategy while focal access is maintained. |
| pedunculated-polyp-head-versus-stalk.v2 | Revision/new meaning | Interpret head and stalk measurements against the actual pedunculated configuration; choose preventive hemostasis before hot-snare transection. |
| post-impaction-biopsy-site-versus-trauma.v2 | Revision/new meaning | Separate focal extraction injury from distributed esophageal findings; choose representative biopsy territory during the index examination. |
| bilateral-testis-maintenance-versus-ascent.v2 | Revision/new meaning | Compare maintenance of position after release on each side with prior scrotal documentation; choose a side-specific surveillance/operative plan. |
| two-tubes-versus-liver-bed-separation.v1 | Addition, OR07 | Interpret dissection geometry rather than count two visible tubes; decide whether division is justified or further separation is required now. |
| cholangiogram-lucencies-and-proximal-coverage.v1 | Addition, OR08 | Interpret changing rounded lucencies and incomplete proximal filling; select the next on-table study step before committing to duct treatment. |
| recurrent-groin-mesh-compartment.v1 | Addition, OR09 | Infer the prior anterior repair plane from operative mesh/cord relationships; choose the recurrent-repair plane during the current operation. |
| lumpectomy-marker-identity-and-target.v1 | Addition, OR10 | Reconcile marker shape and specimen imaging with two prior biopsy sites; choose target-directed current operative work instead of treating any retrieved marker as success. |
| intermittent-groin-contents-versus-fluid-scan.v1 | Addition, P05 | Reconcile a quiet fluid-only scan with the current reducible enteric groin finding; distinguish planned hernia surgery from observation or emergency treatment. |

Eight candidates test materially new meanings and therefore have distinct `concept.n4r2.*` identities. Three retain existing meanings and exact existing concept definitions: deep mass, recurrent ulcer bleeding and recurrent groin repair. No old concept ID was repurposed, no frozen encounter overwritten, and no FSRS migration introduced. The mesh-contact addition was treated as a new meaning rather than silently broadening the earlier material-only concept.

Four frozen variants:

- `question.n4.cholecystectomy-neck-plane-bailout.v1`
- `question.n4.colonic-wall-pattern-after-mucosal-biopsy.v1`
- `question.n4.venous-ulcer-contralateral-pressure-trap.v1`
- `question.n4.incisional-pocket-above-retained-mesh.v1`

## Source verification and remaining topics

Public primary-source verification worked through the provided research tool. No network bypass was attempted. Added **26 atomic claims** and **16 complete permitted source records**. The packet has 99 claims, 69 source metadata records and 59 distinct publications after retaining inherited records; inherited access dates were not refreshed. Each new source records citation/authors, publication year or explicit null, DOI/official URL, access date, authority, source class, rights/reuse status, intended use and supported claim IDs. No full texts, source excerpts, tables or figures are stored.

New targeted verification covers official CUA-PUC cryptorchidism guidance; ESGE polypectomy and tissue-sampling guidance; the licensed ÖGGH food-impaction/EoE position paper; SAGES safe-cholecystectomy and 2025 intraoperative-imaging guidance; official HerniaSurge/EHS guidance; ASBrS 2026 breast-conserving-surgery resource guide; EHS 2026 emergency-ventral guidance and the SAGES/AHS mesh resource; and government pediatric hernia, thyroglossal-cyst and NIH electrolyte guidance. Complete citations and exact atomic support are in the packet.

Limits are recorded beside the claims and in each candidate's direct-key audit:

- EHS 2026 ventral guidance concerns emergency hernias. It is an indirect cross-check, not evidence that an elective enterotomy has a particular implant timing. The selected enterotomy scenario retains its inherited owner-approved scope; it does not assert a universal immediate-mesh rule. The SAGES/AHS mesh page is society expert guidance, not a graded trial-based guideline.
- ESGE directly supports the pedunculated-polyp measurements used in the draft. Its preventive bleeding recommendation is weak/low-quality; the packet preserves that limitation.
- The cholangiography repeat/de-air choice is an original application of verified study-quality and air-bubble facts, not a claim that the society mandates one verbatim flushing protocol.
- ASBrS 2026 is an expert resource guide. The marker problem does not invent a microscopic margin threshold or generalize one histologic margin rule to every lumpectomy.
- Pediatric testis guidance supports the positional distinction and follow-up/operative boundary. No exact acquired-ascent age or treatment interval is invented. Pediatric family names, sex/age and art contracts are reused exactly.
- A CC BY-NC review is explicitly limited to the current noncommercial draft use. Reassess the reuse basis before commercial reuse; authority and license permissiveness are separate.
- Complete new WSES 2025-edition appendicitis guidance, published in 2026, was not adequately verified for the exact pediatric appendicolith boundary. That slot stays parked. No silent fallback to an older rule or paywalled snippet was used.
- EAU/Uroweb and ACS pages prohibiting this AI use were excluded from new clinical verification. An all-rights-reserved JAMA/PMC article was not treated as reusable merely because PMC served it; inherited metadata was left unchanged without extending/refreshing its support. 403/challenge/size-limit failures were respected.

All 17 review decisions and remaining slots are individually accounted for in `reviewDisposition`, `priorManualParks`, `remainingSlotDispositions` and `parkedTopics` in the packet. Eleven REVISE parks:

| Topic | Reason to park |
| --- | --- |
| Ventral posterior layer/fascial closure | Removing necessary feasibility information would make the decision unfair; no verified harder joint observation was established. |
| Melanoma flap/sentinel sequence | The distinguishing decision is preoperative, without a verified new current operative finding. |
| DCIS gland removal/axillary sequence | No current operative change alters the preoperative decision. |
| Temporary ulcer injection response | Added data do not change the key; a uniquely ranked powder competitor remains unsupported. |
| Small residual polyp after forceps | Added residual detail still leads to basic cold-snare treatment with weak competitors. |
| Duodenal sampling | Sampling is verified, but the draft remains a coverage/protocol cue; no invented precise split. |
| Peristomal leak/adhesive | A measured leak rehearses refitting; several more specific appliance plans can be appropriate. |
| Junction gap versus retraction | Necessary depth/viability findings leave surgery weak, and no unique dressing hierarchy is established. |
| Ileostomy losses/muscle complaint | Magnesium/potassium facts are verified, but added trends do not change the selected test. |
| Parastomal obstruction | Generic transfer is basic; a definitive procedural key exceeds supported clinic scope. |
| Pilonidal disease after abscess resolution | No abscess weakens drainage, while multiple nonacute options may be valid. |

Three prior manual parks remain: Barrett pathology/treatment-stage mismatch; ileostomy ORS recall; duplicate hernia-contour/leak meaning. Remaining OR12 is parked because a unique same-phase anorectal extent-of-excision comparison was not verified; no tissue-bridge dimension was invented. P03 is parked because the verified Sistrunk fact still yields recall, while a functional-thyroid key needs additional direct evidence. P06 is the unverified current appendicitis boundary above. P04 is covered by the bilateral-testis revision, not a second proposal.

## Owner approvals needed

The existing anal-fistula decision remains held; no fistula candidate was emitted:

> For a woman with an anterior fistula crossing the lowest external sphincter, prior obstetric sphincter damage, leakage and no undrained abscess, should the initial key be a loose seton followed by a sphincter-preserving repair, or another named operation?

No additional owner question is needed to review the eleven executable drafts. Ordinary editorial/source work proceeded autonomously within the assigned lane.

## Lint and self-check

The packet records each candidate's raw interpretation, consequential decision, nearest competing action, deciding observation, removal/ablation test, concrete counterfactual, same-stage/category check, source limitations and remaining reviewer concerns. Diagnostic plans have known runtime placeholder timing profiles for relevant testing options; no fixed wait duration was authored. Pediatric candidates enact no pediatric diagnostic tests.

Cue lint reports **15 variants, 30 profile contexts, one finding and zero suppressed findings**. The remaining `near-duplicate-options` advisory is on the bilateral-testis item's balanced 2-by-2 matrix. The mirror choices contain opposite left/right plans; each component appears twice to avoid component convergence. Parallel wording is retained rather than padded or synonym-swapped to silence the heuristic. This is an explicit manual disposition, **not lint-clean output**. Independent review must decide whether the mirrored competitor is clinically credible or an attention trap.

## Runtime preview and integration follow-ups

The standalone preview exercised actual routine actors with explicit unapproved cases. **12 source flows passed**: actual source operation preserved; phase held through unanswered and answered-but-not-closed states; phase resumed after close; frozen domain-snapshot reopen under the default release; correct scoring and retention of seeded fictional review history. Observed key positions varied between 0 and 1. No circular service request was added. The preview temporarily overlays candidate timing/family metadata in its own process and restores it in `finally`. This is not a full player format-3, journal-replay or browser test claim.

**Three stage cases cannot currently match their intended consult topic list.** The preview reports these blocks without patching predicates:

| Case | Domain follow-up after acceptance |
| --- | --- |
| incisional-pocket-above-retained-mesh.v1, frozen PASS | Recognize `concept.superficial-incisional-ssi.open-drain` in `clinic-consult-topics.ts:woundConcepts`. |
| pedunculated-polyp-head-versus-stalk.v2 | Recognize `concept.n4r2.pedunculated-polyp-stalk-hemostasis` in `founder-consults.ts:endoscopyConcepts`. |
| post-impaction-biopsy-site-versus-trauma.v2 | Recognize `concept.n4r2.post-impaction-esophageal-biopsy-territory` in the same endoscopy list. |

Two exact pediatric family/art bindings and candidate timing/order metadata are exported but uninstalled. Integrate those only after acceptance. The preview used temporary bindings to exercise pediatric routing.

The read-only idle-source reproducer still finds **one unsourced OR admission with no service operations and a null consult** when the routine clock is due and appointments disabled. The endoscopy probe admitted none in this run. This is an existing ordinary-fallback selection issue, not a request to add manifest enforcement or reopen/save throws. It belongs to the domain lane before a general procedure-only supply guarantee can be claimed. No runtime module was edited here.

## Exact validation

| Command/check | Result |
| --- | --- |
| Pre-edit full clinical: `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2` | 129 files passed / 3 failed (132); 1,646 tests passed / 3 failed (1,649); 109.78 s; exit 1. |
| Final full clinical, same command | 130 files passed / 3 failed (133); 1,660 tests passed / 3 failed (1,663); 168.66 s; exit 1. |
| Focused new test: same command plus `src/question-new-n4-round2-20261110.test.ts` | 1 file / 14 tests passed; 6.32 s; exit 0. Final full clinical includes these same 14 tests. |
| `npm.cmd run typecheck` | All 7 workspaces pass; exit 0: clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research, game-domain. |
| `npm.cmd run clinical:lint:test` | 33 passed / 0 failed; 2,887.9038 ms; exit 0. |
| `node --disable-warning=ExperimentalWarning tools/question-new-n4-round2/review.mjs` | Packet/frozen comparisons pass; cue lint one documented advisory, zero suppression. |
| `node --disable-warning=ExperimentalWarning tools/question-new-n4-round2/preview.mjs` | 12 flows pass / 3 topic-affinity blocks reported; exit 0. |
| `node --disable-warning=ExperimentalWarning tools/question-new-n4-round2/idle-source-probe.mjs` | Read-only reproduction completes; one OR fallback defect observed; exit 0. |
| `node tools/question-new-n4-round2/validate.mjs` | Checks receipts, before/after failures, frozen packet and shared-tree preservation; writes local validation.json. |

The three full-suite failures **already occurred before these edits**. Their file, test, expected digest and received digest are identical in the final run:

1. `src/question-flags3-20261107.test.ts` — “leaves every existing protected source and decision file byte-exact”; input `packages/game-domain/src/app-appointments.ts`.
2. `src/question-stats1-20261108.test.ts` — “preserves every protected source/capture through the exact authorized standard/test-hook migration”; same input.
3. `src/question-stats1-acceptance-20261108.test.ts` — “pins each authorized existing-source delta before preserving old capture assertions”; input `apps/player/src/session/cloud/codecJson.ts`.

Failures 1–2: expected `9053ef12e1024cdb87865de85d190bb9dc649976d927b345039f278e67dc0f1e`; received `72e1168893dfdcb4f2dc0c0a9a598340f1f59f3a76c8f2098d78218912713dac`. Failure 3: expected `d490196e1988db2f39fc66df0589b768fd10930803afcbc568265e1910ceaf3d`; received `0994becd5f0022d2489de303987a6bb6a4c590fb45aea958a0856dcac4267c7a`. No assertions, pins, budgets or timeouts were changed. This lane introduces **zero clinical-suite failures**.

Receipts and full output are under `.local-dev/question-new-n4-round2-20261110/`: `clinical-before.log`, `clinical-final.log`, `focused-final.log`, `typecheck-handback.log`, `lint-tests.log`, `preview-handback.log`, `preview.json`, `idle-source-probe.json`, `lint.json`, `packet-receipt.json` and `validation.json`. Receipt comparison covers all 1,850 intake source/tool files; all remain unchanged. The existing thread handoff is append-only.

## Files and boundary

New clinical files, all under `packages/clinical-content/src/`:

- `question-new-n4-round2-types.ts`
- `question-new-n4-round2-materialize.ts`
- `question-new-n4-round2-revisions.ts`
- `question-new-n4-round2-additional.ts`
- `question-new-n4-round2-evidence.ts`
- `question-new-n4-round2-dispositions.ts`
- `question-new-n4-round2-reference-bindings.ts`
- `question-new-n4-round2-20261110.ts`
- `question-new-n4-round2-20261110.test.ts`

New tooling: `tools/question-new-n4-round2/{build-reference-bindings,review,preview,idle-source-probe,validate}.mjs`. New docs: this handoff, the packet and `docs/execplans/question-new-n4-round2-20261110.md`. Appended `docs/handoffs/CURRENT_THREAD_HANDOFF.md` without replacing earlier content.

**Changed Level 5 bound inputs: none.** No default clinical index/synthetic registry/timing input, manifest, domain runtime, player session, save codec, evidence/pin/checkpoint, Supabase or release/deploy file was edited. Prior N4 files and independent review records remain exact. No Git command, install, agent, commit, push, deployment or external message was used.

Next action belongs to the manager: independently review the eleven candidates, retain the fistula hold, and coordinate accepted timing/family/topic-affinity integration with the domain lane. This checkpoint remains local; no backup or release is implied.
