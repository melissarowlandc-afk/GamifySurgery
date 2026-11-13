# Intraop acceptance batch 10 — 2026-11-13

**Accepted 13 independently PASSed nodes in 11 complete cases. Three salvage cases remain skipped.** All exact versions remain needs_clinician_review. The split is 10 live cases with 12 scored nodes and one clinic chart-review case with one node.

## Accepted and withheld cases

| Exact accepted node | Case | Source mode and family | Latest PASS |
| --- | --- | --- | --- |
| node.intraop.asc-access.anterior-port-course.20261112.v1 | case.intraop.asc-access.port-course.20261112.v1 | live / procedure.central_venous_port_insertion | docs/research/question-intraop-asc-access-and-soft-tissue-surprises-review-20261112.json |
| node.intraop.biliary-safety.unexplained-bile.20261112.v1 | case.intraop.biliary-safety.new-bile.20261112.v1 | live / procedure.laparoscopic_cholecystectomy | docs/research/question-intraop-biliary-safety-and-duct-decisions-review3-20261112.json |
| node.intraop.biliary-safety.major-injury-transfer.20261112.v1 | case.intraop.biliary-safety.new-bile.20261112.v1 | live / procedure.laparoscopic_cholecystectomy | docs/research/question-intraop-biliary-safety-and-duct-decisions-review3-20261112.json |
| node.intraop.biliary-safety.stone-clearance-route.20261112.v1 | case.intraop.biliary-safety.stone-clearance.20261112.v1 | live / procedure.laparoscopic_cholecystectomy | docs/research/question-intraop-biliary-safety-and-duct-decisions-review3-20261112.json |
| node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1 | case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1 | live / procedure.colonoscopy_polypectomy | docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json |
| node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1 | case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1 | live / procedure.colonoscopy_polypectomy | docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json |
| node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1 | case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1 | live / procedure.egd | docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json |
| node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1 | case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1 | live / procedure.colonoscopy_polypectomy | docs/research/question-intraop-suspicious-polyps-retrieval-and-tattoo-review2-20261112.json |
| node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1 | case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1 | live / procedure.groin_hernia_repair | docs/research/question-intraop-salvage-review-20261113.json |
| node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1 | case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1 | chart_review / procedure.egd | docs/research/question-intraop-salvage-review-20261113.json |
| node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1 | case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1 | live / procedure.egd | docs/research/question-intraop-salvage-review-20261113.json |
| node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1 | case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1 | live / procedure.groin_hernia_repair | docs/research/question-intraop-salvage-review-20261113.json |
| node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1 | case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1 | live / procedure.orchiopexy | docs/research/question-intraop-salvage-review-20261113.json |

| Skipped node | Case and family | Reason |
| --- | --- | --- |
| node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1 | case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1 / procedure.anorectal_eua | The reviewed live case requires a procedure family and specialized resources outside the current ENG-I01b registry. |
| node.intraop.parathyroid.sample-integrity.v1 | case.intraop.parathyroid.missing-gland-salvage.v1 / procedure.parathyroidectomy | The reviewed live case requires a procedure family and specialized resources outside the current ENG-I01b registry. |
| node.intraop.parathyroid.selective-salvage.v1 | case.intraop.parathyroid.gland-preservation-salvage.v1 / procedure.thyroidectomy | The reviewed live case requires a procedure family and specialized resources outside the current ENG-I01b registry. |

The Crohn EUA salvage requires procedure.anorectal_eua. The two endocrine salvages require procedure.parathyroidectomy and procedure.thyroidectomy plus specialized resources. ENG-I01b supports none of those families. Their complete reviewed cases remain untouched and withheld. The polypectomy ascending-emr-completion salvage is excluded by manager direction and has no acceptance row. Every admitted source case includes all its scored siblings. This acceptance appends complete new cases.

The eight ENG-I01b nodes use the installed port, cholecystectomy, EGD and colonoscopy families and their exact operational equipment capabilities. The five admitted salvage cases use groin repair, EGD, orchiopexy or the authored stable outside-EGD clinic record. Native integration tests admit each live case only in a real compatible staffed procedure phase and its reserved OR or endoscopy room. Wrong family, room, room definition, outage, phase, nurse, provider and capability controls are rejected. Ordinary unsourced admission is rejected. The chart-review case uses ordinary clinic admission.

Three pediatric cases retain exact age/sex profiles, child art aged 5–17 and one named parent. Tests require an operational accessible Pediatric Examination Room and the proper facility stage. Missing parent, wrong art, disconnected or out-of-service pediatric room and lower stage all block admission. Their frozen family/source identities survive format-3 and committed-journal reload and completion.

