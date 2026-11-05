# Owner/tester question flags — handoff, 2026-11-04

Status: final validation recorded; author drafts await pipeline/clinical review. Nothing committed, installed, shipped, rebound or sent over the network. This worker made no cloud, Supabase, save, routing, Level 4/5 test or evidence edits. The manager owns acceptance, release, evidence refresh and the later backup checkpoint; this state remains in the shared local working tree.

## Outcome and review artifacts

Eighteen Question flag sections cover seventeen distinct variants; two Dustin flags concern the same thyroid-ultrasound question. Every exact flagged ID was still live at entry. **None was already superseded by batch 1** (manager-reported live draft build `7b8cff7a`). HIDA A02 / v2.r6 is a sibling repair, not a replacement for the flagged HIDA v4. Only the Question flag sections were extracted; no emails or unrelated feedback were retained.

**Sixteen new `.r2` drafts are assembled, all `needs_clinician_review`; F14 is not rewritten.** Its existing source explicitly excludes the eligibility cutoffs needed for a fair raw ultrasound profile, and network access is prohibited. The packet deliberately shows the held item unchanged. Propose withholding/retiring it until the manager supplies a permitted verified profile/atomic mapping. The existing live variant is not silently disabled. F05 wording is repaired, but public ABSITE-scope verification remains a separate hold for an ABSITE-labelled release. These are unresolved decisions, not approvals.

- Review packet: `docs/research/question-flags-review-20261104.json` (17 items, 18 note responses; key shown first for review only, runtime randomized).
- Standard: `docs/clinical/question-authoring-standard.md`, v11; linter v6, advisory only.
- Whole-bank scan/backlog: `docs/research/question-flags-cue-audit-20261104.md` and `tools/question-quality/question-flags-lint-20261104.json`; full current spans in `question-flags-whole-bank-20261104.json`.
- Source records/claim mappings: `docs/research/sources-question-flags-20261104.json`.
- Exact scope, hashes and timing deltas: `tools/question-quality/question-flags-verification-20261104.json`.
- Ownership/hashes, including logs and immutable before fixtures: `tools/question-quality/question-flags-owned-files-20261104.json`.

## Per-flag responses

| Item / flagged variant | Response and remaining review |
|---|---|
| F01 / question.dcis.margin-bcs-wbrt.v3 | Removed the confusing re-excision/evaluation near-pair. The key now names the records to review and the alternatives name actual next plans. |
| F02 / question.postlaparoscopy.benign-referred-shoulder-pain.v2 | Replaced median/ulnar/sciatic distractors with vagal and shoulder-region competitors. Removed the supplied diaphragm-to-shoulder pathway and the benign label from the task. |
| F03 / question.varicose-veins.intervention-referral-after-axial-reflux.v4 | Replaced individualized vascular consultation and vague competing plans with three specific venous procedures. Removed mobility/comorbidity filler that did not determine this anatomical referral question, and created a new concept version for the changed scored objective. No patient preference selects the key. |
| F04 / question.hyperkalaemia.severe-community-result-transfer.v1 | Deleted available-for-immediate-transfer permission and safest wording. Replaced routine-weekly follow-up/diet-alone distractors with plausible same-day outpatient alternatives. |
| F05 / question.gs028f.head-neck.initial-fna-not-open-biopsy.v4 | Removed ambiguous cervical and the completed thin-needle record that named the answer. Reframed the same initial-FNA objective as a prospective sampling decision. Scope: public ABSITE coverage unverified; propose retirement from that track pending verification. |
| F06 / question.immunology.preformed-antibody-hyperacute-rejection.v1 | Removed the established hyperacute antibody-mediated rejection label from all pre-answer text. Added a coherent raw historical record and replaced the irrelevant IgE distractor with closer transplant mechanisms. |
| F07 / question.cirrhosis-perioperative-risk.multifactor-assessment.v3 | Removed all three alone labels and the vague modest-score assertion. Replaced the options with parallel clinical domains and supplied the observed blood-test/history discrepancy. |
| F08 / question.lymphangitis.heel-inguinal.v1 | Replaced heel crack alone and isolated node distractors. Added a competing venous finding and separated the local wound change from the proximal process. Added a consistent canonical age/sex and retained the old approved version unchanged. |
| F09 / question.pneumoperitoneum.context-dependent-venous-return.v4 | Replaced unspecified filling and patient-authored mechanism claims with the actual monitored variables and chronology. Removed a simultaneous head-up change that previously prevented attribution to pressure. |
| F10 / question.dcis.sentinel-node-setting.v3 | Retired the oncoplastic exception as this variant’s scored scenario and replaced it with the supported mastectomy setting. Created a new concept version and removed the confusing mapping premise from pre-answer text. |
| F11 / question.statistics-ethics.perioperative-dnr.v4 | Removed the staff member’s obviously mistaken proposal and the mismatched noun-phrase options. The task now explicitly asks which instruction the order establishes; all options are parallel instructions. |
| F12 / question.cholecystitis.hida-after-equivocal-ultrasound.v4 | Removed HIDA availability/no-delay permission, indeterminate label and diagnosis name from the task. Removed CT from the offered set because it can also be an appropriate next study, retaining three genuine biliary-imaging choices. |
| F13 / question.preoperative-osa.validated-risk-screening.v4 | Removed all alone options and the authored informal-impression criticism. The closer competitors assess real related domains, and a reassuring symptom report supplies a realistic near-miss. |
| F14 / question.thyroid-nodule.fna-selection.v2 | No replacement is assembled. The old exact variant is retained, and its giveaway remains explicitly unresolved. Propose withholding/retiring this variant until a directly sourced ultrasound profile and selection rule are supplied. UNRESOLVED SOURCE HOLD; unchanged, not release-ready. |
| F15 / question.pneumoperitoneum.context-dependent-venous-return.v2 | Deleted compressing splanchnic veins, increased central filling and the pre-interpreted obstruction discussion. Named the actual monitored observations and stable co-variables; replaced incision blood-loss filler with pressure/position-related venous competitors. |
| F16 / question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4 | Replaced patient reviews an ultrasound with the clinician discusses the radiologist’s report. Defined the observed node/extension findings and replaced impossible benign-cancer/no-recurrence/no-consultation distractors with real assessment domains. |
| F17 / question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4 | Defined the imaging findings at the marked palpable site, removed the diagnosis-like complaint/task qualifiers and retained three concrete diagnostic plans. Kept biopsy technique conditional on specialist assessment. |

