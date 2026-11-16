# Release port 39 / rebind 39 - cloud opening (2026-11-15)

Port 39 passes release-tree validation against manager base `2f0b5e4d`. Only the 35 directed public paths were ported: initial engine-view reuse, codec-side learning checkpoint preparation, suppression of premature journal warming, compare-before-encode and immutable-head download reuse; plus ready-gated delivery, deduplicated receipt controls and receipt-gated re-posts for both workers. Receipt controls remain transport-only. Save meaning, verification, durability, operation ordering and application acknowledgements retain their existing checks.

No clinical, game-domain, balance, renderer, question-pilot, DB/RPC or save-format work was ported. Compression writes stay **true**, byte-exact to release 38. Main was read-only. Its current-thread handoff was explicitly excluded; the release's own handoff is appended independently.

## Content diff and hunk ports

The 36-path manifest resolves to **35 accepted paths** plus the excluded Main handoff: **10 edited files copied, 12 new files copied, 13 files hunk-ported**. Main's accepted raw hashes were checked before writing. Every ported source postimage equals its accepted Main source after UTF-8/no-BOM/LF normalization. Source before/after/accepted-raw/accepted-LF hashes are recorded per path in the validationJSON and release dispositions.

All 13 raw baseline mismatches were CRLF versus LF only. Each had identical normalized content to the captured worker baseline. Exact normalized cumulative perf hunks were applied at their checked preimage positions, and each complete result was checked against the accepted normalized Main hash. No semantic mixed-lane baseline difference or manual gameplay hunk was found. Hunk-level ports:

- `apps/player/src/App.tsx`
- `apps/player/src/session/cloud/codecTasks.ts`
- `apps/player/src/session/cloud/codecWorker.test.ts`
- `apps/player/src/session/cloud/codecWorker.ts`
- `apps/player/src/session/cloud/coordinator.ts`
- `apps/player/src/session/cloud/gameSession.test.tsx`
- `apps/player/src/session/cloud/gameSession.ts`
- `apps/player/src/session/cloud/journalCodec.ts`
- `apps/player/src/session/cloud/operationalEngine.worker.ts`
- `apps/player/src/session/cloud/operationalEngineClient.ts`
- `apps/player/src/session/cloud/operationalEngineProtocol.ts`
- `apps/player/src/session/cloud/operationalSessionEngine.ts`
- `scripts/qa/phone-runtime-budget.mjs`

The authorized manifest, normalized patches and captured public-source baselines were read in place; those private files were not copied. No owner input or private identifier was read, imported or reused. Only authorized public source path/hash metadata was extracted. The accepted Main ExecPlan is copied as a historical worker report; its Main-tree timing/count tables are not claimed as release measurements. Release results below are independent.

## Rebind 39 versus rebind 38

| Measure | Rebind 38 | Rebind 39 | Delta |
|---|---:|---:|---:|
| Commands | 35,342 | 35,342 | 0 |
| Closing cash, cents | 6,966,492 | 6,966,492 | 0 |
| Completed encounters | 551 | 551 | 0 |
| Walkouts | 0 | 0 | 0 |
| First finish tick | 26,377 | 26,377 | 0 |

The actual native journey and lower helper ran from scratch in guarded staging with the original seed and funded Level 4 opening. Every native result field, all **nine checkpoints**, all **three reports**, and the entire final native save are byte-identical to release 38. No checkpoint was rewritten. The immutable first, higher best and lower latest reports remain exact: scores 62.66208410363534 / 66.65484360849828 / 45.540643592859844; scored patient counts 52/50/49. All original assertions remain, including >20,000 commands, positive cash, supplier savings and retirement.

Cash reconciles: **1,635,500 + 19,910,900 - 491,339 - 12,842,569 - 1,246,000 = 6,966,492 cents**. Independent pacing **PASS** at 26,377 versus the unchanged **26,281 +/-10%** reference (+0.365282904%). Its first-finish state has 442 completions, 5,913,995 cents and 0 walkouts.

