# Release port 40 - follow-up 3 final handoff (2026-11-16)

**PASS: 884 files /13,941 passed /zero failures /one unchanged existing skip.** All seven CI/thread suites, seven typechecks, boundaries, player build and the touched e2e specs' typecheck pass. Pacing ran alone last and passes at26,377 against unchanged26,281+/-10%. All earlier port40 work is retained.

## Applied chair-fix verification

The manager applied four accepted app/test patch sections. Every hunk reconstructs exactly over the prior release preimage. `phoneArt.ts`, `reducedTextureSource.ts` and the initial geometry-test copy are byte-identical to the frozen Main postimages. `FacilityScene.ts` differs from Main only because of the pre-existing release baseline; exact hunk matches occur at offsets **-71/-63/-3**. There is **no offset-related content error**, no whole-scene Main copy and no unreviewed character-room QA feature.

| Path | Frozen Main post SHA-256 | Final release SHA-256 |
|---|---|---|
| `apps/player/src/facility/FacilityScene.ts` | `69683bbe72885a238e14c3ee7d7d0360a431cdd5743ba232e37b6970eb5a168e` | `0de1f13e819b47560d31de924be53b8a48b27383200398f9090286c0edcd3968` |
| `apps/player/src/facility/textureWorldGeometry.test.ts` | `bb1f2fc86c108497a763636fad9ad0d922fbbf8e03cff2d941e3910237cec372` | `d5b348b6c757dc8134f3423923b084f8c2f002b7181dd2c56395f40864d3746e` |
| `apps/player/src/mobile/performance/phoneArt.ts` | `82de5f0b5248e6382608c5cfa56d7fadf4c74f405dd4c0dbad7419c6d0e9d351` | `82de5f0b5248e6382608c5cfa56d7fadf4c74f405dd4c0dbad7419c6d0e9d351` |
| `apps/player/src/mobile/performance/reducedTextureSource.ts` | `176c8fdecaa9f7ba4d80998db6eb741c8889f92013c5868fafa606576309740b` | `176c8fdecaa9f7ba4d80998db6eb741c8889f92013c5868fafa606576309740b` |

The new accepted test initially imported `characterRoomQaModel`, which is part of the excluded QA lane. Focused collection and the first typecheck therefore failed with a missing-module error. The release adapter replaces only that import and its one appearance factory call with the **identical typed synthetic descriptor** for `gs022-new-employee-015`; it imports no additional module or asset. All seven geometry test bodies, loops, sources, size/depth/origin assertions and tolerances remain unchanged. The direct Main test hash before adaptation is preserved above and in the compatibility receipt. Public focused output: **2files/11passed**, including all seven native Phaser geometry checks and four reduced-source checks. The full player run repeats them successfully.

Only the accepted `Release 40 follow-up: reduced texture geometry` section was appended to the release's phone-play ExecPlan. Main's handoff was not copied. The manager's two e2e edits are retained exactly: legacy capacity remains locally playable with a non-blocking status, and reduced-phone actor-window object creation is bounded while desktop creation/world redraws remain zero. Their compilation passes; no browser/storage was opened by this worker. The manager reports 301/303 owner-copy texture sizes matching desktop, with two tiny rounding differences. That browser observation is manager evidence, not a worker measurement or copied owner fixture.

## Guarded native rebind

Fresh actual native journey and lower helper reproduce the prior reviewed port40 **byte-for-byte**: all nine checkpoint bodies, all three reports, every native summary number and the full final native save. All41sampled command/gameplay/card/lifetime-count/financial projections and raw byte sizes are identical. Command SHA remains `43b445231a9fb51c6847e425043d434c15ef4985931e949869320dc05362b2a3`.

| Measure | Prior reviewed40 | Follow-up3 |
|---|---:|---:|
| Commands | 35,342 | 35,342 |
| Closing cash, cents | 6,966,492 | 6,966,492 |
| Completed encounters | 551 | 551 |
| Walkouts | 0 | 0 |
| First finish tick | 26,377 | 26,377 |

Cash reconciles: **1,635,500 + 19,910,900 - 491,339 - 12,842,569 - 1,246,000 = 6,966,492 cents**. Scores remain62.66208410363534 /66.65484360849828 /45.540643592859844, with52/50/49qualifying patients. All634bound inputs and476clinical hashes are unchanged. The clinical JSON remains `4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f`; no clinical content/approval, gameplay, balance, save, progression or art asset changed in this follow-up. Guard, drivers, frozen legacy evidence, compression writes (true) and clinical Vitest config are unchanged.

Results SHA: `a2544240658fa29798754489790fa35cad195c5dbd84736af5d0b8e52a59474f` -> `bba4aeb60bb5a0a6dce240b83ed10b26dd31e48fb43f1fed1f4c66e4c487d0c8`. Only inputHistory **37->38** and the established liveCap metadata correction are published. Every prior entry is retained and the previous634input hashes are appended. The checkpoint file is **not rewritten**, SHA `69d25d4468e3e36183aea32f7f75781ffd3c095f9c15cb6ad475c8c08473a56c`. Raw results/progress/checkpoint artifacts are exactly the prior hashes. The earlier port40 compaction differences versus release39 remain; this chair follow-up introduces no new save or simulation difference. All36Level5 guard/assertion tests pass in the full domain suite.

## Protected-source reconciliation

Reason: `manager-approved release 40 reduced-mode furniture scale fix`. None of the four app/test paths, the ExecPlan section or the two e2e specs is an active protected-source hash row requiring a direct delta. The results metadata change propagates through **16 pin fixtures and16verifying checksum literals**, using release preimages. No new source path pin or relaxed count is introduced. All20immutable source captures, every authorization-history prefix,58earlier exact port40 pin additions and all322required absence entries remain intact. Guard counts stay140/142/181/32. No Main reconciliation record is copied; no protected-source guard or geometry assertion is deleted or weakened.