F09/F15 now use the actual monitored variables and explicit chronology/co-variables, without numeric pressure or timing thresholds. F15 may remain a narrow/easy application; retaining the combined F09 and retiring the redundant early-phase item is proposed. F04, F11 and F16 may also remain easier than the resident target; they are not newly labelled accepted-basic or independently passed. All new versions still require adversarial and clinician review. Remaining lint candidates have per-finding author justifications in the packet, not automated clearance.

## Provenance and clinical holds

27 existing source records and 30 existing atomic claims were reused offline. Actual original access/check dates, citations, license/reuse and authority limitations remain. Aliases of the same publication are not independent corroboration; the ledger reverse-indexes actual uses without pretending to freshly verify the source. No article text, excerpts, proprietary material, recalled board questions, SCORE or paywalled snippets were ingested.

The recorded 2026 ASBrS axillary source supports the standard DCIS/mastectomy setting and a conditional threatened-mapping exception. It does not establish that every oncoplastic resection compromises future mapping. F10 replaces that exception with the explicitly supported mastectomy setting; a single-source limitation and exact-version sign-off remain. No fresh current-guideline check was possible. F05 has a suitable clinical head/neck guideline, but that is not a verified public ABSITE outline. F14’s general ATA patient-page claim cannot be promoted into an ultrasound/size selection rule.

## Frozen compatibility and exact bindings

- 1094 other cases and 1407 other nodes are exact; only 16 target nodes changed. The held F14 case and both later thyroid/DNR tasks are exact. All eleven pilot approvals and all 396 earlier concept definitions remain.
- Two new scored-construct versions: `concept.varicose-veins.axial-trunk-referral-target.v1` (anatomical target replaces candidacy/preference judgment) and `concept.dcis.sentinel-node-mastectomy.v1` (standard mastectomy replaces the disputed oncoplastic exception). Each records its prior concept and reason. Current catalog 398; no silent FSRS-history transfer.
- Timing rows 1767 → 1783; every prior row is exact. Exact order records 323 → 335; every old record and all registry bytes outside the appended block/list entry are exact. All twelve new records explicitly do not execute local tests.
- Four new timed keys are planned/outside tests. F05’s three prospective biopsies now receive previews; F10’s deferred SLNB is a preview and ALND retains no-test classification. Static live previews 1,467 → 1,468 (+3 neck, -1 HIDA CT, -1 breast mammography); terminal timed keys 138 → 139. The inventory expectation update is justified by these explicit changes, not a loosened assertion.
- No node IDs, result gates, keyed service IDs, durations, routes, selector logic, save formats, frozen encounters or clinical approvals are rewritten. No wait duration was baked into prose.