All **629 bound inputs** and **476 clinical hashes** are unchanged. The port is outside the native bound roots. Clinical JSON remains `4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f`: 1,436 cases / 1,644 nodes / 1,142 meanings / 811 manifest rows. No clinical status or approval changed. The integration guard, native drivers, legacy fixture and manager clinical Vitest config remain byte-exact.

Only results provenance was rewritten: history **34->35** preserves every earlier entry and appends the previous 629 hashes. Apart from this append, only the established liveCap metadata correction is applied. Results SHA-256 **`5a1e525607542b5bb2179c440dffbdcccb7e82ed3c4d65badb18322fe62d6f3e` -> `a24afb1cb5e7ef5ab589834ae3cf391fd08312157b983e91170da930717f073e`**. Checkpoints remain `04587f7d88309ffad208cb39854bd67b7b4aa6a441a0ba4650e514f0333001a3`; final native save remains `5e4ac495d532fba4cb6ea27a7137d7632ed7adcff3d4d06ed41720fe4efcd189`.

## Protected-source reconciliation

Used only the release's existing pin mechanism, with reason **`manager-approved release 39 cloud-opening fix`** and actual release preimages. No Main reconciliation record was copied. The batch10 reconciliation fixture itself is unchanged, preserving all 13 records from release 38.

Exact source/result checksum closure changes **17 pin fixtures and 17 verifying tests**. Three old guards each add **eight exact already-captured source-path pins** that previously matched their immutable capture. Their strict lengths increase rather than skipping any path: 116->124 in packages/clinical-content/src/question-flags3-20261107.test.ts; 118->126 in packages/clinical-content/src/question-stats1-20261108.test.ts; 157->165 in packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts. Every verifying test differs only in its fixture checksum and, for those three, its exact path count. No assertion or helper is deleted or weakened.

All 20 historical captures, previous authorization prefixes and existing pin paths remain intact. All 328 required-absence entries (242 unique paths) remain strict. No protected source path is changed to an allow-list/absence/null. These invariants and the complete postimages are verified by the release-generated provenance receipt.

## Exact validation

All seven suites ran with **CI=true / --pool=threads**: **873 files / 13,875 passed / 0 failed / 1 existing skip**. Relative to release 38: +7 files / +51 passed, with no added failure or skip. The full Level 5 integration file passes **36/36** within game-domain. Focused opening/delivery: **32 files / 294 passed / 0 failed**, already included in the full totals. No failure or timeout required an isolated rerun.

| Workspace | Files | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| clinical-context-workbench | 8 | 43 | 0 | 0 |
| player | 459 | 5592 | 0 | 0 |
| balance-config | 26 | 168 | 0 | 0 |
| clinical-authoring | 7 | 81 | 0 | 0 |
| clinical-content | 145 | 1768 | 0 | 0 |
| clinical-research | 8 | 83 | 0 | 0 |
| game-domain | 220 | 6140 | 0 | 1 |

```text
Focused opening/delivery
 Test Files  32 passed (32)
      Tests  294 passed (294)
   Start at  18:55:00
   Duration  137.31s (transform 37.02s, setup 0ms, import 120.32s, tests 421.27s, environment 2ms)

clinical-context-workbench
 Test Files  8 passed (8)
      Tests  43 passed (43)
   Start at  19:01:22
   Duration  985ms (transform 276ms, setup 0ms, import 797ms, tests 411ms, environment 1ms)

player
 Test Files  459 passed (459)
      Tests  5592 passed (5592)
   Start at  19:05:11
   Duration  911.84s (transform 49.85s, setup 0ms, import 1101.82s, tests 2484.79s, environment 39ms)

balance-config
 Test Files  26 passed (26)
      Tests  168 passed (168)
   Start at  19:01:23
   Duration  2.28s (transform 514ms, setup 0ms, import 2.33s, tests 170ms, environment 1ms)

clinical-authoring
 Test Files  7 passed (7)
      Tests  81 passed (81)
   Start at  19:01:26
   Duration  664ms (transform 134ms, setup 0ms, import 376ms, tests 312ms, environment 0ms)

clinical-content
 Test Files  145 passed (145)
      Tests  1768 passed (1768)
   Start at  19:05:11
   Duration  250.26s (transform 16.23s, setup 0ms, import 391.55s, tests 88.91s, environment 11ms)

clinical-research
 Test Files  8 passed (8)
      Tests  83 passed (83)
   Start at  19:01:27
   Duration  3.25s (transform 186ms, setup 0ms, import 526ms, tests 2.11s, environment 0ms)

game-domain
 Test Files  220 passed (220)
      Tests  6140 passed | 1 skipped (6141)
   Start at  19:05:11
   Duration  1074.36s (transform 24.46s, setup 0ms, import 592.01s, tests 1533.34s, environment 15ms)
```

