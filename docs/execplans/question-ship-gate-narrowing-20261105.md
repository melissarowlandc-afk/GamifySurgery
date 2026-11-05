# Projection-only question shipping and historical save compatibility

## Goal and contract

Implement the manager's 2026-11-05 architecture decision: the manifest controls only the default clinical release projection. Domain admission, selection, availability and encounter creation consume their supplied release without a second acceptance check. Frozen encounters and prior histories remain playable across catalog changes. Manifest inconsistencies fail tests; runtime projection warns and retains the legacy case/node instead of throwing.

## Ownership and constraints

This worker owns the ship manifest/projection/tests, their minimal shared registry hunks, removal of prior domain gate hunks, affected fixtures, manager decision record and handoff. The tree is shared. Preserve batch2b-round2 helper integration and all other workers' changes. No N1/N2 question rewriting, N2 review-three acceptance, player session implementation, Level 5 evidence/pin/checkpoint changes or rebind. No Git, installs, network, agents, external messages, deployment or Supabase. Clinical status remains needs_clinician_review; editorial acceptance is not Melissa Rowland's clinical sign-off.

## Acceptance and validation

- Replace N1 review-two seed with the manager's exact twelve review-three acceptances; park twenty-eight drafts in explicit catalogs. Keep twelve N2 review-two PASS and existing directed rewrite acceptances.
- Restore the five domain paths and the availability reference helper without reverting concurrent work. Record byte comparisons against pre-gate captures.
- Build/test checks cover missing views, duplicate nodes, unknown versions and changed concepts. Runtime inconsistencies warn and fall back to legacy definitions; new invalid additions are omitted.
- Prove actual pre-gate admissions survive format-three snapshot reopen and retained journal/command replay under the new default, score from frozen content and preserve FSRS concept history.
- Scope historical author fixtures to retained stages. Preserve assertions, budgets and timeouts. Scope F02 rewrite-quality checks to its retained candidate stage.
- Run full clinical-content, game-domain and player Vitest with --pool=threads --maxWorkers=2, all seven workspace typechecks, and tools/question-quality lint tests. Attribute every remaining failure by file using earlier recorded runs or concurrent-lane evidence. Target zero failures introduced by this lane.

## Repository state and evidence

Intake: .local-dev/question-ship-gate-narrowing-20261105/intake.json and captured owned files. Prior gate and earlier validation receipts are retained in .local-dev/question-new-n2-round3-ship-gate-20261104 and question-new-n2-round2-20261104. No Git inspection is used.

## Progress

- [x] Read instructions and prior handoff; capture current file hashes and owned integration files.
- [x] Restore domain behavior and narrow the projection; update manifest and decision record.
- [x] Add consistency/fallback and historical save/replay tests; adjust affected fixtures.
- [x] Complete required validation and failure attribution; inspect scoped changes.
- [x] Write docs/research/question-ship-gate-narrowing-20261105.md and append current handoff.

## Next action

The manager owns acceptance and cross-lane integration; N3 stays on hold. All five restored domain modules/reference files match pre-gate intake hashes; reducer also matches the immediate pre-guard copy. Default projection has 1,134 cases/1,447 nodes, 585 retained concept definitions and 425 active concepts; explicit catalog has 1,189 cases/1,502 nodes. N1 parks exactly twenty-eight drafts and N2 parks twenty-seven.

Twelve consistency/projection checks, 128 native projection/catalog checks, six actual format-three snapshot/journal compatibility checks, all seven typechecks and thirty-three lint tests pass. Clinical full rerun has 1,126 pass/two fail: existing rewrite freeze tests pin the bytes of the two authorized historical-stage test fixtures. Three test-file digest entries in the original/round-two batch2b captures need reconciliation by their owner. Neither capture nor any rewrite definition was edited. Exact old/new hashes and proof that the old hashes matched at intake are recorded in .local-dev/question-ship-gate-narrowing-20261105/rewrite-test-digest-followup.json. This is an integration conflict caused by authorized fixture edits, not a claimed pre-existing failure.

Final full domain without overlapping validation jobs: 4,980 pass/26 unchanged Level 5 failures/one skip, 199 files, 470.32 s. The unchanged 10-second inventory budget passes; the earlier overlapping run's timeout is retained in receipts. Final full player: 3,538 pass/three prior cloud failures, 373 files, 808.33 s. Exact per-file comparisons to N2 round-two, pre-gate N1 round-three and gate round-three logs are recorded. No runtime regression is observed; the zero-introduced-test-failure target remains unmet only for the two cross-lane test-digest guards. Four existing Level 5 inputs remain changed (clinical index/synthetic/timing, domain test-choice-orders); no rebind. All 406 protected files, legacy tuple block and non-N1 acceptances are preserved. No Git, install, network, agents, external message or release.

Handoff: docs/research/question-ship-gate-narrowing-20261105.md. Local exact receipts: .local-dev/question-ship-gate-narrowing-20261105/{validation,failure-attribution,source-preservation,domain-restoration,level-five-inputs}.json. Close this bounded worker milestone; manager/rewrite writer reconciles three authorized test-only capture digests and separately reruns/rebinds in the release tree before acceptance.