## Linter result and batch 2

Same v6 linter before/after: 1418 variants, 6039 canonical/finite contexts. Whole findings 2063 → 2034; flagged variants 961 → 950. Selected 17: 34 → 6 findings; new owner-rule findings 17 → 1 (the unchanged F14). All sixteen rewritten variants have zero new owner-rule findings.

| Owner rule | Remaining variants / findings |
|---|---:|
| option-alone | 120 / 164 |
| option-generic-individualization | 11 / 11 |
| availability-permission-cue | 15 / 16 |
| supplied-clinical-conclusion | 18 / 24 |
| unexplained-negative-imaging | 6 / 10 |
| ambiguous-cervical-term | 19 / 24 |
| nerve-competitor-plausibility | 0 / 0 |

179 unedited variants with new-rule findings are listed for batch 2. Priority uses entry stage and case references, never player exposure/correctness. Tutorial/basic intent and clinical review status are retained separately. Heuristics do not validate clinical plausibility or difficulty; the anatomy check is a bounded shoulder vocabulary, and expanded imaging names can cause lexical category false positives. No correctness collector, attempt-statistics input or analytics was added.

## Validation

| Check | Exact result | Log |
|---|---|---|
| Clinical-content | 772 passed (772) tests; 98 passed (98) files; 41.60s (transform 4.86s, setup 0ms, import 65.19s, tests 8.17s, environment 6ms) | tools/question-quality/question-flags-clinical-bindings-20261104.log |
| Touched presentation suites | 43 passed (43) tests; 4 passed (4) files; 4.60s (transform 3.75s, setup 0ms, import 7.11s, tests 1.70s, environment 0ms) | tools/question-quality/question-flags-player-bindings-20261104.log |
| Focused binding/inventory | 11 passed (11) tests; 2 passed (2) files; 4.50s (transform 2.04s, setup 0ms, import 4.11s, tests 180ms, environment 0ms) | tools/question-quality/question-flags-domain-bindings-20261104.log |
| Final domain fixture/binding suites | 1227 passed (1227) tests; 9 passed (9) files; 94.99s (transform 1.88s, setup 0ms, import 8.09s, tests 86.20s, environment 0ms) | tools/question-quality/question-flags-domain-focused-final-20261104.log |
| Player fixture and timeout follow-up | 43 passed (43) tests; 3 passed (3) files; 57.23s (transform 6.02s, setup 0ms, import 11.54s, tests 45.40s, environment 0ms) | tools/question-quality/question-flags-player-repairs-focused-20261104.log |
| Entry-release player timeout control | 4 passed \| 3 skipped (7) tests; 2 passed (2) files; 16.01s (transform 4.21s, setup 3.31s, import 3.78s, tests 8.75s, environment 0ms) | tools/question-quality/question-flags-player-timeout-entry-config-control-20261104.log |
| Full player (preload, threads, two workers) | 3371 passed (3371) tests; 334 passed (334) files; 479.36s (transform 11.68s, setup 0ms, import 283.56s, tests 644.24s, environment 24ms) | tools/question-quality/question-flags-player-final-repaired-20261104.log |
| Full game-domain (sandbox threads, one worker) | 26 failed \| 4345 passed \| 1 skipped (4372) tests; 1 failed \| 166 passed (167) files; 1190.47s (transform 5.31s, setup 0ms, import 135.33s, tests 1041.98s, environment 8ms) | tools/question-quality/question-flags-domain-final-integrated-20261104.log |
| Cue-lint tests | 29/29 pass; 0 fail | tools/question-quality/question-flags-lint-tests-final-20261104.log |
| Typecheck | 7 workspaces; no TS errors | tools/question-quality/question-flags-typecheck-final-20261104.log |

