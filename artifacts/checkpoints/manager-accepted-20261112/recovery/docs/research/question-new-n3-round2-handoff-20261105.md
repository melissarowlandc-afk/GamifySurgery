# N3 round-two handoff - 2026-11-05

Thirty-nine returned items have separately versioned v2 revisions. The sole independently passed item, review.n3.pleural-source-versus-systemic-response.v1, is exact across the full original review-variant record, case, question, self-check, timing and mappings. No N3 acceptance was added; the ship manifest is byte-exact at intake. All revised clinical versions remain needs_clinician_review; Melissa Rowland is clinical sign-off.

Packet: docs/research/question-new-n3-round2-20261105.json (key shown first for review only; runtime choices randomized and frozen). Calibration: docs/research/question-new-n3-round2-calibration-20261105.md. Active plan: docs/execplans/question-new-n3-round2-20261105.md.

Validation is not fully green: the final domain run has twenty-seven baseline failures; player has four baseline failures plus one newly observed full-suite performance failure. Its current and pre-change controls pass, so that extra timing failure is neither cleared nor labelled pre-existing. Performance-lane review remains necessary; this handoff does not claim that zero introduced full-suite failures has been established.

## Calibration and identity

Compared all forty original author submission-ready judgments against the reviewer before rewriting: one PASS, thirty-nine REVISE; thirty-five easy, five moderate, only three two-step. Added five rejection rules: visible-record shortcut attack; competent-resident same-stage distractors; concrete action keys; raw-data ablation/counterfactual decision change; and fair close comparisons before difficulty predictions. Every revision records its original notes, response, strongest shortcut, repair, credible option misreading, best-under counterfactual, inference/action chain, decisive observation and residual concern. These are author hypotheses, not independent PASS or measured difficulty.

Nineteen revisions retain the scored meaning, eighteen have separate material concept versions, and two reuse established SSI-source-control/DVT-treatment concepts. Earlier definitions/cards remain. No history migration or forty-fresh-concepts claim. The explicit pool has forty distinct scored identities; a player who already learned the two reused concepts has thirty-eight unseen possibilities, proved in a focused test. No N3 case enters live play.

Default release equals its full pre-round-two reconstruction, including accepted rewrite helpers: 1,136 cases / 598 registered meanings / zero N3 cases. Explicit catalog: 1,229 cases / 643 registered meanings, with every historical definition retained. Sixteen cases are Level 3 and twenty-four Level 4. Choices: thirty-seven three-option and three four-option items. No new room or executable service. Timing archive: all 2,171 prior rows exact as a prefix, plus thirty-nine v2 rows; thirty-seven new external-only choice records.

## Evidence and editorial limits

Offline recorded facts only; no retrieval or source-currentness refresh. Ledger contains ninety atomic records (seventy retained exactly, twenty additional unchanged recorded facts), eighty-nine source records / eighty-six publication identities. Eighty-four claims are used by the current forty variants; unused first-round facts remain retained metadata. Sixteen keys have a single-publication limitation. Duplicate source records do not provide independent corroboration. Original dates, citations, rights, authority and intended use are retained; source back-reference IDs expand. No copied prose, new universal cutoff, dose, probability or key on a targeted source hold. Numeric patient observations and laboratory intervals are explicitly constructed.

Strongest remaining calibration concerns are the familiar asplenia safety rule, technical record-reconciliation questions and ARDS paired-plan construction. They are exposed per item for independent challenge. No generic specialist-referral key is used. The source boundary led to two explicit merges instead of an invented mesh-salvage rule or duplicate DVT identity.

## Validation

