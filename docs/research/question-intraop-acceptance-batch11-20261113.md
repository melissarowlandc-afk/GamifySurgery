# Intraop acceptance batch 11 — 2026-11-13

**Accepted all four requested standalone live cases and four scored nodes.** Each version retains needs_clinician_review. Batches 9–11 together contain **29 cases and 34 nodes**, comprising 18 live cases with 21 nodes and 11 clinic chart-review cases with 13 nodes.

Batch10 is confirmed as **11 cases and 13 nodes**. Its acceptance table has one row per node. case.intraop.biliary-safety.new-bile.20261112.v1 contains unexplained-bile and major-injury-transfer. case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1 contains fresh-sigmoid-closure and postclip-tension-rescue. The remaining nine batch10 cases each have one node.

## This acceptance

| Case | Node | Exact source family | Independent PASS |
| --- | --- | --- | --- |
| case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1 | node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1 | procedure.anorectal_eua | docs/research/question-intraop-salvage-review-20261113.json |
| case.intraop.parathyroid.missing-gland-salvage.v1 | node.intraop.parathyroid.sample-integrity.v1 | procedure.parathyroidectomy | docs/research/question-intraop-salvage-review-20261113.json |
| case.intraop.parathyroid.gland-preservation-salvage.v1 | node.intraop.parathyroid.selective-salvage.v1 | procedure.thyroidectomy | docs/research/question-intraop-salvage-review-20261113.json |
| case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1 | node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1 | procedure.colonoscopy_polypectomy | docs/research/question-intraop-salvage-review2-20261113.json |

ENG-I01c supplies the distinct anorectal EUA, parathyroidectomy and thyroidectomy families. The endocrine cases bind their exact authored additional resources. Missing-gland uses endocrine surgery, intraoperative PTH and intraoperative ultrasound. Gland-preservation uses endocrine surgery and intraoperative frozen pathology. The reviewed thyroidectomy context retains its own family. The polypectomy case uses therapeutic colonoscopy with the installed closure, rescue and chromoendoscopy capabilities.

Every case is a whole reviewed singleton. All four are adults. Native tests admit each only during its matching staffed procedure in the proper operational reserved room, and reject wrong family, room, room definition, outage, phase, nurse, provider, missing capability and ordinary unsourced admission. The existing ENG-I01c tests additionally verify the thyroid-versus-parathyroid distinction and resource loss. Eight new format-3 and committed-journal witnesses reopen and complete exact frozen encounters with their original FSRS meanings.

Source authoring archives and original claim/source mappings are bound by hashes. Two patient-name substitutions use runtime placeholders in accepted metadata. The original reviewed node and question bytes are frozen alongside their accepted copies. Operative anatomy, sampling and gland viability remain clinician-review boundaries. One authored concept record lacks educationalTier metadata, recorded as an existing metadata gap.

## Every accepted intraop node across batches 9–11

| Batch | Cases | Nodes | Live cases | Live nodes | Chart-review cases | Chart-review nodes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 9 | 14 | 17 | 4 | 5 | 10 | 12 |
| 10 | 11 | 13 | 10 | 12 | 1 | 1 |
| 11 | 4 | 4 | 4 | 4 | 0 | 0 |
| Total | 29 | 34 | 18 | 21 | 11 | 13 |

