# N3 round 4 handoff — 2026-11-10

Five supported revisions are ready for independent review. Thirteen items need a specific clinical key decision, and seventeen duplicate/low-value proposals are dropped from this submission. Historical definitions, cards and saves are retained. No manifest acceptance or production registry change was made. Everything newly authored remains `needs_clinician_review`; Melissa Rowland is clinical sign-off.

Packet: [question-new-n3-round4-20261110.json](question-new-n3-round4-20261110.json). SHA256: `fa63d078fd8db6903f1edfb88a812c802e699f22a834103aa0c084b66f8915d3`.

| Input | Reviewed | Revised now | Clinical decision hold | Drop proposal |
| --- | ---: | ---: | ---: | ---: |
| Three round-three REVISE items | 3 | 1 | 2 | 0 |
| Parked backlog | 32 | 4 | 11 | 17 |
| Total | 35 | 5 | 13 | 17 |

The swallowing return gets its targeted acquisition repair. Fistula surgery and postrepair imaging are **withheld**, following the review's instruction to obtain a supported procedure/sequence comparison rather than force a key. The retained seton fact does not rank drainage against LIFT/advancement flap in an inflamed tract; the imaging facts do not rank one groin/hip protocol over the alternatives. Neither has an emitted v4 key.

## Candidates and preservation

- `review.n3.delayed-regurgitation-proximal-anatomic-study.v4`: names transnasal FEES and the speech-language pathologist, describes the obscured interval and subsequent visible views, retains delayed retrograde return, and compares contrast esophagram/EGD/manometry. No claim of uninterrupted observation or exclusion of aspiration.
- `review.n3.foot-culture-versus-clinical-infection.v4`: reconciles the current wound examination with a heavy surface isolate before choosing further systemic/topical antimicrobial treatment. All plans retain wound care. Reuses `concept.diabetic-foot-ulcer.no-antibiotics-without-infection`; the old deep-infection-disposition history is not moved.
- `review.n3.venous-ulcer-with-competing-arterial-findings.v4`: interprets persistent Doppler signal despite maximal ankle cuff inflation before selecting toe/digital physiology, exercise ankle testing or arterial CTA. Reuses `concept.venous-leg-ulcer.arterial-assessment-before-compression`; no compression cutoff or pressure is prescribed.
- `review.n3.lactation-drain-contact-boundary.v4`: distinguishes observed mouth/dressing contact from flange/tunnel/bottle contact. The complete four-option matrix tests each feeding route. No safety inference from the appearance of expressed milk.
- `review.n3.chyle-leak-diet-composition-versus-calories.v4`: uses the operation, meal-related drainage change and paired fluid/serum triglycerides before selecting the initial nutrition prescription. Removes formula A/B response matching. Final ablation removed drain volume, amylase/bilirubin values and framing sentences that did not change the decision.

Three candidates enter at Level 3 and two at Level 4, with educational tier recorded separately. There are three retained N3 meanings and two established-concept reuses, **zero new concept versions and no fresh-concept supply claim**. No history migration, retirement or deletion. Each of the seventeen drop proposals has existing live coverage recorded by exact concept and variant in the [complete triage ledger](question-new-n3-round4-triage-20261110.md) and packet. DROP_PROPOSAL means omit this proposal, not remove the existing topic from the game.

All five previously accepted N3 PASS definitions remain exact: bilateral-carotid attribution, postsplenectomy nodule function, dysphagia biopsy territory, tumor/family testing sequence and gastric large-cell process. The packet verifies their whole prior variant and authored-case hashes and equality with the live case definitions.

## Owner approvals needed

These are the thirteen unresolved **key decisions**, one question per held item. They are proposed clinical teaching boundaries, not accepted recommendations or requests to approve whole unwritten questions. No held key is executable. No message was sent to the owner or anyone else.