| Check | Exact result | Native exit |
|---|---|---|
| Full clinical-content | 118 files passed; 1,303 tests passed; 100.33 s | 0 |
| Full game-domain, final | 200 files passed / 2 failed; 5,101 tests passed / 27 failed / 1 skipped (5,129); 672.00 s | 1 |
| Full player | 370 files passed / 5 failed; 3,547 tests passed / 5 failed (3,552); 1,088.83 s | 1 |
| Focused clinical / manifest / timing | 4 files, 106/106 passed; 6.17 s | 0 |
| Focused domain / retained-order inventory | 3 files, 97/97 passed; 9.24 s | 0 |
| Isolated original inventory fixture | 1 file, 4/4 passed; 15.12 s | 0 |
| Workspace typechecks | All seven passed, including workbench client/server commands | 0 |
| Question-quality lint tests | 33 passed / 0 failed | 0 |
| Batch cue lint | 40 variants / 80 contexts / 0 findings, linter v8 | 0 |
| Pre-change performance control, isolated | 1/1 passed; 42.07 s | 0 |
| Current performance test, isolated | 1/1 passed; 42.79 s | 0 |
| Pre-change control with engine differential tests | 2 files, 4/4 passed; 74.20 s | 0 |

Native logs and exact exits: .local-dev/question-new-n3-round2-20261105/validation.json. Prior comparison: .local-dev/question-new-n3-20261105/validation.json, including its earlier gate/narrowing/round-two comparisons. Full-suite counts are preserved; focused retries do not replace them. No assertions, budgets or timeouts were weakened.

Initial own defects were repaired: thirty-three demographic metadata mismatches in new inputs; new tuple typing; and one missing retained N3 v1 source in test-order inventory. That fixture now includes the forty real retained cases and preserves every orphan/label/timing/route check. Initial full domain: 5,099 pass / 29 fail / 1 skip, 537.42 s; final rerun: 5,101 pass / 27 fail / 1 skip, 672.00 s. The intermittent 10,000-ms inventory timeout also occurred before N3; its unchanged isolated retry passed 4/4 and it passes in the final full run.

| Remaining file | Count | Evidence / ownership |
|---|---|---|
| tests/approved-clinical-admission.test.ts | 1 | Same one in pre-round-two full run. Static fixture expects 585 meanings; concurrent accepted B2B/G06 supply has 598. Complete pre-round-two live reconstruction is exact. |
| tests/level-five-integration.test.ts | 26 | Same 26 in the pre-N3 full run, prior narrowing and earlier N2 round-two / gate round-three runs; release-tree binding/checkpoint hashes remain manager-owned. |
| src/session/breadButterPresentation.test.ts | 1 | Same one in pre-round-two full run. Accepted B2B40 has three choices; this unchanged fixture requires four. |
| src/session/cloud/diagnosticWorkloadPerformance.test.ts | 1 | Same failing test in pre-round-two, narrowing, N1 round-three and N2 round-two runs. Raw comparisons retained in validation.json. |
| src/session/cloud/operationalSession.test.ts | 1 | Same fencing-during-computation 5,000-ms timeout in pre-round-two and earlier gate/narrowing runs. |
| src/session/cloud/operationalSessionPerformance.test.tsx | 1 | New full-run failure: 2x main active time 41.62489988594098 ms versus 16 ms. Exact unchanged file SHA c943d7fc6ea4af13f7e984a643ec21dcfbb91e520e9429aba5e82ace7d83d8a7. Earlier full runs and all three new isolated/paired controls pass. Attribution unresolved; protected concurrent performance lane. |
| src/session/cloud/separateCampaign.test.ts | 1 | Same retired-encounter JSON codec-limit failure in pre-round-two and earlier gate/narrowing runs. |

The fifth player failure is not called an N3 functional regression or dismissed as timing noise. The strict full-run failure remains visible. Its source and all protected session code are unchanged since intake, and default release equality does not prove performance neutrality. The read-only control substitutes the four exact captured runtime files in Vite and the native worker, with an in-memory worker-entry URL redirect. No managed source, test, assertion, timeout or budget is edited. Load receipts prove all four original files loaded in both realms. The shared control was paired once with the existing engine-differential tests (previously measured at about 64 s), rather than an artificial stress loop. Those passes cannot establish why the full run exceeded 16 ms. Manager/performance lane should adjudicate it before a release claim.