## Frozen bytes, naming and source support

The source freeze records original and accepted question, node and complete-case JSON hashes plus source, review and ledger file hashes. Twenty-one literal-name substitutions use {patientName} in accepted text and review metadata. The sigmoid case carried an older combined summary after its node explanation had been revised. Its accepted learningSummary now uses the exact reviewed node explanations joined by the native projector, with both source and accepted hashes recorded.

The original atomic claims and source records are reused. Operative anatomy, device feasibility, rescue protocols and pediatric practice remain clinician-review boundaries. Five existing authored concept records omit educationalTier metadata. Their facility stages and clinical meanings are retained without inferring a missing tier.

Artifacts include the [key-first review packet](question-intraop-acceptance-batch10-packet-20261113.json), [exact source freeze](question-intraop-acceptance-batch10-source-freeze-20261113.json), [dispositions and correction ledger](question-intraop-acceptance-batch10-dispositions-20261113.json), [validation and every failure](question-intraop-acceptance-batch10-validation-20261113.json), and [file/hash receipt](question-intraop-acceptance-batch10-files-20261113.json). Keys are shown first for review only. Runtime choices remain randomized.

## Testing waits

All eleven testing-choice bindings are installed with existing authored profiles and exact case/node/question/choice tuples. They remain planning estimates with not_executed / future_planned disposition. The binding list covers every accepted testing option.

| Node | Exact choice and label | Timing profile |
| --- | --- | --- |
| node.intraop.biliary-safety.unexplained-bile.20261112.v1 | cholangiography — Acquire a transcystic contrast cholangiogram using fluoroscopy | timing.test.advanced_diagnostic |
| node.intraop.biliary-safety.unexplained-bile.20261112.v1 | open-exploration — Acquire a gallbladder-injection contrast cholangiogram using fluoroscopy | timing.test.advanced_diagnostic |
| node.intraop.biliary-safety.unexplained-bile.20261112.v1 | complete-removal — Acquire a fluorescence cholangiogram using near-infrared imaging | timing.test.advanced_diagnostic |
| node.intraop.biliary-safety.major-injury-transfer.20261112.v1 | drain-ercp — Drain the subhepatic space and request transpapillary stenting | timing.test.bile_leak_ercp |
| node.intraop.biliary-safety.major-injury-transfer.20261112.v1 | duct-anastomosis — Drain the subhepatic space and dissect proximally to expose the hepatic confluence | timing.test.clinical_procedure |
| node.intraop.biliary-safety.stone-clearance-route.20261112.v1 | postoperative-ercp — Complete cholecystectomy and arrange retrograde transpapillary stone extraction | timing.test.therapeutic_ercp |
| node.intraop.biliary-safety.stone-clearance-route.20261112.v1 | transcystic-dilation — Complete cholecystectomy after further transcystic dilation and stone extraction | timing.test.clinical_procedure |
| node.intraop.biliary-safety.stone-clearance-route.20261112.v1 | transductal-exploration — Complete cholecystectomy and arrange stone extraction through a common-duct incision | timing.test.clinical_procedure |
| node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1 | choice.intraop.suspicious-polyps.deep-pattern-before-resection.sample-surgical.20261112.v1 — Targeted sampling and colorectal-surgery evaluation | timing.test.pathology_review |
| node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1 | choice.intraop.suspicious-polyps.deep-pattern-before-resection.enbloc.20261112.v1 — En-bloc endoscopic resection and specimen assessment | timing.test.pathology_review |
| node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1 | choice.intraop.suspicious-polyps.deep-pattern-before-resection.piecemeal.20261112.v1 — Piecemeal endoscopic resection and fragment assessment | timing.test.pathology_review |

## Counts and hashes

| Measure | Before | After |
| --- | ---: | ---: |
| cases | 1421 | 1432 |
| nodes | 1627 | 1640 |
| registeredMeanings | 1126 | 1138 |
| scoredMeanings | 926 | 939 |
| acceptedRows | 794 | 807 |
| timingRows | 2949 | 2962 |

One newly scored node reuses the already registered concept.n2.bile-leak-duct-continuity-boundary. The other twelve meanings are appended. Every old concept definition and case remains byte-exact and retains its FSRS identity.

- Manifest question-ship.2026-11-13.v19 with SHA256 cf8b57b5786c64af159dc9701285e6bc5670e9fb3c32ce15421efa89e1bfa709.
- Default release SHA256 ae1c880a6997bbd93b497bfb19fb7b19500ad54010fcce980ede60e358bb9280.
- Timing registry SHA256 0100ba0be82e1d82c6e526408f387ed895fdfd83730aa4d3f19e92da70a84c78.
- Catalog SHA256 3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40, unchanged.

