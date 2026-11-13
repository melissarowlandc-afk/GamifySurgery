# Release port38 / rebind38 - compression enablement (2026-11-13)

Release38 validation passes. Against manager base5e7177c4, only the two accepted Main policy files were copied: compression writes are now true, and the policy test asserts true. No gameplay, clinical, codec implementation, cloud implementation or other Main lane was ported. All other changed paths are exact release pin/provenance closure and handoff records. Main stayed read-only.

## Rebind38 versus rebind37

| Measure | Rebind37 | Rebind38 | Delta |
|---|---:|---:|---:|
| Commands | 35,342 | 35,342 | 0 |
| Closing cash, cents | 6,966,492 | 6,966,492 | 0 |
| Completed encounters | 551 | 551 | 0 |
| Walkouts | 0 | 0 | 0 |
| First finish tick | 26,377 | 26,377 | 0 |

The actual native journey and lower helper ran afresh in guarded staging. All nine checkpoints, all three reports, the entire final native save and every native summary number are byte-identical. No checkpoint file was rewritten. Raw checkpoint SHA-256 remains `04587f7d88309ffad208cb39854bd67b7b4aa6a441a0ba4650e514f0333001a3`; final native save `5e4ac495d532fba4cb6ea27a7137d7632ed7adcff3d4d06ed41720fe4efcd189`. No report or number was hand-edited.

Cash reconciles exactly: 1,635,500 + 19,910,900 - 491,339 - 12,842,569 - 1,246,000 = **6,966,492 cents**. Scores remain62.66208410363534 /66.65484360849828 /45.540643592859844; report patient counts52/50/49. All original three-report, best/latest, positive-cash and >20,000-command assertions remain intact.

Pacing **PASS** at26,377: +0.2470355731% against the unchanged manager26,312 reference, within +/-10%. The unchanged CLI reference26,281 also passes (+0.3652829040%). Its independent first-finish proof reports442completions,5,913,995cents and0walkouts.

The two client policy files are outside the Level5 bound-input roots: all629input hashes, including476clinical hashes, are unchanged. Clinical JSON remains `4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f` (1436cases/1644nodes/1142meanings/811rows). No clinical status or approval changed. Compression affects future local storage representation; the canonical native saves retain their exact bytes. No new save-size claim is made here.

Results provenance history33->34 preserves every earlier entry and appends the previous629input hashes. Its new history reason explicitly records that the policy is outside native bindings and the fresh journey is unchanged. The only other results adjustment is the established liveCap metadata correction. Guard, assertions, native driver, legacy fixture, checkpoint file and manager clinical Vitest config remain byte-exact.

## Changed hashes and pin authorization

| Path | Before SHA-256 | After SHA-256 |
|---|---|---|
| `apps/player/src/session/localStorageBuildPolicy.ts` | `75a790d3bda61cbe0d872622c2f4d6d816600e77d887cf27e827dbd450478f4a` | `1cd7ed1d4b696813d5f1344d058b873ba3753a62b1d17fe4c78b36e1cd9dc893` |
| `apps/player/src/session/localStorageBuildPolicy.test.ts` | `43182e07fec29784f909238503d9430faca6e06f082ee24b94d9104f8f99d4ee` | `3eade604c81b73f9796fd130fe4c13280f9c091a31d2e1d5532e7cd878a005a5` |
| `tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-reconciliation-20261113.json` | `3c428083f360020055558d00e846dcc8f658df03ab6dd08c221b5cf0c1ec7ebd` | `0c104c9808449dab325f0e747dd86e2cdcd0bd174463008a5cf67d18f283a742` |
| `tools/qa/level-five-integration-results-20261012.json` | `90e4cb56d75bf20785138c8d99d7172bcb83348048ef1632ca506eea98c9c55c` | `5a1e525607542b5bb2179c440dffbdcccb7e82ed3c4d65badb18322fe62d6f3e` |

The release's existing batch10 source-reconciliation mechanism appends exactly two rows using these release preimages and reason `manager-approved release 38 compression enablement`. Its original11records are preserved. No Main reconciliation records were copied. All four historical captures containing the old policy hashes remain untouched; reconciliation validates exact old text/hash, exact new hash and mutation rejection.

The live results checksum is protected by stats1/stats1-acceptance. Its metadata checksum update requires16pin fixtures and16verifying tests in the existing downstream chain. Every verifier edit is exactly one old-fixture-SHA -> new-fixture-SHA replacement. All20historical source captures, prior authorizations and328required-absence entries (242unique paths) remain strict; no guard/helper/assertion changed and no pin was deleted or broadened.

## Exact validation

All seven workspace suites ran with **CI=true and --pool=threads**: **866files /13,824passed /0failed /1existing skip**. No test failure or timeout required an isolated rerun. The complete Level5 integration file passes36/36 within the full domain run. Focused default-true policy/storage tests pass40/40 across4files, including plain/compressed/mixed journal recovery, local journal compaction/reload and operational dispatch. Focused batch8-11 pin tests pass34/34 across4files; these focused tests are already included in the full-suite counts.