1. **Recurrent anal fistula:** For a recurrent high transsphincteric fistula with an associated purulent cavity, should the initial operation drain the cavity and place a loose seton rather than perform LIFT or an endorectal advancement flap at that operation?
2. **Postrepair groin pain:** For work-limiting groin pain after repair, a negative provoked ultrasound, and hip rotation reproducing the usual ache, which should come next: groin MRI during Valsalva, hip radiographs, or a diagnostic ilioinguinal block?
3. **Ileostomy electrolyte replacement:** In a stable ileostomy patient with persistent hypokalemia after oral potassium and a low serum magnesium, should the next order add oral magnesium replacement rather than increase potassium or add spironolactone?
4. **Postoperative retention:** For a comfortable postoperative adult who can void but has repeated residuals of 350–400 mL, should the next step be intermittent catheterization or timed repeat assessment?
5. **Feeding route after aspiration:** For a patient with repeated aspiration during gastric tube feeding but functioning small bowel, should the next feeding route be nasojejunal feeding rather than parenteral nutrition?
6. **Eosinophilic esophagitis:** What PPI dose and treatment duration would you require before keying swallowed budesonide for persistent biopsy-active eosinophilic esophagitis after dilation?
7. **Rectal response:** At eight weeks after rectal-cancer neoadjuvant treatment, if a small ulcer and equivocal MRI signal are shrinking without a palpable nodule, should the key be another response assessment rather than total mesorectal excision?
8. **Pleural sample validity:** For a parapneumonic effusion with pH 7.16 from a sample contaminated by local anesthetic, should the next step be a properly collected repeat aspiration rather than tube drainage based on that pH result?
9. **Chronic mesenteric ischemia:** For a fit patient losing weight despite smaller meals and with severe celiac and superior mesenteric artery stenoses, should the key be endovascular SMA revascularization rather than nutritional rehabilitation before intervention?
10. **Anticoagulated head injury:** After a negative initial head CT and a normal repeat neurologic examination in a patient taking apixaban, should the key be discharge with return precautions rather than routine admission and repeat CT?
11. **ARDS ventilator adjustment:** In ARDS with tidal volume already at 6 mL/kg predicted body weight and plateau pressure still 32 cm H2O, should the keyed next change be a lower tidal volume rather than waiting for diuresis to lower the scale weight?
12. **Cutaneous SCC:** For a small cheek squamous carcinoma with microscopic involvement of a small dermal nerve, should Mohs be the single best procedure over staged conventional excision with delayed closure and permanent-section margin assessment?
13. **Anal-cancer response:** At eight weeks after anal-cancer chemoradiation, if the lesion is steadily shrinking but a small ulcer remains without progressive findings, should the key be repeat response assessment rather than abdominoperineal resection?

Before emitting those keys, record the exact clinical decision and any needed permitted-source regimen/criterion. Do not infer approval of a broader procedure hierarchy or universal numerical cutoff from an answer to a bounded case.

## Quality and evidence

Prospective triage was recorded at `2026-11-10T12:34:09.999Z`, before the candidate file was created. Every new exact item records its raw-data interpretation, consequential action, competent competing errors, stage/category audit, key-cover attack, data ablation, counterfactual and remaining concern. Source/title counts and clean lint do not establish difficulty or a unique clinical key. In particular, the foot and chyle boundaries may still be judged straightforward by the independent reviewer; no author self-check is marked PASS.

The five candidates use eleven exact independently authored atomic facts from the recorded permitted catalog, fourteen original source records and fourteen publication identities. Original factual check dates, access dates, rights and authority assessments are retained; only local IDs and evidence backlinks change. **Zero retrievals, new atomic medical facts or refreshed verification dates.** The foot key retains its single-guideline limitation. The toe-testing application uses the recorded noncompressible-ankle/toe-assessment limitations; it is not a complete vascular algorithm. Clinical observations and numerical measurements are explicitly fictional, not empirical performance or new thresholds. No source prose, figures or full text is stored.

No statistics items occur in these inputs or candidates. No second statistical skill or calculation was added to create difficulty. All new variants use three or four options, short complaints, named age/sex-consistent patients and shuffled runtime choices. All six testing alternatives have existing placeholder estimate profiles; no fixed clinical turnaround time is written into prose.

## Executable preview and later integration

Direct-import `QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE` from `packages/clinical-content/src/question-new-n3-round4-20261110.ts`. It is a validated five-case unapproved stage with no barrel/default registration. The existing synthetic release ID is retained for domain campaign compatibility; the explicit object/export identifies the stage.

Run from the repository root:

```text
node --disable-warning=ExperimentalWarning tools/question-new-n3-round4/review.mjs
node --disable-warning=ExperimentalWarning tools/question-new-n3-round4/preview.mjs
node --disable-warning=ExperimentalWarning tools/question-new-n3-round4/validate.mjs
```

The disposable preview installs the five exact timing rows **in that Node process only**, including estimates for all six testing choices, and restores the array in `finally`. It uses the actual reducer, selector, patient movement, serialization, answer previews and FSRS scoring. All five admit from the explicit stage, are rejected as fresh admissions from default supply, reopen their frozen encounter under the actual default context, complete and score, retain old reviews and preserve a different old construct's history. Alternate name `Jordan Ellis` materializes without stale names. Actual key positions cover 0, 1 and 2. Six positive estimates are `preview_only`; no service executes. These are domain serialization checks, not a new player format-3/journal or browser-validation claim.

After independent review, the manager can bind accepted exact case/node/question/concept rows to a new explicit source view in the **content projection only**. Include any of the three retained N3 meanings that become live; the other two meanings already exist. Install only accepted exact timing rows and their six exported `not_executed/external_only` choice bindings as applicable. Do not overwrite old rows, add admission/save enforcement or treat the generic physiology estimate as an onsite toe-testing service. This worker made none of those acceptance edits.