## Validation

All Vitest commands use npm.cmd test -- --pool=threads --maxWorkers=2. Full runs also use default and JSON reporters. Player uses the established command-local EPERM-safe Vite preload. Exact exit codes, counts, full failure messages and private-log hashes are retained in the validation JSON.

| Run | Passed | Failed | Skipped | Total | Files | Exit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| clinical-focused-expanded | 161 | 0 | 0 | 161 | 12 | 0 |
| domain-focused-final | 15 | 0 | 0 | 15 | 1 | 0 |
| player-focused | 33 | 0 | 0 | 33 | 2 | 0 |
| clinical-final | 3508 | 11 | 0 | 3519 | 234 | 1 |
| domain-full | 6104 | 27 | 1 | 6132 | 224 | 1 |
| player-full | 5543 | 0 | 0 | 5543 | 456 | 0 |

The seven root workspace typechecks pass. Linter tests pass 33/33. Full-library naming and patient-story guards pass. The new 22 format-3/journal completion witnesses and all new admission/wait checks pass.

Actual content-pacing-check PASSes at tick **26377** against reference 26281, a 0.3653% change inside the ±10% band. The native journey records 442 completions, zero walkouts and positive closing cash.

Raw cue lint reports zero findings in 13 accepted variants across 26 canonical/profile contexts. The entire bank retains 1824 findings in 870 variants before and after this acceptance. No suppression was added.

### clinical-final

```text
Test Files  10 failed | 224 passed (234)
      Tests  11 failed | 3508 passed (3519)
   Start at  23:55:15
   Duration  318.20s (transform 32.27s, setup 0ms, import 506.22s, tests 100.65s, environment 16ms)
exit 1
```

### domain-full

```text
Test Files  2 failed | 222 passed (224)
      Tests  27 failed | 6104 passed | 1 skipped (6132)
   Start at  23:41:47
   Duration  1026.69s (transform 20.51s, setup 0ms, import 622.59s, tests 1403.23s, environment 16ms)
exit 1
```

### player-full

```text
Test Files  456 passed (456)
      Tests  5543 passed (5543)
   Start at  23:41:47
   Duration  1598.06s (transform 26.51s, setup 0ms, import 878.49s, tests 2271.31s, environment 33ms)
exit 0
```

## Preserved guards and remaining failures

The I11 focused test is green. Its original schema SHA256 c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7 is preserved through the exact ENG-I01 optional-schema postimage 530198fa3bb3f9270ba1eaee74974011736d98ba6deb14e9cd27e19d63108296. Its subsequent founder-consult pin is also reconciled against the exact authorized ENG source. The old port-allowlist assertion remains checked against its exact pre-ENG-I01b source. Original captured values are retained.

Historical acceptance and authoring tests use strict full-postimage to immutable-preimage adapters. Additional captures bind the standalone-salvage append, preserving all original source bytes and packet fields. The excluded polypectomy test changes only its frozen-source guard so authorized test-integration edits restore the exact source bytes it captured. Its content, scored decision, review responses and 24 protected pins remain intact. New mutation controls reject unrelated changes. The patient-story verb list additionally recognizes underway and continue/continues, which the reviewed procedure presentations use.

Remaining clinical failures