Full commands use --pool=threads --maxWorkers=2. Player uses --configLoader native and the private native config; its only change from the checked-in config is the explicit .ts extension on the private-module guard import. No environment/budget override. Complete commands, logs, exits, source-load receipts and failure comparisons are in validation.json.

Save coverage includes the new domain test 'reopens an N3 round-two frozen chart under default and completes it with its original FSRS identity' and the retained v1 counterpart. Existing player coverage has four format-three waiting/in-progress excluded/replaced cases and two committed-admission journal-replay cases in src/questionShipSaveCompatibility.test.ts. Neither player/session implementation nor these tests was edited.

## Files and Level 5 effects

- docs/execplans/question-new-n3-round2-20261105.md
- docs/handoffs/CURRENT_THREAD_HANDOFF.md
- docs/research/question-new-n3-round2-20261105.json
- docs/research/question-new-n3-round2-calibration-20261105.md
- docs/research/question-new-n3-round2-handoff-20261105.md
- packages/clinical-content/src/answer-choice-timing.test.ts
- packages/clinical-content/src/answer-choice-timing.ts
- packages/clinical-content/src/index.ts
- packages/clinical-content/src/question-new-n3-20261105.test.ts
- packages/clinical-content/src/question-new-n3-round2-20261105.test.ts
- packages/clinical-content/src/question-new-n3-round2-20261105.ts
- packages/clinical-content/src/question-new-n3-round2-evidence-20261105.ts
- packages/clinical-content/src/question-new-n3-round2-level3-nutrition.ts
- packages/clinical-content/src/question-new-n3-round2-level3-specialty.ts
- packages/clinical-content/src/question-new-n3-round2-level4-critical.ts
- packages/clinical-content/src/question-new-n3-round2-level4-foregut.ts
- packages/clinical-content/src/question-new-n3-round2-level4-oncology.ts
- packages/clinical-content/src/question-new-n3-round2-types.ts
- packages/clinical-content/src/synthetic-content.ts
- packages/game-domain/src/question-new-n3-round2-test-orders.ts
- packages/game-domain/src/test-choice-orders.ts
- packages/game-domain/tests/question-new-n3-round2-supply.test.ts
- packages/game-domain/tests/test-choice-order-inventory.test.ts
- tools/question-new-n3-round2/build-evidence.mjs
- tools/question-new-n3-round2/review.mjs
- tools/question-new-n3-round2/scope.mjs
- tools/question-new-n3-round2/validation.mjs

Own changed existing Level 5 inputs: packages/clinical-content/src/index.ts; synthetic-content.ts; answer-choice-timing.ts; packages/game-domain/src/test-choice-orders.ts. The last append is required to retain exact v2 external-choice identities alongside all old frozen choices. Nine new runtime modules enter the dependency graph; hashes are in scope-proof.json. No evidence, pin or checkpoint edit/rebind. Manager rebinds in the release tree.

Fixtures changed only to retain the first-round catalog alias, account for thirty-nine appended timing rows and include forty actual retained v1 cases in the order-validation union. All existing assertions remain. Registry review and hashes: .local-dev/question-new-n3-round2-20261105/registry-review.json and scope-proof.json. Forty-five pre-existing N1/N2/N3 definition files, the first N3 packet/review and manifest are exact. Concurrent flags2 round-three exports/files and batch2b helper integration are preserved.

No Git, installs, network, agents, external messages, Supabase or deployment. No player session/cloud or reducer edit. Work is local only; no GitHub backup was created. Manager owns independent acceptance, clinical/source decisions, release rebinding and a separately authorized 'push to GitHub' checkpoint. Stop; no next batch.

Packet SHA-256: dc5a7c6ecfa5cba28eaca0791bb1d2641e8794b9e02c57d29a6347e4de0b54b7. Frozen full-variant SHA-256: 40277ea4eadb0fb2dc58901138dae40593c185af459cb8b2ece152bcc6b4e2f3. Frozen authored-case SHA-256: 9052a4f64a39aa52ce07a7e5d89e08aa8ebdea611e7d019931ab4e3b1bd45426.