Player tests use the existing command-local `adversarial-r5-player-preload-20261102.cjs`; it intercepts only Vite’s optional Windows `net use` probe with EPERM. The file is unchanged and other child-process calls remain real. Earlier failed/incomplete logs are retained: option parity was repaired without changing its assertions; old timing tests now use full question-version identities; the historical round-seven test uses its retained release view. Partial full runs stopped for authoring/type/binding corrections are not counted as full passes. No timeout, exception list, Level 4/5 assertion or evidence file was weakened.

The initial complete player run had 5 failed | 3366 passed (3371); the initial complete domain run had 58 failed | 4316 passed | 1 skipped (4375). These diagnostic runs are retained separately and are not merged into the final counts. All three original player simulation timeouts pass both the focused current-bank run and an entry-release control at the original deadlines; the final full player run also passes. The only player edit is the historical flagged-v4 fixture in flagFreeze.test.tsx. No gift, nurse, spatial, routing, timeout or cloud implementation changed.

### Content-driven fixture repairs

- `apps/player/src/session/flagFreeze.test.tsx`: obtain the exact reported v4 from the retained pre-flag release. The frozen ID and campaign/cloud/flag/recovery assertions are unchanged.
- `packages/game-domain/tests/approved-clinical-admission.test.ts`: include the two explicitly added construct versions in the permitted selection catalog.
- `packages/game-domain/tests/gs028-20261002-batch.test.ts`: use live stable-case primary concepts for selection/learned-history setup and reflect five new exact external preview rows (27 → 32; external-only 12 → 14).
- `packages/game-domain/tests/gs028-20261003-batch.test.ts`: use live case and full-version timing identities; enumerate actual three/four-option branches rather than nonexistent third distractors; execute each non-execution record’s actual choice. Exact rows 19 → 20. All service/XP/idempotence assertions remain.
- `packages/game-domain/tests/gs028-20261007-batch.test.ts`: retain all 80 nodes and test every current choice (319 → 316 following three four-to-three-option rewrites); update source-derived static cumulative pool/concept counts.
- `packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts`: use current case/full-version timing identities, cover every actual choice (320 → 319), account for three prospective neck-biopsy previews (26 → 29 exact rows; non-execution 21 → 24), and update static pool/concept counts.
- `packages/game-domain/tests/patient-supply.test.ts` and `tests/diagnostics/patient-supply.test.ts`: catalog 396 → 398 and three deterministic inline snapshots for the new bank’s seeded cohort mix. `question-flags-supply-candidate-20261104.json` records the exact current results; an unchanged-code entry-release control reproduces all old snapshots. `question-flags-snapshot-change-review-20261104.json` verifies no outside changes except the documented catalog count/comment. The normal final focused run and standalone control pass without snapshot updating. Commands, deadlines, routing and behavioral assertions remain.

Final-run input lock: 1025 source/test/evidence hashes; changes since start: 0. All monitored inputs remain stable.

Final domain failure categories: 1 input-binding guard; 25 legacy initial loaded-state hashes; 0 timeouts; 0 other failures. Every test outside Level 5 passes. The earlier checkpoint, normal-operations and Level 4 timeouts did not recur. Exact names, errors and locations: `tools/question-quality/question-flags-domain-final-failures-20261104.json`.

Full-domain failure headers (if any):

- FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 5
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 6
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 7
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 8
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level +0/schema 9
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 5
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 6
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 7
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 8
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 1/schema 9
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 5
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 6
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 7
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 8
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 2/schema 9
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 5
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 6
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 7
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 8
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 3/schema 9
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 5
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 6
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 7
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 8
- FAIL  tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level 4/schema 9

The separate synthetic-load control in `question-flags-legacy-diagnosis-20261104.json` checks all 25 level/schema combinations against the entry/current clinical releases under unchanged current domain code. It isolates the two newly added empty histories in a disposable comparison copy and checks frozen encounters. It is diagnostic evidence, not a passing Vitest run, production normalization, fixture refresh or evidence rebind. It covers the initial loaded-state hash; assertions after a failing initial hash do not run, so it does not establish continued-play equivalence. The final failure JSON separates the input guard, legacy loaded-state hashes, timeouts and any other failures.

## Exact Level 5 bound inputs changed by this milestone

- Edited: `packages/clinical-content/src/answer-choice-timing.ts`.
- Edited: `packages/clinical-content/src/index.ts`.
- Edited: `packages/clinical-content/src/synthetic-content.ts`.
- Edited: `packages/game-domain/src/test-choice-orders.ts`.
- Added: `packages/clinical-content/src/question-flags-20261104.ts`.
- Added: `packages/clinical-content/src/question-flags-20261104-data.ts`.