## Exact validation

All seven suites use CI=true and --pool=threads:

| Workspace | Files | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
| clinical-context-workbench | 8 | 43 | 0 | 0 |
| player | 468 | 5,647 | 0 | 0 |
| balance-config | 26 | 168 | 0 | 0 |
| clinical-authoring | 7 | 81 | 0 | 0 |
| clinical-content | 145 | 1,768 | 0 | 0 |
| clinical-research | 8 | 83 | 0 | 0 |
| game-domain | 222 | 6,151 | 0 | 1 |

```text
clinical-context-workbench
 Test Files  8 passed (8)
      Tests  43 passed (43)
   Start at  13:06:17
   Duration  2.49s (transform 971ms, setup 0ms, import 2.14s, tests 1.32s, environment 1ms)

player
 Test Files  468 passed (468)
      Tests  5647 passed (5647)
   Start at  13:06:17
   Duration  1355.12s (transform 70.45s, setup 0ms, import 1578.90s, tests 3753.43s, environment 59ms)

balance-config
 Test Files  26 passed (26)
      Tests  168 passed (168)
   Start at  13:06:21
   Duration  5.00s (transform 1.10s, setup 0ms, import 4.89s, tests 357ms, environment 7ms)

clinical-authoring
 Test Files  7 passed (7)
      Tests  81 passed (81)
   Start at  13:06:26
   Duration  1.60s (transform 308ms, setup 0ms, import 963ms, tests 941ms, environment 1ms)

clinical-content
 Test Files  145 passed (145)
      Tests  1768 passed (1768)
   Start at  13:06:17
   Duration  428.79s (transform 28.35s, setup 0ms, import 695.57s, tests 130.51s, environment 26ms)

clinical-research
 Test Files  8 passed (8)
      Tests  83 passed (83)
   Start at  13:06:28
   Duration  5.50s (transform 475ms, setup 0ms, import 1.26s, tests 2.85s, environment 1ms)

game-domain
 Test Files  222 passed (222)
      Tests  6151 passed | 1 skipped (6152)
   Start at  13:06:17
   Duration  1602.73s (transform 36.78s, setup 0ms, import 833.37s, tests 2337.96s, environment 24ms)
```

Final focused geometry/source tests:2files/11passed. Private same-value fixture preflight:1file/7passed. Seven typechecks, e2e typecheck, boundaries/launcher and player build exit0. Boundaries cover the read-only8,090-path index plus all292pending owned paths (**8,382**); no Git process/index write. Build: ✓ 696 modules transformed.; ✓ built in 22.09s. Existing nonfatal build/plugin/React diagnostics remain. The sole domain skip is unchanged from the prior release; initial missing-import collection/typecheck failures are preserved in the validation JSON and resolved, not hidden.

Pacing ran **alone last**, after every owned Vitest/build/typecheck process finished:

```text
{
  "firstFinishTick": 26377,
  "closingCashCents": 5913995,
  "completions": 442,
  "walkouts": 0,
  "referenceTick": 26281,
  "driftPercent": 0.3652829039990868,
  "clinicalSha256": "4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f",
  "caseCount": 1436,
  "registeredMeanings": 1142
}
(node:32676) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

## Final paths and hashes

**389 scoped public paths** for the combined port40:341accepted Main source/test/art/doc paths, five release opening-QA repair paths, two manager e2e expectation repairs,34pin/guard files, two native evidence artifacts carried by the whole port and five release plan/handoff records. There are266unchanged approved-art PNG derivatives,23cumulative code/test hunk-port paths and one section-only documentation port. Only the results artifact is written by this follow-up; all nine checkpoints remain byte-identical.

All389paths/final hashes, including PNGs, are in the validation JSON and `.local-dev/release-verify/port40-20261116.json`. Self-listing document hashes are filled by the independent final receipt. Nonbinary paths:

| Path | Disposition | Release39 SHA-256 | Final SHA-256 |
|---|---|---|---|
| `apps/player/src/competition/revenue.ts` | copied | `eecd936689e00dc851cbd439556ef60cd4bf2c43cffca4d3b92c51cb7e9385d4` | `bd6b1ae2b1d82da94688b13c6bf36cfaf0dc66443d8776ff7492c076d829e3cd` |
| `apps/player/src/facility/FacilityScene.ts` | manager-applied-chair-hunks | `7582d81beebd5469bd3d99948af098cf108ee3cce44e189afcb3e44cc44b9573` | `0de1f13e819b47560d31de924be53b8a48b27383200398f9090286c0edcd3968` |
| `apps/player/src/facility/graphicsViewportCulling.test.ts` | copied | `2be204a90d6c04d2a91289dcb2ba611064495315eb0b38fdaad0a1e4f333e3bb` | `75dab61570948ae712d2628507f19f0d7fb932e667800127ce334205ba988257` |
| `apps/player/src/facility/graphicsViewportCulling.ts` | copied | `572589867d2496a7510ef3193593e5ef6849a79f2a3275223235c1f57e5d8c40` | `f84d15b6f34c769e8adeba8a4745d3797baf13518580c15533defc8c28a1852c` |
| `apps/player/src/facility/reducedClinicRendering.test.ts` | copied-new | New | `79ae76430db397805da0de19cc9fe278902ad519ce8468550f65f7ff0ed63b17` |
| `apps/player/src/facility/textureWorldGeometry.test.ts` | accepted-geometry-test-with-same-value-release-fixture | New | `d5b348b6c757dc8134f3423923b084f8c2f002b7181dd2c56395f40864d3746e` |
| `apps/player/src/mobile/performance/bitmapDecodeQueue.test.ts` | copied | `eeac87632551fb2fdbc1bca146500160fcaec0299393f2978e381de8db874cf2` | `9673b74cb979bfa3ddd4f11d38c031e7293e62e5dfa2938b875802746a40f7f3` |
| `apps/player/src/mobile/performance/bitmapDecodeQueue.ts` | copied | `06bbb7144ae968513bad6c4d6c5fb921a820965ddce0ebfc9253aad32f003732` | `f7a0c14688964c96ffec19be0c1fb4b4afb0b9e0e3b4d6b109eb3d146f8cdb3f` |
| `apps/player/src/mobile/performance/phoneArt.test.ts` | copied | `cde477dcd03369d7a958fded965a203a7f7ee56f6f472bbe918de8938ad9e5f6` | `8f2bd1f767807e00eaf51ec7eb54e5d564d1206c66131f386f28ea3370f67ce5` |
| `apps/player/src/mobile/performance/phoneArt.ts` | manager-applied-chair-hunks | `cc58926690a46e68ebeb1c31665713e645cb8f8624462385e79a5174072e49d9` | `82de5f0b5248e6382608c5cfa56d7fadf4c74f405dd4c0dbad7419c6d0e9d351` |
| `apps/player/src/mobile/performance/phoneReducedArt.generated.json` | copied-new | New | `197adea2047e08f56c44a3542c5b2ebde4f43f5d07d3a3841921dfa3aa0a8f0b` |
| `apps/player/src/mobile/performance/phoneRenderWindow.ts` | copied-new | New | `af004dcf67db52a400ea803f17c8252a3fd5e37c31eebba89ae828ebea5d6ec5` |
| `apps/player/src/mobile/performance/reducedTextureSource.test.ts` | copied-new | New | `f764d145a6461ddb4410bc33afa64339b1d9847f1ff6b89946796a148514c284` |
| `apps/player/src/mobile/performance/reducedTextureSource.ts` | manager-applied-chair-hunks | New | `176c8fdecaa9f7ba4d80998db6eb741c8889f92013c5868fafa606576309740b` |
| `apps/player/src/session/cloud/checkpointCapacity.test.ts` | copied-new | New | `04d5301a8ab80a58fb048b0b4adca9e1fceb16aae97f7cefaaf459cda373aca1` |
| `apps/player/src/session/cloud/clockJournalBackpressure.test.ts` | copied-new | New | `489d44e1de9afc8058d3e7766274d7e903cfb7f81bce1856923caf4e7dfb0868` |
| `apps/player/src/session/cloud/codec.ts` | hunk-ported | `b095fe507c4bd29a809c4a1c7356b5eeb8dc26c5c0e2958311544ec1337218cf` | `373eddf1efba4ea290412acc77bee0b384008d68af86426225773a1c94cddbd9` |
| `apps/player/src/session/cloud/codecJson.ts` | copied | `f9c35d20ebbe61a83b50123759204a2c48d0d80a47eedd91349a5e514bd3d0ef` | `09e40dff6b5f550693063bbb889b9c8da2ea9fa359fe43aa95afe4749f97819f` |
| `apps/player/src/session/cloud/codecOwnership.ts` | copied | `ee41c6fcdbb78f560015caf0bd78a5edeebac73540bbfff818fc950c4d456524` | `373f8bc3ff33879d2560a4fbebe969f014f4b805a8a61698c2456be452ad3ec1` |
| `apps/player/src/session/cloud/coordinator.ts` | hunk-ported | `c1be50ac3b97e1a989184e4ec3b2709e72d3539c9c5b67cfb24d216d1ca3f40a` | `60b52c899f9f5d3d9ae42838b3d3b14742de16d48b6c4686fe805cb65d058d67` |
| `apps/player/src/session/cloud/entryLarge.test.tsx` | manager-approved-opening-pressure-QA-repair | `d709657e93bb64339df2e0129105478dec8d14730168302fd2138b8a10315315` | `8d43e5c5e7cb737f25181a6635f4e6a8b57fcf76d2dd40efc3160654cc892753` |
| `apps/player/src/session/cloud/entryPerformanceTestSupport.ts` | manager-approved-opening-pressure-QA-repair | `3ba6075fbef0e33311a13712e8968d76af27f25a05f1b1d093c5cdd0f4a97b33` | `733c3709fcbc50593c3ce71de72cad7c0084d2398e06067248b4e37522f65ef2` |
| `apps/player/src/session/cloud/gameSession.ts` | hunk-ported | `30967a06ea156ac0a177a7157e8ecc95cfde5b26a391c25ab91b1a8d63363502` | `31e0261adaa2982bca47948aef4ad15af40869932b9e6036a972fc04083e0ba8` |
| `apps/player/src/session/cloud/historyCompaction.test.ts` | hunk-ported-review-followup | New | `2058dfd7e71e624b49fe625b48f65de4aadf9df30070d1cb9aeadac109182651` |
| `apps/player/src/session/cloud/largeClinicEnginePerformance.test.ts` | copied-new | New | `031b054b437bc7508cdb869ede0bb9a3bc231c20e3097fff54255bf92a024693` |
| `apps/player/src/session/cloud/nativeOpeningProof.test.ts` | manager-approved-opening-pressure-QA-repair | `d8447a718a78893051e3fdc2b8bbd18f7864df882bda0332fc27ef377710093f` | `b014322d41ac892e8efc0bee7b1cbda198d7f1b0f91b38c7b3dc9f6986197680` |
| `apps/player/src/session/cloud/openingPerformanceTestSupport.ts` | copied | `269140663e24a2786b88e6519a11cf43ecc1c8134528a5f2ea31cec0b266987c` | `0d90c12e2b8eeaa8d22f447c03b53187ce33e7d1e9ad9557e67e24841b8ab007` |
| `apps/player/src/session/cloud/openingUploadLarge.test.ts` | manager-approved-opening-pressure-QA-repair | `668d7bef3fdb35068ad58ddf5d9284976da06d31b08219b13e82627086586adf` | `f72aeb8bf08c1960ed24c3636ddb1c65519c8584588e38aa0e96aec3a9df821b` |
| `apps/player/src/session/cloud/operationalEngine.worker.ts` | hunk-ported | `162ff88648a74f784dde496f7e6f7393fb74dfe90ad6e8563c0cb356dd8f147c` | `bcbdf1cf1fd3978211449994b9273596e90420f5102432913220ca062d4ba286` |
| `apps/player/src/session/cloud/operationalEngineClient.ts` | hunk-ported | `9b1610cb2045d6d0af291e40097027e1683c5124d9c96695cae1d4e1500c3719` | `79db6efe0281e623356287141be19b7caa29f9847081fc35936cc3940495446c` |
| `apps/player/src/session/cloud/operationalEngineDifferential.test.ts` | copied | `24cc5a91299701bfc30238426314d75a17778638242baf7961b9d287b4cbd5aa` | `07354cae3cb673798389e075f94dce37b43271d084eb8144e85c6514a8473b37` |
| `apps/player/src/session/cloud/operationalEngineDispatch.ts` | hunk-ported | `b8a3409ac62791bb53ba2e57242dd8140e8c038fe5ce382979bc8a0034804682` | `0c172e52b8e4a26daeec1e2584a0802d8b9e27c87427a66a6b47c9e72e1030d5` |
| `apps/player/src/session/cloud/operationalEngineLiveness.test.ts` | copied-new | New | `e963518e890b31de9d15f6e33fe5e2c5edff3a7e3c39731c501ff3be6652d32b` |
| `apps/player/src/session/cloud/operationalEngineProcessor.ts` | hunk-ported | `c59c69b80c08674f54c1618fe662962f270c42d567c7416a06772f5203eea3d1` | `64d09b3ae03ed88d4056a35697f97d81325239ac70a465e675e43df4e84251b8` |
| `apps/player/src/session/cloud/operationalEngineProtocol.ts` | hunk-ported | `d15890f2c64ddb1d79633f3ed5dbd7c0efc9d23ef1ca6d925e8b6f0c8abf2f73` | `c836d552bf3af90c4a7d6935df17cd149cc315a4758972728942256b99f35e86` |
| `apps/player/src/session/cloud/operationalSessionEngine.ts` | hunk-ported | `c9ac98b4f4384deba770c96cbf0e19dfd10bb64d105cf3292ba1afe47826f4c7` | `9dacf317f7d1dd4269e183ba277eb875241a206ab31a2da4e18353f11d815a6d` |
| `apps/player/src/session/cloud/operationalSessionPerformance.test.tsx` | copied | `600957dde32dc9238892cf3e6b49a2933380f44f4144938265d0298c3c916392` | `2fc786ca9a2d25a9da1af746a30b9648ce0eeb3322fd5384b8978ef743090750` |
| `apps/player/src/session/cloud/operationalSessionRecoveryBackoff.test.ts` | copied-new | New | `b4bbe8f240ad8fa8ff10e03107b67041c72462394a253183a27ac867b73a22c4` |
| `apps/player/src/session/cloud/operationalStatePatch.test.ts` | copied | `68acbafd0359cbb0e194a3b1a0e54e480897b4d8a50fad8029b558c884f97320` | `99179b0a680d41f8c08d6b37b9e7ca37d7d81dfdf6865eecb4db1374fffd664b` |
| `apps/player/src/session/cloud/operationalStatePatch.ts` | copied | `0a625f45cfa63539a397a8124fda84dbbaa5a85ce523db280f9465e4a1b18033` | `7c91692f3558a499559b761c63312d71434df6861df5825a677c2e4e7f28e6ab` |
| `apps/player/src/session/cloud/snapshotCodec.ts` | hunk-ported | `6f427b6983a1064c2bf2eec30ed2d09159d39f9c11508112e0fd08636dcec106` | `a6292d674c57d8909242f7dc26ecc54cf596f91bc0612570314dbcaaf8b50014` |
| `apps/player/src/session/cloud/snapshotConceptCompatibility.test.ts` | copied | `3a74ea47ba120b3b2b2b0a10293ff7ba1abdaffa361397d199ca1fbd42da0723` | `464e1416c362bba6d219aa4de2db4578fb47201cf1207ce796f17da22bba5e5d` |
| `apps/player/src/session/cloud/snapshotLearning.ts` | copied | `9751160d3fd9ffc5191d02e25a68535752849f6ef7446e81e07412f25cb9815c` | `7e5c30c951e2f326e367a8b7a40bc4a36708220282693a85e48a25d044ac614d` |
| `apps/player/src/session/cloud/snapshotRpcRoundTrip.test.ts` | copied | `7ffb0f99d4bffd5ef9c4caae195a5f0254ed5b3e7d00970bd740e581cbc647b0` | `9d55534fad5b3f8d8b6440cfc590d8c01e65ecedd31990e3798ba62aa94dadbb` |
| `apps/player/src/session/learningDevelopmentView.ts` | copied | `355dea25497eeca118ada4f0ae8cc94f4dc93defc08d07d894348a1efc754431` | `6afacb12b919812d6e3f0815337eb0a8287fdd184d0284cd3118332f629a0c44` |
| `apps/player/src/session/learningReviewCount.ts` | copied | `e846a012beac321d3f966b9dd6b2c1c8983f3e788779628d2dcf4b1e86915328` | `3d2e595b24c9774a44f2b6bd11f39c233ca11b43b0a018e2816ebb6eebe49227` |
| `apps/player/src/session/managementViewModels.ts` | hunk-ported-review-followup | `bc8bd25e15f0721adf87143deabc3a766b6f02be6f901187d52615010f71a0ef` | `5bf3bde153dfe27cbd61e1e9503b58b308e05fdbab409dd8e7ec7eb292a73d06` |
| `apps/player/src/session/newestServiceIncomeReceipts.test.ts` | hunk-ported-review-followup | `3b7386fcc73372e174037455ab0e8ed0e2ad4e919868ec4fa2d4a446e823c5d9` | `9aada8f74d3006e6725b400cffa56a80365eb8011dd465598a5aee3e42b88aeb` |
| `apps/player/src/session/viewModels.ts` | hunk-ported-review-followup | `fe0d1b387f278e6f777601755d30c867afe3ff28b3dd56887efe5dbbdae6e2b9` | `05ad873945a42104dcd83f6d9bc2b1ca1e280b80856fec869413c8725894a657` |
| `apps/player/src/ui/CloudSaveControls.tsx` | copied | `4dc0dd2f99847eacc00e549fbc7570baac7235c1c0c411b21559564f5581c73f` | `4f710a52d57ba52b13d78fd3eb7afc0ab585acc10ba95cece0167fa6434e19bb` |
| `docs/execplans/gs028-stats-ethics-overhaul-20261007.md` | release-handoff | `6a05cfa3d145b9f1795d1e35143a71cafbb1ff977c4ca2db34703aa57cac9b41` | Independent final receipt |
| `docs/execplans/phone-play-perf-20261116.md` | accepted-chair-execplan-section-only | New | `f52a4522a7c617475f5e7d3179ba7600a9934ddf6f6175db6182d27541279a91` |
| `docs/execplans/release-port40-20261116.md` | release-handoff | New | Independent final receipt |
| `docs/execplans/save-headroom-20261115.md` | admitted-accepted-document | New | `a9e25b5b924f6dc9494512e790b1fbd2acc9b5bf9e076823c7f948e2ceba2bb8` |
| `docs/handoffs/CURRENT_THREAD_HANDOFF.md` | release-handoff | `73ade4d65c9bbfb6b30f72f5adea4895a2546fe6a1e1e40ed86390c54a5a345a` | Independent final receipt |
| `docs/research/release-port40-20261116.md` | release-handoff | New | Independent final receipt |
| `docs/research/release-port40-validation-20261116.json` | release-handoff | New | Independent final receipt |
| `packages/clinical-content/src/question-flags3-20261107.test.ts` | release-authorized-pin-delta | `c13411e51403e4278f38b125518e9fa348b71a502d7efe59f4ff223ac52c1347` | `feb947f1fd26ae0f520f26f9e6aa24ffc58722bc34bec88942fd4bbdecd9cd3e` |
| `packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts` | release-authorized-pin-delta | `35106fbaf9f8bab8c2c921c3ae2b7f6bebbb5a768511eaf40bf3fb82b9439ae7` | `4c96e6e88292535d2da938f88046a921fa5d4044aa0942138c8c6dba6498d44c` |
| `packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts` | release-authorized-pin-delta | `1dd4bedffbc8e22a948594038e7b01c45a0b189acf7329d4eebf5f3ce4551445` | `ba9e82a9895d7c88d4359c76922e59402f600dc511dcfb679aaa18b4a7ef715e` |
| `packages/clinical-content/src/question-n4-acceptance-20261110.test.ts` | release-authorized-pin-delta | `e5d8beaf3131bdb71c6cfbca31cf73dc4325136ce546235df1f9cd2546a79e71` | `ff8f3e7bd1bab5e33934b88ccbe531cc3271c172b7d06acabfc610c7c830fc9e` |
| `packages/clinical-content/src/question-program-batch1-acceptance-20261111.test.ts` | release-authorized-pin-delta | `4e45dcfc4db7e7331ab40596821eb9c48faa17462f35e5867a9754218a24545d` | `a9347d0b8a018ab2e4aacf310e4c4ddf255da9367b8a208093624e9e5b5dedf4` |
| `packages/clinical-content/src/question-program-batch10-acceptance-20261113.test.ts` | release-authorized-pin-delta | `3413d8113deafa226b7d183dda620323c4f5d5ec3f6887b4eb88158e18056960` | `37732d19b17c4c9da31a6bd6f5d3b3e3b84d5a6a56df7753bc7719ef882acc09` |
| `packages/clinical-content/src/question-program-batch11-acceptance-20261113.test.ts` | release-authorized-pin-delta | `467b5a0e4fbb72cb0b7de0d7375662e7f9da830df811bf91672e939e97dc9dff` | `1de2ae47907f7bb8d9898c4198ff0e424b9fa2560cb82ee2bc6ac620f2d234ed` |
| `packages/clinical-content/src/question-program-batch2-acceptance-20261111.test.ts` | release-authorized-pin-delta | `8b00aea6de1c268e92f7741d9a42ce4cf9b606ee44c05d2ebd7b8c16adc8bbbb` | `060ee013e233973579b08b37891c192acf4150cbbf97c2fa088dafd0b7e94d8a` |
| `packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts` | release-authorized-pin-delta | `0b6f0fc302e71d8c806d192e0bc3cd6f49df5f9f0ed66afbbf25f51f46071a61` | `619573ebe7587e9839e3dbdc12123115bbcc69a6baac5825d1ee206b3d3b0c85` |
| `packages/clinical-content/src/question-program-batch4-acceptance-20261111.test.ts` | release-authorized-pin-delta | `cbef00149d050b466f684c0200aca4e40e38b8e40d55b024d8c45f5ffcb96054` | `4c489e052f3a30f3a0c2e0b86ae97aa3dd2a77c3b7b27bc3f6748c4e9061fc22` |
| `packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts` | release-authorized-pin-delta | `97ec0acaee1545ac74051aa08f00a3a7186cdff73aa4d6f189a833eb6b7299ce` | `d2e8f843d774b5aa5d1b31d79f3a4588a7453a33d694761ba8c9f9209fc6f8bb` |
| `packages/clinical-content/src/question-program-batch6-acceptance-20261112.test.ts` | release-authorized-pin-delta | `040bf6413f1d717ab46d7942c3614c55f8a4db9555e7f66c32eac1505d0de022` | `36208e1c4011ad8e8e9c2de2e98fdb90aadf363c9e49d3e31474313e1812e79e` |
| `packages/clinical-content/src/question-program-batch7-acceptance-20261112.test.ts` | release-authorized-pin-delta | `680b0e29332f57b74977a1768a8a4998dfb9ec8dccf34b584ff5878a619e8aa3` | `ae94af30af87d826ccc56d632e7ec23aaf4c755b5e954fe4b25f5cd50b16657b` |
| `packages/clinical-content/src/question-program-batch8-acceptance-20261112.test.ts` | release-authorized-pin-delta | `070835d2603461642e346730e7336450b43280e2bcd9aeec4af401d722e6423b` | `dadaf20066080978fb5b8b266016b3e170ce7b90234fbc8a692c9c3e6b6519b8` |
| `packages/clinical-content/src/question-program-batch9-acceptance-20261112.test.ts` | release-authorized-pin-delta | `da0213cee9097466926b596fa79e41a10665dc3f39e52f6c0ff6c3cdd2d62a89` | `45a60d481755cb614e110c0d530aab189827f26085f1f4cefe230baf2415cf1c` |
| `packages/clinical-content/src/question-stats1-20261108.test.ts` | release-authorized-pin-delta | `228d29c11299f7e495fdbcc0e17b0d85dcd35a8bfebee4f2d6e52ce68bf3cebf` | `cf2b75e84beb58c7c9dd6c341b1b21557be88f9253133604df2a0375f0b7b492` |
| `packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts` | release-authorized-pin-delta | `8f612ed21dd9024337f7d9e926ba6587e0d5eb3c980aabe57d2b2299f86eb1ca` | `1687ce4fa4b2b45b0ec3e42dc7bb9d1b0a21ee0747eeac8f44afb34b8a4ac780` |
| `packages/game-domain/src/clinic-day-summary.ts` | copied | `e6eed87ce8a064bb0010922fb8ac86d58e69109bd6bae2ebf5a65d01d483fe6b` | `018702502bf590f59c3ec7deccaf6bc789cbc6afc830755b127f8b45cd33457c` |
| `packages/game-domain/src/clinical-selection.ts` | copied | `e4ad07cb009be75c1f2da4731a3137b83ea1bbdacf1c2034e0fdf7e50fa0dc57` | `58221669ded13e782f679478fce8f74aa3818ccc445b72c61c71302057b4253f` |
| `packages/game-domain/src/diagnostic-timing.ts` | copied | `499e069e78d1755c1f23e6ab6b29052ee072896248d792c019a1336301334d2b` | `6fad9633dab03ea8168176f11029464bac2874cfc9e89e25006fef72040afcbb` |
| `packages/game-domain/src/diagnosticCalendarIndex.test.ts` | copied-new | New | `7c7723066e450a0fb79f705f7d8da73778b2bbbd268e9469c7ea409e56089376` |
| `packages/game-domain/src/diagnosticCalendarIndex.ts` | copied-new | New | `02242d5952fcdd18cb1e8c14e8858d1005cb013108e392507f4cba72da3d456a` |
| `packages/game-domain/src/game-evidence.ts` | composed-hunks | `ff5810d795a18e7d49e043da8a82e94b78fc3faeef15cd49ce75d413381cf9cc` | `0c9172ed74d046c434d9dd4250302b4e929746826ece4dd3ba2e189f09d380ed` |
| `packages/game-domain/src/history-compaction.ts` | hunk-ported-review-followup | New | `6e67fc846d951cbd5832053d68164f8cc9a76a9220dc94cb068ea502e65965fa` |
| `packages/game-domain/src/history-counts.ts` | copied-new | New | `83965d416bf02949681121cd203c2112b0c972f5ab974cc5b84061b44ff160a1` |
| `packages/game-domain/src/incrementalEvidenceValues.ts` | admitted-required-dependency | New | `5e3cd39b27f28f1cef1974789a408df1a59aa83420c51385681bf74c30c05eff` |
| `packages/game-domain/src/incrementalTickClone.ts` | admitted-required-dependency | New | `e0b58ddce91563977773f6f320085617e63c8765181711f05df7be817e31467f` |
| `packages/game-domain/src/index.ts` | copied | `5345cf8dd064a3f073f5e5c9fc436261c0ac31d159f3a9e1aa207489acf7c258` | `601da08f6da20101d3aa9ac7903459a82d5a6fe698e92439e88308aa33e5bab1` |
| `packages/game-domain/src/level-three-support.ts` | copied | `6348071b39894d312737929d0d67cefae8bcd0717357ee34ce019159cab35739` | `baba929fad0b14bb04b2aab81a4a7c9f1e45ae867e6c8437113f6e512c738146` |
| `packages/game-domain/src/persistence.ts` | copied | `0dc1e41890c56e2cd8cda582968390be8339bd8076b83d5078801d1ad278f506` | `98a9d56cc0a00f9a13c29fe16c28e7a5da22e36da42584f9638773b9fcbe2a12` |
| `packages/game-domain/src/reducer.ts` | hunk-ported | `4a33a0ca555f3f41debc24a7331a8213f3c64c61473dae227801daa35b3f8d76` | `092ac3d99bd933cc309ca3c13b3a7d2ff32ba9955ebfcb15f330c5fe7b9e3447` |
| `packages/game-domain/src/retired-service-history.ts` | hunk-ported-review-followup | `b94e2c75a28a1d96a1ab83a8cfd844d0040b33e55551dfbd7195fe8122d57ea4` | `d265853b2b6520c37c7fd51d86830a9a68f282c4cfb54ff18d589b4ddead70b0` |
| `packages/game-domain/src/rolling-income.ts` | copied | `40c8f54c7c492e9fa52e88ad171a6d22a09f25fdc6ec5bec8d931a3e8c3f8b65` | `ac49d34297c72a4f9cfbfbea1afdf1f33f11b66577dc329738c680f6bd984e98` |
| `packages/game-domain/src/routine-patient-availability.ts` | copied | `1c4eb483c4d6a8ca8807e4470f91c88718c9ba772bbb16d6a470a5355fb8a112` | `c19c9ac0401b99fa38b4556722c9ec8783964c26332cc29ba40d712f3dfb923e` |
| `packages/game-domain/src/spatial.ts` | copied | `b5ac30130bf0c1a03aaf2bf255f948e9a56bf3df123c8b03262cd728e1071791` | `022e9fd1dec618207fb4d461bf68172cda858ea9b061896eac976faaddc1b8d9` |
| `packages/game-domain/src/tickStateClone.ts` | copied | `ea02d6760de025869e1a6911c9a3dcdefe57ce9e44efe530687954c4634a07ed` | `0fdf2cd3ba6484024522c925979b161fe869ae1d4339d8c51e87a7655f9c7fe1` |
| `packages/game-domain/src/types.ts` | copied | `fffe3c55c790db98693f3df5b3c34777bbaf1c9be762b52e46b4ec1d138b33d0` | `b09227728bf55ba819d587887e2d0ea1c5d65520ee2f70f33ac58215a306775b` |
| `packages/game-domain/tests/eng-i01-live-procedure.test.ts` | hunk-ported | `858e7bd0c8a5cf4d31bf58c4e66af51f78795c456a75821cbbe092a32ee1f6bc` | `d8c1ea31a4a87634d6864f2f60fb892ec52fd38710f6148b2964f9d12513f48a` |
| `packages/game-domain/tests/fixtures/evidence-differential.ts` | copied | `19d10a9dd720300df759bff2309e3a3c5df761075938aff957ed40498f94185d` | `daf71062cc43259be497c0ac9676029a10e90b8346f0a3fcb00dcbb6f9ce4310` |
| `packages/game-domain/tests/game-evidence-incremental.test.ts` | copied | `0f8e644fd26c246a6bb14d9249f6b1166ab45de3659a202007899d2dc943de34` | `a5bb8b9275ab3e127365feaa2e4b12ef5ed3c86c9237c25d3e82561b4085d862` |
| `packages/game-domain/tests/history-compaction.test.ts` | copied-new | New | `565544856f71cb0b26fc3977681fa283de4dbd379c4668dd9310d0bde73ec677` |
| `scripts/art/generate-phone-art.py` | copied | `e8d82583a847782e485eb49d7bf87e63dec2a167f60c670cb446a8f03a0c5b5d` | `b9dd47e2f53bd5041271063f6da9d6ab50dfff7d235028cf8db05929e74ccc23` |
| `tests/e2e/cloud-recovery.spec.ts` | manager-applied-e2e-expectation-repair | `aafeb00a4aea729ff2c832601f51270a5766c202ebeda7a73c5d60a5ee76f741` | `e8f090c846c4fe5f01f38f84bc74a6995a40774216115b73901c43547b322d82` |
| `tests/e2e/map-pan-zoom-performance.spec.ts` | manager-applied-e2e-expectation-repair | `897623f207a28ac953ecd6717f66e770b57c530402ed3463c8e93e067d35ef55` | `17185b4bc0f36684419ac8925c3c8370a3a84aa2d1700135b17696436a194949` |
| `tests/fixtures/diagnostic-workload.ts` | hunk-ported | `bcc687c06b886fe28fefbe3fc09edc8f0b3dc9492ff9460fd679f18b6605cd5c` | `ce5b315de2bd9440072ed206b0d154f41dd98ca1906c891261dc137e5505fa90` |
| `tests/fixtures/history-compaction.ts` | copied-new | New | `f39d55bc51e942369b7f9b4b8b3f9148f2d762cf264b02a780cf5469ab4e1a12` |
| `tests/fixtures/level-five-entry-pressure-history-20261116.json` | manager-approved-opening-pressure-QA-repair | New | `67ccfdd1e4a71dc5a84bf4a9a0bf8f35fe412254029dc902b7eca78376e0a4c2` |
| `tests/fixtures/level-five-integration-checkpoints-20261012.json` | regenerated-native-evidence | `04587f7d88309ffad208cb39854bd67b7b4aa6a441a0ba4650e514f0333001a3` | `69d25d4468e3e36183aea32f7f75781ffd3c095f9c15cb6ad475c8c08473a56c` |
| `tools/qa/level-five-integration-results-20261012.json` | regenerated-native-evidence | `a24afb1cb5e7ef5ab589834ae3cf391fd08312157b983e91170da930717f073e` | `bba4aeb60bb5a0a6dce240b83ed10b26dd31e48fb43f1fed1f4c66e4c487d0c8` |
| `tools/question-quality/fixtures/question-flags3-release-source-pins-20261107.json` | release-authorized-pin-delta | `d6bbb3935bbd967f37223349be85f9ab6abc2d081ee0729af5f01ffaeebae384` | `17f1320c584c39f0731ddc174c9ba58d291a2799f8146396a307e0015bf358eb` |
| `tools/question-quality/fixtures/question-flags4-acceptance-release-source-pins-20261108.json` | release-authorized-pin-delta | `ee2d4f503de534fa3fcb1154a5bc145e0a0d4084db13d70a98be9d378a47a365` | `2a43b214ec40f34a87b3bbc934fd7693044f374904b342aa374584ffb3bac3a1` |
| `tools/question-quality/fixtures/question-harden1-n3r4-release-source-pins-20261110.json` | release-authorized-pin-delta | `bee810854ba8f962a2b4c0bc344db73a79c81fafd809a20705cec6a0aa96f30f` | `b0631406babe2fd8c9348182d6d26bf7ed1e91554c04831dca56f81870b004ab` |
| `tools/question-quality/fixtures/question-n4-release-source-pins-20261110.json` | release-authorized-pin-delta | `da9378dbdeb429a6add0186679e61526f96de8db73482965c53e9a5922b86840` | `4c646b65872039e5ba27f6bb907128ac5e0ebe0179663229c251a460a04bfb7f` |
| `tools/question-quality/fixtures/question-program-batch1-release-source-pins-20261111.json` | release-authorized-pin-delta | `d153a41829f0a93a734edf4ebcccf3669432cd4c2306ec376270314a5e092570` | `011de447041d041e45593512b0079cf652c5a42fab2fc66eb5adbd8db2e89167` |
| `tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json` | release-authorized-pin-delta | `74453b1c5d6e942b2edd85cc82c6489be51ed5a48373cc2bf33835307ec93525` | `4ff9d9606216bfb1bc1e77ad6b41151857662dc447152409e00e13c0ac4a91e1` |
| `tools/question-quality/fixtures/question-program-batch11-release-source-pins-20261113.json` | release-authorized-pin-delta | `cea4a41194edd9d6cf76017d2d467a3bf31f47ccf14924e5be642fb5e2d6b617` | `1eb27dfb79c63a04ac0ae151349e0e75418fe81b19fffbca896ef509d91049dd` |
| `tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json` | release-authorized-pin-delta | `3003726c46c02da79f20c6e000e9ede28246282f829d437a140ef7bf46a713df` | `76074046aa42bda1a0c2276029724bb8de4594b819c7eb4c4075475151da1eee` |
| `tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json` | release-authorized-pin-delta | `bcbe882b081a5d157140b225b3e5693b0e55a038ee20fd0ac023eebe801edb9b` | `0cab3a7f80778d0736362f856839e063d7b7be8d6e43b32187cbba2e619d7a94` |
| `tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json` | release-authorized-pin-delta | `5f326a7dc3988748057cc2a66045b8edef974e2b06a031958b4eeeeeed1c6be9` | `83ae94fe7489350806fbe7b85bf2252412393916a6dbbe2a58823986e79dc30e` |
| `tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json` | release-authorized-pin-delta | `e36884361dc29c1f0347e3b2b7e6ad1b96d1ff55e8fcb212a54702a68aefba43` | `91c6adfba16727ef341b6a27a62f16f33bb12a8ce379d8fd20ac36bd275427e6` |
| `tools/question-quality/fixtures/question-program-batch6-release-source-pins-20261112.json` | release-authorized-pin-delta | `74eea18c757c7370ef75d6dcb317213b302716fafc789f0c93681ab328cdd645` | `ceae9e1cc1e7677d126e2bc1d27cf49c41ecb2263c495f04be59289af85773fd` |
| `tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json` | release-authorized-pin-delta | `930291a4b26370bac3f7d1b9f4e3785ecdb696d54fb2cc47b0c5a9361dbf35dd` | `bc1e23ecd597337d1870bed58e4a5a9886e8eae7410f69fa230c9a84e3d9dfa9` |
| `tools/question-quality/fixtures/question-program-batch8-release-source-pins-20261112.json` | release-authorized-pin-delta | `81706fd14e8e94fe4c66d9105366ff0c3ef7ca0359f129f425b593408edc1c80` | `9693a0c97c66b13a4afcc80ba5e98011221944ba4122c3c302f9f9b4803a0c2e` |
| `tools/question-quality/fixtures/question-program-batch9-release-source-pins-20261112.json` | release-authorized-pin-delta | `fcd7a7339f845d3de910a974d9ee00b8495484de4e2c32abf73a836bd2b8f036` | `59849945f6c61f6b3fd35e6dc7478270500d6878a74521af9ae9f842b902759d` |
| `tools/question-quality/fixtures/question-stats1-acceptance-release-source-pins-20261108.json` | release-authorized-pin-delta | `5b3a4494a8b4dd98d8246f5de7fd9f4be7925a800b50496446fe634fe605dda9` | `109bff19c13dfa35dbeded7cd0b19ac68931d90c81615f3e8e3bea9dea181f92` |
| `tools/question-quality/fixtures/question-stats1-release-source-pins-20261108.json` | release-authorized-pin-delta | `f639822cfade97c389e901a73d6bf883e6fa8fa698feb9403c1fc450c2117528` | `f96fc278b755b9db0787f85112aa29eefcda6c8a80e02d656b0e3a23f296d1de` |

## Risks and handoff

The manager QA build is ignored and absent from every file manifest. The generated `apps/player/src/facility/FacilityScene.ts.orig` matches the prior release source, is preserved as manager work and is excluded from release paths. The manager should remove both artifacts before committing. This worker deletes neither. Three pre-existing manager screenshot updates (management-mode compact desktop, laptop chart priority and laptop) are unchanged from the follow-up entry and excluded from the release list.

No failing check or unresolved source dependency remains. Native Phaser tests stub pixels and prove geometry/resource policy, not a new physical WebKit/GPU/thermal measurement. Earlier finite-history/headroom limitations and the synthetic opening-pressure delta's explicit base-refresh requirement remain. The manager's browser result is attributed above; no private owner data was accessed or copied.

The tree remains uncommitted. No Git writes/commit/push/deploy, network/live DB, installs, agents, browser storage or owner-origin change. Full receipts and staging remain under `.local-dev/release-port40-chair-20261116/`; Main stays read-only.