Final seven workspace typechecks exit 0. Boundaries/launcher exit 0:

```text
> gamify-surgery@0.0.1 test:boundaries
> node scripts/verify-app-boundaries.mjs && node scripts/verify-launcher-contract.mjs

Verified runtime dependency boundaries and 8075 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

The inventory is decoded directly from the checksum-verified read-only worktree index; no Git process or index write. Player production build exits 0: ✓ 688 modules transformed.; ✓ built in 10.31s. The existing nonfatal chunk-size/plugin-timing diagnostics remain. Full commands, UTC receipts, exact typecheck output and raw log/report hashes are in `release-port39-validation-20261115.json`; local logs/staging are under `.local-dev/release-port39-20261115/`.

The single skipped domain assertion is the pre-existing full 26,710-command pre-refactor oracle in `game-evidence-incremental.test.ts`. Its name/status match release 38 exactly; the current actual 35,342-command rebind and all 36 Level 5 assertions pass.

## Complete changed paths and hashes

**75 public paths**: 35 accepted Main paths, 17 release pin fixtures, 17 verifying tests, one results metadata artifact and five release plan/handoff records. No checkpoint, E2E spec, dependency, migration or .github path changed. Final hashes for the five self-listing handoff documents are stored independently in `.local-dev/release-verify/port39-20261115.json` to avoid a hash cycle; every other hash is below and in the public validationJSON.

| Path | Disposition | Before SHA-256 | After SHA-256 |
|---|---|---|---|
| `apps/player/src/App.tsx` | hunk-ported | `d4ace4f1e426fa35e2e163a000b1fa8e66750ca5e8f8de15f999d45ff27bb339` | `b56581934974bfb6480cf6df76978302afd58b47d861eb977a14c1edb2202f47` |
| `apps/player/src/session/cloud/automaticResolution.ts` | copied | `2e595961c2addb5ab6458d8ed7578650d65045a99f4166530f2690e9c8f1bb4d` | `62d2eda2f21c43cf128eddf16ec078a2e374c9cda83bd0952a549f542b01d236` |
| `apps/player/src/session/cloud/codecTasks.ts` | hunk-ported | `ff7fe45eb06a159cefeb107b0e6560caa6035fcfea95481dca5a6d97ca4cb2b7` | `3a25e8c88e4fe85371c00046f41a2a298fb6bfe82e8abdfa6f703fd105a3210c` |
| `apps/player/src/session/cloud/codecWorker.test.ts` | hunk-ported | `a7fdef005f3396f6e03b721fe9620b34826f39b895d0dd1ffeec1aa753ddc499` | `fb2c9c251b8b63354fb69b935e1d3cd4ef7af6be2d483da910d53874974bd4b3` |
| `apps/player/src/session/cloud/codecWorker.ts` | hunk-ported | `6104f53de8764a101686ace17dd6ccdfa1afaff2952af927c63a888e6dd9e855` | `2897b8b423281f384456b34e337c34a3e6bedfd570f3ea04c07458a4ad745739` |
| `apps/player/src/session/cloud/codecWorkerDelivery.test.ts` | copied-new | New file | `d6a8bb2edfe7903fa127d220917610c2086566264cb4ed730a1c5bc023c00c92` |
| `apps/player/src/session/cloud/codecWorkerMessageTestSupport.ts` | copied | `854372f73d4a8fe7ae994c98bb72c26f169e22c880943b883797c40124746bfd` | `c2fc1d9668b6b79af63755c14254e128ab26cd23bd71b6e18645667773c9a884` |
| `apps/player/src/session/cloud/codecWorkerQueue.test.ts` | copied | `0513799023ec7360129c27cdf99293f2c73042974a65b3cc2f09d579d37cde5e` | `306e72d9933de5151a73e0194e93f6b4a20844d82acc30f055078a63ea164e67` |
| `apps/player/src/session/cloud/codecWorkerTestSupport.ts` | copied | `e4e42494b1f7ef521de61f564315ed852612b60e80fdf7e66e13a1ad713bfe2e` | `dba57be605d35fcd054d9965794ddcd831c8c4f71a87bf6dd57df79e36abd668` |
| `apps/player/src/session/cloud/coordinator.ts` | hunk-ported | `890f6e5f66b5c90eabf6ea0cf1e506d7d56c6f95d76d4e53ec76f014eff548ae` | `c1be50ac3b97e1a989184e4ec3b2709e72d3539c9c5b67cfb24d216d1ca3f40a` |
| `apps/player/src/session/cloud/gameSession.test.tsx` | hunk-ported | `30359b5246fad657539a2d83d4c9dc3f08a644e833b9d48bb06046c9d4d9545d` | `85c702bd602c53255b50a49dce4a55c04a22d54b371c1423d7e56e85112a30b9` |
| `apps/player/src/session/cloud/gameSession.ts` | hunk-ported | `ab164599f835016830a4acb0f9da37ddd22bed923d82d8d680b59a24b7b184fa` | `30967a06ea156ac0a177a7157e8ecc95cfde5b26a391c25ab91b1a8d63363502` |
| `apps/player/src/session/cloud/journalCodec.ts` | hunk-ported | `b8913691c85fb64802be392a33b9763c82c5dd5181396efd46ed6fdca751da4d` | `0637f421df9f72e7bd8399aacc0bb2c69c49c478e43404013a2805b20bd1bf9b` |
| `apps/player/src/session/cloud/journalOpeningComparison.test.ts` | copied-new | New file | `af4aba31cf4287d90cfa5dbf5fd440546690e5d958a6d8c60fafea9f2cd59678` |
| `apps/player/src/session/cloud/openingCopyReuse.test.ts` | copied-new | New file | `00b8c748d88f6c716d81bdaaf2c203b6871701d1df275076234f31792d7ec367` |
| `apps/player/src/session/cloud/openingPerformance.test.ts` | copied-new | New file | `97e824764112780c908dd146deae3f071391c36d4d1ce21a68768fa00f318e38` |
| `apps/player/src/session/cloud/openingPerformanceTestSupport.ts` | copied-new | New file | `269140663e24a2786b88e6519a11cf43ecc1c8134528a5f2ea31cec0b266987c` |
| `apps/player/src/session/cloud/openingProjection.test.ts` | copied-new | New file | `35161a8d1d8c7d2747b18dc53006e5b832b9ca064d5713aa75bcd88cb7c089f9` |
| `apps/player/src/session/cloud/openingProjection.ts` | copied-new | New file | `a0d838b7aed615d80a69b65bc5516f2060aa02f979bc89cffab93e26a9132fc2` |
| `apps/player/src/session/cloud/operationalEngine.nativeWorker.testSupport.mjs` | copied | `ae1fc8239b20839046c6165da2f5d5960f054bde7f04a5df7be9b79e1009e2d7` | `ddd63286b24a0a82c9043a03f382d0fd65de977ef69cf9115b6341e427eb392d` |
| `apps/player/src/session/cloud/operationalEngine.worker.ts` | hunk-ported | `5ac9ac352994a4d20e89f3dfc29f0c3196955f2bc3291e61a58c3b033206dc9d` | `162ff88648a74f784dde496f7e6f7393fb74dfe90ad6e8563c0cb356dd8f147c` |
| `apps/player/src/session/cloud/operationalEngineClient.test.ts` | copied | `b308bb7f158b0420455863ac7b0652a56d76643f48d47b7c62a8bdfa6cc15f45` | `82150fc9c5d38002a770580729b32377c0ef4b53afc818dbf0e3c4116eea9612` |
| `apps/player/src/session/cloud/operationalEngineClient.ts` | hunk-ported | `e7a0b072311889db9567b70562a0fc8ab1853a15515d8261352219e491a418c4` | `9b1610cb2045d6d0af291e40097027e1683c5124d9c96695cae1d4e1500c3719` |
| `apps/player/src/session/cloud/operationalEngineDelivery.test.ts` | copied-new | New file | `70f259ff3621dc111a4affcd65b573c6f0e7977d3724593c637c39483b5edc73` |
| `apps/player/src/session/cloud/operationalEngineMemory.test.ts` | copied | `544320fecf72b4b8c2466e63a098b594b84c7b98fc4769d4ebda3e80869436ab` | `618516b5ee000c7d8c94f36467eeac977a3f7db55d9fd4171b86bb0b4a96c305` |
| `apps/player/src/session/cloud/operationalEngineNativeTestSupport.ts` | copied | `d4c048d630e3fa987a1af86f90ec7f780407bd022f1374d7fec391eac0d7e695` | `7d5129a3be19d8135b8f6f89c63c22301ea9dbabf5323e6cdd8b39e7d12edc4f` |
| `apps/player/src/session/cloud/operationalEngineProtocol.ts` | hunk-ported | `7f03a75c46a382aad69baa670692022eeda2db52f90951351be7f09da2a77843` | `d15890f2c64ddb1d79633f3ed5dbd7c0efc9d23ef1ca6d925e8b6f0c8abf2f73` |
| `apps/player/src/session/cloud/operationalSessionEngine.ts` | hunk-ported | `8caf8c2fb137f3629d54488fe32cec5b276916aad8ee30ddf78b51ede1545e16` | `c9ac98b4f4384deba770c96cbf0e19dfd10bb64d105cf3292ba1afe47826f4c7` |
| `apps/player/src/session/cloud/operationalSessionTestSupport.ts` | copied | `a4dc940bf907e524ad002401d732ceed069c13a1318fc0ec0e7772a905dc565e` | `4adb31f9e3d720b998b6669090d8aa9e5a01c13950c617f2ae4477038d692356` |
| `apps/player/src/session/cloud/playableHydration.test.ts` | copied-new | New file | `b9e277d407e75d778c51d80ee2af743e85a8eb784e55c2714e9c331adaa9cc99` |
| `apps/player/src/session/cloud/verifiedCopyCache.ts` | copied | `0b46e358705008b5c63493cc46e38b3abe59edb79f196e652c54a8ea2dc52fad` | `5c5b52def4d923ea95d2145255051f14e8214aca0fe3051c35a68118157802b1` |
| `apps/player/src/session/cloud/workerDelivery.ts` | copied-new | New file | `ff925229783a34c9f372916a8bcb81177aa961f06ede85d4a89f9f3cf5158f08` |
| `apps/player/src/session/cloud/workerDeliveryLossTestSupport.ts` | copied-new | New file | `a04a845db38135f5b514a913c43ceb6ffab87eaaf5e7848aa91ddf27aa627b70` |
| `docs/execplans/cloud-open-perf-20261115.md` | copied-new | New file | `05dc929ff6476d463a34c6b99949ce069c49db17aadea629953d59288b4fdf23` |
| `docs/execplans/gs028-stats-ethics-overhaul-20261007.md` | release-handoff | `f84cd5911c772b496a9e864a60f9e5e3828694755a92b2ef234ad96b823d62a8` | Final independent receipt |
| `docs/execplans/release-port39-20261115.md` | release-handoff | New file | Final independent receipt |
| `docs/handoffs/CURRENT_THREAD_HANDOFF.md` | release-handoff | `9d2aecb163886270c17e40864113b4e4caf12db286f33e4953ec141460293909` | Final independent receipt |
| `docs/research/release-port39-20261115.md` | release-handoff | New file | Final independent receipt |
| `docs/research/release-port39-validation-20261115.json` | release-handoff | New file | Final independent receipt |
| `packages/clinical-content/src/question-flags3-20261107.test.ts` | release-authorized-pin-delta | `3459c38348e7a322df3d43f0c7b3957c611328efe85570e0d3987d25c143f42b` | `c13411e51403e4278f38b125518e9fa348b71a502d7efe59f4ff223ac52c1347` |
| `packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts` | release-authorized-pin-delta | `8df8f7c26132643fab66dcf66daa24133ee3a6314a1f76d98a0377fe9d40010f` | `35106fbaf9f8bab8c2c921c3ae2b7f6bebbb5a768511eaf40bf3fb82b9439ae7` |
| `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts` | release-authorized-pin-delta | `fe28a355ac8e9cb41eccb7d440746683ae6d45a2ba6074b41343b9b1f3258609` | `1dd4bedffbc8e22a948594038e7b01c45a0b189acf7329d4eebf5f3ce4551445` |
| `packages/clinical-content/src/question-n4-acceptance-20261110.test.ts` | release-authorized-pin-delta | `0a59d2e7442bb7573875ef2103c5c3b7bee0322d84b430785da8b556d97e13aa` | `e5d8beaf3131bdb71c6cfbca31cf73dc4325136ce546235df1f9cd2546a79e71` |
| `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts` | release-authorized-pin-delta | `8aa640c35293d3db33661a137bc0e0cf69a8e7e747ad918b49e5631d0cd51170` | `4e45dcfc4db7e7331ab40596821eb9c48faa17462f35e5867a9754218a24545d` |
| `packages/clinical-content/src/question-program-batch10-acceptance-20261113.test.ts` | release-authorized-pin-delta | `a1c9593a0aef177bbb87fa59708ae8376cdc7eb916f7810305960516ceb5ca24` | `3413d8113deafa226b7d183dda620323c4f5d5ec3f6887b4eb88158e18056960` |
| `packages/clinical-content/src/question-program-batch11-acceptance-20261113.test.ts` | release-authorized-pin-delta | `923979623be9b10a73b7fbf72fa6156b54cf528bf9b55307b06e782fd549c0f4` | `467b5a0e4fbb72cb0b7de0d7375662e7f9da830df811bf91672e939e97dc9dff` |
| `packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts` | release-authorized-pin-delta | `b9d3df702390495e748b1f9bf9eaa2ce367c4471eb5287e5abef30a2d06688c5` | `8b00aea6de1c268e92f7741d9a42ce4cf9b606ee44c05d2ebd7b8c16adc8bbbb` |
| `packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts` | release-authorized-pin-delta | `4e01c47678f2d36b01d259252df89264265287c5cd1f490e661d70d7b2e21e82` | `0b6f0fc302e71d8c806d192e0bc3cd6f49df5f9f0ed66afbbf25f51f46071a61` |
| `packages/clinical-content/src/question-program-batch4-acceptance-20261111.test.ts` | release-authorized-pin-delta | `dd1e055901d83a6849fa8d86fe2eb349e1d3278b367304f85e3d0f3585e6a590` | `cbef00149d050b466f684c0200aca4e40e38b8e40d55b024d8c45f5ffcb96054` |
| `packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts` | release-authorized-pin-delta | `0837a5f4b2a237e3bfdc974c614b5967a8dcef2368de912f9f15e34950dc01e4` | `97ec0acaee1545ac74051aa08f00a3a7186cdff73aa4d6f189a833eb6b7299ce` |
| `packages/clinical-content/src/question-program-batch6-acceptance-20261112.test.ts` | release-authorized-pin-delta | `12e7f3dfeee87e9d61e564fd304f770f0ef09a2ab788810b4fa6145cf69492d3` | `040bf6413f1d717ab46d7942c3614c55f8a4db9555e7f66c32eac1505d0de022` |
| `packages/clinical-content/src/question-program-batch7-acceptance-20261112.test.ts` | release-authorized-pin-delta | `e1c1cded74183516d5dc4628e88dc8b6097da443c797b18eae9b225a7830f9d0` | `680b0e29332f57b74977a1768a8a4998dfb9ec8dccf34b584ff5878a619e8aa3` |
| `packages/clinical-content/src/question-program-batch8-acceptance-20261112.test.ts` | release-authorized-pin-delta | `9e37b73ed66b7b34cc0a4126509772521e239300c945028775097ed03b9f2c2e` | `070835d2603461642e346730e7336450b43280e2bcd9aeec4af401d722e6423b` |
| `packages/clinical-content/src/question-program-batch9-acceptance-20261112.test.ts` | release-authorized-pin-delta | `6ff58d817d4d8ffe6eea200345dd273f7812b097be484cd0e66bc2cd3e0a4d61` | `da0213cee9097466926b596fa79e41a10665dc3f39e52f6c0ff6c3cdd2d62a89` |
| `packages/clinical-content/src/question-stats1-20261108.test.ts` | release-authorized-pin-delta | `e0ac19156c8b1533f0c08d4af1c63a023229ba441115537920d151a523df05b4` | `228d29c11299f7e495fdbcc0e17b0d85dcd35a8bfebee4f2d6e52ce68bf3cebf` |
| `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts` | release-authorized-pin-delta | `72de246ee5728aea2bd8dabfa5b50dfa7310925fea2b77a03e696cac8850adad` | `8f612ed21dd9024337f7d9e926ba6587e0d5eb3c980aabe57d2b2299f86eb1ca` |
| `scripts/qa/phone-runtime-budget.mjs` | hunk-ported | `98834ec93801fbdeb773730a99e402c942d3557f8456e38e148d930deeb84597` | `8801d585211b66d11f5ae3725a6fced7dbc2b9d498743056593a64ba578003fb` |
| `tools/qa/level-five-integration-results-20261012.json` | regenerated-evidence-metadata | `5a1e525607542b5bb2179c440dffbdcccb7e82ed3c4d65badb18322fe62d6f3e` | `a24afb1cb5e7ef5ab589834ae3cf391fd08312157b983e91170da930717f073e` |
| `tools/question-quality/fixtures/question-flags3-release-source-pins-20261107.json` | release-authorized-pin-delta | `ef730316e21b8a42d60f18d82ec91150ad19e5b28bd88fa3c34205c2fe3fb0fb` | `d6bbb3935bbd967f37223349be85f9ab6abc2d081ee0729af5f01ffaeebae384` |
| `tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json` | release-authorized-pin-delta | `d453e5d71523b4a1f4cf27970b735a18e87bbd0d59d846b26887a2ef339578ef` | `ee2d4f503de534fa3fcb1154a5bc145e0a0d4084db13d70a98be9d378a47a365` |
| `tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json` | release-authorized-pin-delta | `7224fe03758fd87c736dcbe7313a34565051ce3964314d2db23cce242b170060` | `bee810854ba8f962a2b4c0bc344db73a79c81fafd809a20705cec6a0aa96f30f` |
| `tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json` | release-authorized-pin-delta | `793147581f90f5dd6e5f9da4903e767ffdefc270dafa38d9439e6d84539bfd3a` | `da9378dbdeb429a6add0186679e61526f96de8db73482965c53e9a5922b86840` |
| `tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json` | release-authorized-pin-delta | `7f853d30210c4b20e5fc960124897adca10e6186968b2e5d7d717ac1b22e656b` | `d153a41829f0a93a734edf4ebcccf3669432cd4c2306ec376270314a5e092570` |
| `tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json` | release-authorized-pin-delta | `eae07c97b9a0a220841cf2df6268f4027f15b37d34867a1c260065b67caf8252` | `74453b1c5d6e942b2edd85cc82c6489be51ed5a48373cc2bf33835307ec93525` |
| `tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json` | release-authorized-pin-delta | `50bb93bd24e284cd9c3390bc3836ab0bef998014b506c2aa63e0fe9ddd7559fa` | `cea4a41194edd9d6cf76017d2d467a3bf31f47ccf14924e5be642fb5e2d6b617` |
| `tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json` | release-authorized-pin-delta | `64f70cb144ae571622dfafc63e362658f3cb413dcc76301ca783e34e90617f29` | `3003726c46c02da79f20c6e000e9ede28246282f829d437a140ef7bf46a713df` |
| `tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json` | release-authorized-pin-delta | `b275a5fd889105c945be82f9f6874fde8e4e768749a8668a7f86067f387aacac` | `bcbe882b081a5d157140b225b3e5693b0e55a038ee20fd0ac023eebe801edb9b` |
| `tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json` | release-authorized-pin-delta | `18eca91ef66837845c2d57ee5ea5c0fd47570d44019a5f3df11dad86cbbe8d14` | `5f326a7dc3988748057cc2a66045b8edef974e2b06a031958b4eeeeeed1c6be9` |
| `tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json` | release-authorized-pin-delta | `73567a7901c07120bba04793541e5ec1c40c36151b9f29897fa37c5ddce7c1c0` | `e36884361dc29c1f0347e3b2b7e6ad1b96d1ff55e8fcb212a54702a68aefba43` |
| `tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json` | release-authorized-pin-delta | `33f2ef9b2254b42afed527a4de90784207378b1cd1ef2c263cb529207a3711d1` | `74eea18c757c7370ef75d6dcb317213b302716fafc789f0c93681ab328cdd645` |
| `tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json` | release-authorized-pin-delta | `0c2a964063263486dcb06e024947ffe866e29d369eb7384271490d350d75b041` | `930291a4b26370bac3f7d1b9f4e3785ecdb696d54fb2cc47b0c5a9361dbf35dd` |
| `tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json` | release-authorized-pin-delta | `210d877afbabcc2877bfe254405776089c36ba6d7413114ec1903d2cc58b822b` | `81706fd14e8e94fe4c66d9105366ff0c3ef7ca0359f129f425b593408edc1c80` |
| `tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json` | release-authorized-pin-delta | `99ffc3767aa77415d05acf93441908cbea6627f02078f6c7441a39bc1931b0cd` | `fcd7a7339f845d3de910a974d9ee00b8495484de4e2c32abf73a836bd2b8f036` |
| `tools/question-quality/fixtures/question-stats1-acceptance-release-source-pins-20261108.json` | release-authorized-pin-delta | `d0d82329ec67643d4cc2eeb6c46f9a9867942f174b79a7dfd299f50e856d457c` | `5b3a4494a8b4dd98d8246f5de7fd9f4be7925a800b50496446fe634fe605dda9` |
| `tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json` | release-authorized-pin-delta | `3eb1b54647c4f370774f20da14692e80e2b230e44420cd9ccfe424e46c3b6189` | `f639822cfade97c389e901a73d6bf883e6fa8fa698feb9403c1fc450c2117528` |

## Remaining risk and state

No failing assertion remains. Physical iPhone/PWA/WebKit opening and the reported device stall were not reproduced or measured in this worker turn; deterministic loss/duplicate/ready tests, actual native workers and production compilation pass. Manager device/browser acceptance remains the concrete follow-up. No new phone timing claim is made. Existing skip and nonfatal build diagnostics remain.

No owner save, browser storage, opening URL or origin was accessed or changed. Work remains uncommitted for manager review. No Git process/write, commit, push, install, external network/live DB, agent or deployment was performed.