| Batch | Exact node | Case | Mode | Family |
| --- | --- | --- | --- | --- |
| 9 | node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1 | case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1 | live | procedure.groin_hernia_repair |
| 9 | node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1 | case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1 | case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1 | case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1 | case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1 | case.intraop.groin-hernia.sliding-sac.20261112.v1 | live | procedure.groin_hernia_repair |
| 9 | node.intraop.groin-hernia.adherent-distal-sac.20261112.v1 | case.intraop.groin-hernia.sliding-sac.20261112.v1 | live | procedure.groin_hernia_repair |
| 9 | node.intraop.groin-hernia.urinary-leak-localization.20261112.v1 | case.intraop.groin-hernia.urinary-findings.20261112.v1 | live | procedure.groin_hernia_repair |
| 9 | node.intraop.lap-access.major-access-injury.20261112.v1 | case.intraop.lap-access.outside-access-rescue.20261112.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1 | case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.i25.anatomy-before-dilation.20261112.v1 | case.intraop.i25.unmapped-narrowing.20261112.v1 | live | procedure.egd |
| 9 | node.intraop.i24.battery-injury-imaging.20261112.v1 | case.intraop.i24.battery-injury-record.20261112.v1 | chart_review | procedure.egd |
| 9 | node.intraop.thyroid-nerve-monitoring.proximal-verification.v1 | case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1 | chart_review | procedure.thyroidectomy |
| 9 | node.intraop.thyroid-nerve-monitoring.recording-check.v1 | case.intraop.thyroid-nerve-monitoring.two-signal-events.v1 | chart_review | procedure.thyroidectomy |
| 9 | node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1 | case.intraop.thyroid-nerve-monitoring.two-signal-events.v1 | chart_review | procedure.thyroidectomy |
| 9 | node.intraop.unexpected-bowel.base-margin.20261112.v1 | case.intraop.unexpected-bowel.base-margin.20261112.v1 | chart_review | procedure.hospital_operation |
| 9 | node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1 | case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1 | chart_review | procedure.hospital_operation |
| 10 | node.intraop.asc-access.anterior-port-course.20261112.v1 | case.intraop.asc-access.port-course.20261112.v1 | live | procedure.central_venous_port_insertion |
| 10 | node.intraop.biliary-safety.unexplained-bile.20261112.v1 | case.intraop.biliary-safety.new-bile.20261112.v1 | live | procedure.laparoscopic_cholecystectomy |
| 10 | node.intraop.biliary-safety.major-injury-transfer.20261112.v1 | case.intraop.biliary-safety.new-bile.20261112.v1 | live | procedure.laparoscopic_cholecystectomy |
| 10 | node.intraop.biliary-safety.stone-clearance-route.20261112.v1 | case.intraop.biliary-safety.stone-clearance.20261112.v1 | live | procedure.laparoscopic_cholecystectomy |
| 10 | node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1 | case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1 | live | procedure.colonoscopy_polypectomy |
| 10 | node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1 | case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1 | live | procedure.colonoscopy_polypectomy |
| 10 | node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1 | case.intraop.endoscopic-perforation-and-injury.dilation-observed-defect.v1 | live | procedure.egd |
| 10 | node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1 | case.intraop.suspicious-polyps.new-descending-colon-focus.20261112.v1 | live | procedure.colonoscopy_polypectomy |
| 10 | node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1 | case.intraop.anesthetic-intraoperative-crises.anaphylaxis-response-salvage.v1 | live | procedure.groin_hernia_repair |
| 10 | node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1 | case.intraop.upper-gi-hemostasis.esophageal-variceal-record.20261112-salvage.v1 | chart_review | procedure.egd |
| 10 | node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1 | case.intraop.pediatric-anesthesia-events.egd-airway-salvage.v1 | live | procedure.egd |
| 10 | node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1 | case.intraop.pediatric-anesthesia-events.hernia-airflow-salvage.v1 | live | procedure.groin_hernia_repair |
| 10 | node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1 | case.intraop.pediatric-orchiopexy.inguinal-descent.20261112-salvage.v1 | live | procedure.orchiopexy |
| 11 | node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1 | case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1 | live | procedure.anorectal_eua |
| 11 | node.intraop.parathyroid.sample-integrity.v1 | case.intraop.parathyroid.missing-gland-salvage.v1 | live | procedure.parathyroidectomy |
| 11 | node.intraop.parathyroid.selective-salvage.v1 | case.intraop.parathyroid.gland-preservation-salvage.v1 | live | procedure.thyroidectomy |
| 11 | node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1 | case.intraop.polypectomy.ascending-emr-completion.20261112-salvage.v1 | live | procedure.colonoscopy_polypectomy |

The [machine-readable census](question-intraop-acceptance-batch11-census-20261113.json) binds every row to case/node hashes and question/concept identities.

## Testing waits

Five exact choice bindings are installed as planning estimates with not_executed / future_planned disposition. The source label timing.test.biopsy_pathology lacks a runtime mapping. Its two permanent-histology choices map to the established timing.test.pathology_review profile in accepted timing metadata. The three PTH choices use timing.test.basic_labs. The correction ledger records each source and runtime profile. All five display positive runtime estimates and preserve preview purity.

| Node | Choice | Runtime profile |
| --- | --- | --- |
| node.intraop.parathyroid.sample-integrity.v1 | choice.intraop.parathyroid.sample-integrity.1 — PTH assay using newly collected venous blood. | timing.test.basic_labs |
| node.intraop.parathyroid.sample-integrity.v1 | choice.intraop.parathyroid.sample-integrity.2 — PTH assay using retained postexcision venous blood. | timing.test.basic_labs |
| node.intraop.parathyroid.sample-integrity.v1 | choice.intraop.parathyroid.sample-integrity.3 — PTH assay using aspirate from the removed nodule. | timing.test.basic_labs |
| node.intraop.parathyroid.selective-salvage.v1 | choice.intraop.parathyroid.selective-salvage.2 — Autotransplant the upper gland into neck muscle and submit the remaining lower-gland tissue in full for permanent histology. | timing.test.pathology_review |
| node.intraop.parathyroid.selective-salvage.v1 | choice.intraop.parathyroid.selective-salvage.3 — Retain the upper gland in situ and submit the remaining lower-gland tissue in full for permanent histology. | timing.test.pathology_review |

## Default counts and hashes

| Measure | Before | After |
| --- | ---: | ---: |
| cases | 1432 | 1436 |
| nodes | 1640 | 1644 |
| registeredMeanings | 1138 | 1142 |
| scoredMeanings | 939 | 943 |
| acceptedRows | 807 | 811 |
| timingRows | 2962 | 2966 |

Four new meaning records are appended. Passing guards bind the entire prior case, concept, timing and authority prefix to its captured bytes.