## Validation

Commands use installed dependencies and `--pool=threads --maxWorkers=2`; no budgets, assertions, configs or timeouts were weakened.

| Check | Exact result | Exit |
| --- | --- | ---: |
| Full clinical baseline, before edits | 1,581 pass / 3 fail, 1,584 total; 124 pass / 3 fail files, 127 total; 109.15 s | 1 |
| First full clinical after | 1,605 pass / 3 fail, 1,608 total; 126 pass / 3 fail files, 129 total; 122.57 s | 1 |
| **Closing full clinical, final packet/source** | **1,605 pass / 3 fail, 1,608 total; 126 pass / 3 fail files, 129 total; 174.83 s** | **1** |
| Focused round-four clinical file | 11 pass / 0 fail; 1 file; 6.90 s; all eleven also pass in closing full run | 0 |
| Root workspace typecheck | All seven workspaces pass | 0 |
| Question-quality lint tests | 33 pass / 0 fail | 0 |
| Candidate cue inventory | 5 variants / 10 canonical-plus-profile contexts / 0 findings, no suppression | 0 |
| Actual disposable domain preview | 5 admissions/completions/frozen reopens; 6 test estimates; preserved reviews; 0 executed services | 0 |

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/question-new-n3-round4-20261110.test.ts --pool=threads --maxWorkers=2
npm.cmd run typecheck
npm.cmd run clinical:lint:test
```

The 24 additional clinical tests reconcile as eleven in this lane and thirteen from the concurrently added `question-harden1-20261110.test.ts`. Every existing clinical source/test file is unchanged from intake. The remaining three failures have the **same file, test and expected/received hashes before and after this lane**:

| Failure file | Failing test | Existing mismatched input |
| --- | --- | --- |
| `question-flags3-20261107.test.ts` | leaves every existing protected source and decision file byte-exact | `packages/game-domain/src/diagnostic-timing.ts`; expected `2a8e915812e9…`, received `499e069e78d1…` |
| `question-stats1-20261108.test.ts` | preserves every protected source/capture through the exact authorized standard/test-hook migration | Same diagnostic-timing hash mismatch |
| `question-stats1-acceptance-20261108.test.ts` | pins each authorized existing-source delta before preserving old capture assertions | `apps/player/src/session/cloud/codecJson.ts`; expected `d490196e1988…`, received `0994becd5f00…` |

**Zero final failures introduced by this lane.** These guards and inputs were not edited. An initial typecheck caught one test-only closure-narrowing error; a local profile-ID constant preserves the assertion and the closing seven-workspace run passes. Earlier failed type/lint outputs remain available rather than being deleted.

Raw logs, actual npm exit receipts, packet receipt, complete source hashes, scope proof, before/after failure assertions and preview rows: `.local-dev/question-new-n3-round4-20261110/`. Final summaries: `validation.json`, `scope-proof.json`, `packet-receipt.json`, `preview.json`, `lint.json`. Baseline/current logs are `clinical-before.log`, `clinical-full.log`, `clinical-final.log`; closing types are `typecheck-close.log`; lint tests are `lint-tests.log`.

## Files and Level 5 effects

New clinical files: `question-new-n3-round4-types.ts`, `question-new-n3-round4-candidates.ts`, `question-new-n3-round4-evidence-20261110.ts`, `question-new-n3-round4-20261110.ts`, and its test, all under `packages/clinical-content/src/`.

New tooling: `triage.mjs`, `build-evidence.mjs`, `review.mjs`, `preview.mjs`, `validate.mjs` under `tools/question-new-n3-round4/`. New documents: this handoff, the packet, the triage ledger and `docs/execplans/question-new-n3-round4-20261110.md`. Existing-file change: append-only entry in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Fourteen new lane files plus that one documentation append.

**Existing Level 5 bound inputs changed by round four: none.** No `index.ts`, `synthetic-content.ts`, `answer-choice-timing.ts`, `test-choice-orders.ts`, manifest, game-domain runtime or player session source edit. Default remains 1,141 cases / 606 concepts, SHA256 `db795ec578f8b5bfa77d1260b2e53c5a59f779f51edcba538fd8753bdb3de139`. Catalog SHA256 `3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40`; manifest SHA256 `0e70c49460b6f93ec6766f6f59ad10eb9e4b0e38d8745283d9fa35818d68c06c`; global timing is exact to intake. No evidence/pin/checkpoint rebind. Future accepted integration may change those inputs and belongs in the manager's release tree.

Concurrent hardened hernia/refeeding and cloud conflict work was preserved. No Git, network, agents, install, commit, push, deploy, external message or owner campaign access. This milestone is local only; manager owns review, acceptance and any backup checkpoint. Owner opening pathways are unchanged. Stop for manager/independent review; no next batch started.