- question-flags3-20261107.test.ts — flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact. AssertionError: packages/clinical-content/src/schema.ts: expected '530198fa3bb3f9270ba1eaee74974011736d9…' to be 'c4d1640ba549c49b6a3dc7bfdf9155504611d…' // Object.is equality
- question-harden1-n3r4-acceptance-20261110.test.ts — exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures. AssertionError: packages/game-domain/src/test-choice-orders.ts exact authorized acceptance postimage: expected '793450bed94248300965c719be76fd068d35b…' to be '573f4c6156d7c1819db74ad87e9a6413482a8…' // Object.is equality
- question-program-batch5-acceptance-20261111.test.ts — topic batch5 final exact manager acceptance freezes the original reviewed serializations and full source file hashes. AssertionError: packages/clinical-content/src/question-topic-pediatric-neck-thoracic-gu-20261111.ts: expected 'cc088d37bf249056798b48ab7c88182c7f71d…' to be 'a856c174d6b5e7630ecf5ada86699a00ad7a0…' // Object.is equality
- question-program-batch5-acceptance-20261111.test.ts — topic batch5 final exact manager acceptance binds every scoped existing-source correction to its captured preimage. AssertionError: packages/clinical-content/src/question-topic-ethics-professionalism-20261111.test.ts batch5 postimage: expected '30635a058a1fdb4f1c9c4122f917081be4bde…' to be '12f37fe405bdfece7d4c28c90ab6c521eee13…' // Object.is equality
- question-stats1-20261108.test.ts — stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration. AssertionError: packages/clinical-content/src/schema.ts: expected '530198fa3bb3f9270ba1eaee74974011736d9…' to be 'c4d1640ba549c49b6a3dc7bfdf9155504611d…' // Object.is equality
- question-stats1-acceptance-20261108.test.ts — stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions. AssertionError: apps/player/src/session/cloud/automaticResolution.test.ts: expected '09726190a2b74f2c10864ea2b97bb1d3ac5d4…' to be '090773dee1e725c0c90a8d49fe7a0127f8583…' // Object.is equality
- question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts — two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items. AssertionError: expected '2b50af4969797a5071cb5b9ca88e9de7c06e5…' to be '2ea566efc586d806d9c2a284f21b35df35d41…' // Object.is equality
- question-topic-esophagus-motility-achalasia-20261111.test.ts — esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case. AssertionError: expected '0645031a589cf15b2e92318856c5ccdf0a73a…' to be '3ca89049c1d1cda6ad90dadb434e7b200ae45…' // Object.is equality
- question-topic-pediatric-gi-abdominal-wall-20261111.test.ts — pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review. AssertionError: expected 'daa3005e5021e3b4025700f043e87ec59152a…' to be '809e8362400762de8e6d03c294b36d2061980…' // Object.is equality
- question-topic-surgical-infection-antibiotics-20261111.test.ts — surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue. AssertionError: expected [ { …(11) }, { …(11) }, { …(11) } ] to deeply equal [ { …(11) }, { …(11) }, { …(11) } ]
- question-topic-trauma-initial-abdomen-20261111.test.ts — trauma initial abdomen: reviewed clinic chart-review sidecar validates the exact shared acceptance epoch and keeps salvage out of the default release. AssertionError: packages/clinical-content/src/schema.ts: expected '530198fa3bb3f9270ba1eaee74974011736d9…' to be 'c4d1640ba549c49b6a3dc7bfdf9155504611d…' // Object.is equality

Remaining domain failures

- approved-clinical-admission.test.ts — approved clinical admission boundaries keeps the unapproved prototype runtime release limited to explicitly admitted concepts
- level-five-integration.test.ts — M9 connected Level 5 reducer journey binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 5
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 6
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 7
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 8
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 9
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 5
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 6
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 7
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 8
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 9
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 5
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 6
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 7
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 8
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 9
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 5
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 6
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 7
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 8
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 9
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 5
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 6
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 7
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 8
- level-five-integration.test.ts — M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 9

The clinical JSON identifies each retained source/review mismatch. Domain failures remain the explicit concept census and existing Level5 input/legacy-behavior evidence. Evidence and rebind remain manager-owned.

## Level 5 bound inputs

| Recorded changed input | Intake SHA256 | Current SHA256 |
| --- | --- | --- |
| packages/clinical-content/src/synthetic-content.ts | fbec53164c3bfcc12d6c0a5e0e57b28a9c102ec7b25990c4a4939c9327c86b34 | cd8d023c72bb445cc154dc8a6ea35a01f60b4f5b15f10980fe58f50e7ab404cc |
| packages/clinical-content/src/index.ts | 2a0d4fe95613674ee092a0d5cee79410a2822a1e2d5cc940263c3b79417fb95c | 8cb558cfff5a82244d481ce5aa1b303456b8418a0d787313f8cd701dc231d8aa |
| packages/clinical-content/src/answer-choice-timing.ts | 8a3795167915fa8cc4e091988faae70b54779793a094961fc9e95164ebce51b1 | 78c3a41071dd1ae87ac6b18404538fed63ddb152a2fadf19d23a45f446726d83 |
| packages/game-domain/src/test-choice-orders.ts | 13f27aa5d0b902d7992bb8b92bc1a83219dcb3dffff250d4dde2284528d06b6e | 2f134b963295d1f859780dbee88d662036a4fbccff00fc033bfe7ce83d46a06f |

The manifest and the new accepted data/view are additional transitive inputs. The manager owns evidence and behavior rebind. Runtime edits are confined to frozen manifest/views/concepts/family registration and exact timing/order metadata append. Balance, progression, source authoring modules, cloud/Supabase and GS-release stay outside this lane.

This is a local working-tree checkpoint. The manager owns release integration, named clinician approval and the GitHub backup gate. The remaining three salvage cases require supported procedure/resource contracts before admission. The excluded polypectomy candidate remains with its writer and reviewer.