- Manifest question-ship.2026-11-13.v20 with JSON SHA256 5340b68f91005a22f3e75bf4208f566e1ccf948d40ced5578887ca83945ce9a9.
- Default JSON SHA256 4da0db5dd2a1a268440d5a5abc1ea81412224a249d7c089ec98a684442cf654f.
- Timing registry JSON SHA256 dcf61801c053b1a7c72ed38929099df83a9ecf9534a20f0e12ea04e8ee931f42.
- Catalog JSON SHA256 3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40.

## Validation

Vitest commands use npm.cmd test -- --pool=threads --maxWorkers=2 with default and JSON reporters. The player command uses the established command-local EPERM-safe preload. The initial player run was interrupted to apply the two runtime profile mappings, and player-complete is the full final run. Full native logs, exit codes and receipt hashes are recorded in the validation JSON.

| Run | Passed | Failed | Skipped | Total | Files | Exit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| clinical-full | 3514 | 11 | 0 | 3525 | 235 | 1 |
| domain-full | 6125 | 27 | 1 | 6153 | 226 | 1 |
| player-full | 5552 | 0 | 0 | 5552 | 457 | 0 |
| clinical-focused | 109 | 0 | 0 | 109 | 10 | 0 |
| domain-focused | 5 | 0 | 0 | 5 | 1 | 0 |
| player-focused | 20 | 0 | 0 | 20 | 2 | 0 |

Seven root workspace typechecks pass. Linter tests pass 33/33. Full-library patient naming/story guards pass. The four accepted variants have zero cue findings across eight canonical/profile contexts. Whole-bank findings remain 1824 in 870 variants.

The actual final content-pacing CLI passes at tick **26377** against reference 26281, a 0.3653% change within the ±10% band. It records 442 completions, zero walkouts and positive closing cash.

### clinical-full

```text
Test Files  10 failed | 225 passed (235)
      Tests  11 failed | 3514 passed (3525)
   Start at  01:05:42
   Duration  331.01s (transform 36.34s, setup 0ms, import 529.18s, tests 105.87s, environment 16ms)
exit 1
```

### domain-full

```text
Test Files  2 failed | 224 passed (226)
      Tests  27 failed | 6125 passed | 1 skipped (6153)
   Start at  00:58:20
   Duration  1036.91s (transform 20.69s, setup 0ms, import 587.64s, tests 1460.29s, environment 15ms)
exit 1
```

### player-full

```text
Test Files  457 passed (457)
      Tests  5552 passed (5552)
   Start at  00:58:20
   Duration  1580.91s (transform 26.68s, setup 0ms, import 905.44s, tests 2208.53s, environment 34ms)
exit 0
```

## Remaining failures and manager work

Original guards are retained through exact historical adapters. Batch10 receipts are checked against their captured epoch, while the new batch11 tests independently check current admission and source integrity. The authorized ENG-I01c plan and family additions have strict recorded postimages and original preimages. The polypectomy authoring exclusion now checks its exact pre-acceptance manifest. Captures, assertions and budgets are retained.

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

Per-failure baseline membership and complete messages are in the validation JSON. The manager owns the historical source/review guards, explicit concept census and Level5 evidence refresh.

## Level5 bound inputs and file handoff

| Changed direct recorded input | Intake SHA256 | Current SHA256 |
| --- | --- | --- |
| packages/clinical-content/src/synthetic-content.ts | cd8d023c72bb445cc154dc8a6ea35a01f60b4f5b15f10980fe58f50e7ab404cc | 8138cc7fb13ccd1b22d84d9f44946ccc3cd52ed359d6f40aa6e6ab4f1ac64b02 |
| packages/clinical-content/src/index.ts | 8cb558cfff5a82244d481ce5aa1b303456b8418a0d787313f8cd701dc231d8aa | 21f7bde921f364390bc5e052d7bb64a4f90b293e4a5dd0a019adaa9690e4a623 |
| packages/clinical-content/src/answer-choice-timing.ts | 78c3a41071dd1ae87ac6b18404538fed63ddb152a2fadf19d23a45f446726d83 | 4bf693582b64fd94a8cabf5d6dc704b84da58500f90cc09898135667b899a377 |
| packages/game-domain/src/test-choice-orders.ts | 2f134b963295d1f859780dbee88d662036a4fbccff00fc033bfe7ce83d46a06f | 84a18f3fc8a0a27cf46f18bd14cf990ef7a9702c592c6d333fd1d3b99436f0fc |

The manifest and accepted view/data are additional transitive inputs. The manager owns rebind and release. This is a local working-tree checkpoint.

Artifacts include the [review packet](question-intraop-acceptance-batch11-packet-20261113.json), [source freeze](question-intraop-acceptance-batch11-source-freeze-20261113.json), [correction and wait ledger](question-intraop-acceptance-batch11-dispositions-20261113.json), [validation](question-intraop-acceptance-batch11-validation-20261113.json) and [file/hash receipt](question-intraop-acceptance-batch11-files-20261113.json). The packet marks the key first for review only. Runtime choices remain randomized.