| Workspace | Files | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| clinical-context-workbench | 8 | 43 | 0 | 0 |
| player | 452 | 5541 | 0 | 0 |
| balance-config | 26 | 168 | 0 | 0 |
| clinical-authoring | 7 | 81 | 0 | 0 |
| clinical-content | 145 | 1768 | 0 | 0 |
| clinical-research | 8 | 83 | 0 | 0 |
| game-domain | 220 | 6140 | 0 | 1 |

```text
clinical-context-workbench
 Test Files  8 passed (8)
      Tests  43 passed (43)
   Start at  05:51:01
   Duration  2.00s (transform 797ms, setup 0ms, import 1.81s, tests 730ms, environment 1ms)

player
 Test Files  452 passed (452)
      Tests  5541 passed (5541)
   Start at  05:49:43
   Duration  892.50s (transform 39.70s, setup 0ms, import 1061.88s, tests 2449.55s, environment 35ms)

balance-config
 Test Files  26 passed (26)
      Tests  168 passed (168)
   Start at  05:51:04
   Duration  5.84s (transform 1.50s, setup 0ms, import 6.42s, tests 406ms, environment 3ms)

clinical-authoring
 Test Files  7 passed (7)
      Tests  81 passed (81)
   Start at  05:51:10
   Duration  1.14s (transform 237ms, setup 0ms, import 677ms, tests 545ms, environment 1ms)

clinical-content
 Test Files  145 passed (145)
      Tests  1768 passed (1768)
   Start at  05:49:43
   Duration  251.99s (transform 13.33s, setup 0ms, import 394.41s, tests 89.49s, environment 13ms)

clinical-research
 Test Files  8 passed (8)
      Tests  83 passed (83)
   Start at  05:51:12
   Duration  3.57s (transform 329ms, setup 0ms, import 896ms, tests 1.59s, environment 1ms)

game-domain
 Test Files  220 passed (220)
      Tests  6140 passed | 1 skipped (6141)
   Start at  05:49:43
   Duration  1083.01s (transform 21.60s, setup 0ms, import 601.30s, tests 1540.41s, environment 15ms)
```

Seven workspace typechecks exit0. Boundaries/launcher exit0:

```text
> gamify-surgery@0.0.1 test:boundaries
> node scripts/verify-app-boundaries.mjs && node scripts/verify-launcher-contract.mjs

Verified runtime dependency boundaries and 8072 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

The boundary inventory uses a directly decoded, checksum-verified read-only DIRC inventory; no Git process or index write. Player production build exits0: ✓ 686 modules transformed.; ✓ built in 17.21s. Nonfatal dynamic-import/chunk-size/plugin-timing diagnostics remain. Exact commands, process receipts, log/report hashes and all typecheck output are recorded in `release-port38-validation-20261113.json`; full raw logs remain under `.local-dev/release-port38-20261113/`.

## Complete changed paths

41public paths: two copied policy files, one release-derived reconciliation fixture, one regenerated results metadata file,16pin fixtures,16checksum-only verifier edits and five plan/handoff records. Every non-document before/after hash is in the validationJSON; all final hashes, including the self-listing documents, are in `.local-dev/release-verify/port38-20261113.json`. No checkpoint or e2e spec changed.

- `apps/player/src/session/localStorageBuildPolicy.test.ts`
- `apps/player/src/session/localStorageBuildPolicy.ts`
- `docs/execplans/gs028-stats-ethics-overhaul-20261007.md`
- `docs/execplans/release-port38-20261113.md`
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
- `docs/research/release-port38-20261113.md`
- `docs/research/release-port38-validation-20261113.json`
- `packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts`
- `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-n4-acceptance-20261110.test.ts`
- `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch10-acceptance-20261113.test.ts`
- `packages/clinical-content/src/question-program-batch11-acceptance-20261113.test.ts`
- `packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch4-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts`
- `packages/clinical-content/src/question-program-batch6-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch7-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch8-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-program-batch9-acceptance-20261112.test.ts`
- `packages/clinical-content/src/question-stats1-20261108.test.ts`
- `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts`
- `tools/qa/level-five-integration-results-20261012.json`
- `tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-reconciliation-20261113.json`
- `tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json`
- `tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json`
- `tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json`
- `tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json`
- `tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json`
- `tools/question-quality/fixtures/question-stats1-acceptance-release-source-pins-20261108.json`
- `tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json`

## Remaining risk and handoff

No failing assertion remains; one existing domain test is skipped. Rollback must retain the dialect-aware reader (release36 or later) so compressed and mixed local rows remain readable. Browser/physical-phone benchmarking and owner storage were not accessed in this worker turn. No opening URL, origin or storage identity changed. Work stays uncommitted for manager review; no Git, installs, network, agents, commit, push or deploy was performed.