Tests, linter tooling and documentation are outside this content-input collection. Existing manifest drift also includes `packages/game-domain/src/reducer.ts` and `packages/game-domain/src/waiting-destinations.ts`; both already differed at entry and were not edited here. The exact recorded/entry/current hashes are in the verification JSON. The manager must run the actual rebind and any required legacy behavioral refresh after acceptance; copying hashes or suppressing guards is not a rebind.

## Exact implementation/test files

- Modified: `docs/clinical/question-authoring-standard.md`.
- Modified: `packages/clinical-content/src/answer-choice-timing.ts`.
- Modified: `packages/clinical-content/src/index.ts`.
- Modified: `packages/clinical-content/src/synthetic-content.ts`.
- Modified: `packages/clinical-content/src/answer-choice-timing.test.ts`.
- Modified: `packages/clinical-content/src/question-quality-adversarial-r7.test.ts`.
- Modified: `packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics-clinical-pairings.test.ts`.
- Modified: `packages/game-domain/src/test-choice-orders.ts`.
- Modified: `packages/game-domain/tests/test-choice-order-inventory.test.ts`.
- Modified: `tools/question-quality/lint.mjs`.
- Modified: `tools/question-quality/lint.test.mjs`.
- Modified: `tools/question-quality/report.mjs`.
- Modified: `apps/player/src/session/flagFreeze.test.tsx`.
- Modified: `packages/game-domain/tests/approved-clinical-admission.test.ts`.
- Modified: `packages/game-domain/tests/gs028-20261002-batch.test.ts`.
- Modified: `packages/game-domain/tests/gs028-20261003-batch.test.ts`.
- Modified: `packages/game-domain/tests/gs028-20261007-batch.test.ts`.
- Modified: `packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts`.
- Modified: `packages/game-domain/tests/patient-supply.test.ts`.
- Modified: `packages/game-domain/tests/diagnostics/patient-supply.test.ts`.
- Added: `packages/clinical-content/src/question-flags-20261104-data.ts`.
- Added: `packages/clinical-content/src/question-flags-20261104.test.ts`.
- Added: `packages/clinical-content/src/question-flags-20261104.ts`.
- Added: `packages/game-domain/tests/question-flags-bindings.test.ts`.
- Added: `tools/question-quality/author-question-flags-20261104.mjs`.
- Added: `tools/question-quality/compare-question-flags-supply-20261104.mjs`.
- Added: `tools/question-quality/handoff-question-flags-20261104.mjs`.
- Added: `tools/question-quality/owner-flag-rules-20261104.mjs`.
- Added: `tools/question-quality/question-flags-capture-20261104.mjs`.
- Added: `tools/question-quality/question-flags-legacy-diagnosis-20261104.mjs`.
- Added: `tools/question-quality/question-flags-order-records-20261104.mjs`.
- Added: `tools/question-quality/question-flags-specs-20261104.mjs`.
- Added: `tools/question-quality/review-question-flags-20261104.mjs`.
- Added: `tools/question-quality/review-question-flags-snapshots-20261104.mjs`.
- Added: `tools/question-quality/verify-question-flags-20261104.mjs`.

Generated review/source/audit/verification artifacts, immutable before snapshots and all logs are enumerated with hashes in the ownership manifest. No unrelated work was reverted. The scope audit records concurrent changes to `apps/player/src/session/cloud/coordinator.ts` and `apps/player/src/session/cloud/gameSession.ts`; this worker did not edit either file. All other protected inputs are exact unless a separate shared-tree change is explicitly listed in verification.

## Manager next actions

1. Review the seventeen-item packet and the six owner lessons; send the sixteen drafts through independent adversarial review. They have no author-granted PASS or clinical approval.
2. Supply a permitted, verified thyroid ultrasound/size profile and atomic mapping for F14, or retire/withhold that variant. Resolve F05 public ABSITE scope or retire it from that track. Decide whether to retain the simpler F15 mechanism item.
3. Inspect the two construct-version decisions and the static preview/inventory changes; accept exact versions, then perform the Level 5 rebind/behavioral refresh and release checks in the manager lane.
4. Preserve the owner’s no-correctness-analytics rule. Batch 2 is a candidate backlog only; no further questions were rewritten. Manager owns publication and the later explicit GitHub-backup authorization.
