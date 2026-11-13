# Intraop / intra-endoscopy acceptance batch9 — 2026-11-12

**Accepted 17 requested PASS nodes in 14 complete cases; skipped 18.** All remain needs_clinician_review, with no named clinical approval inferred. No question-intraop-* authoring source was edited.

## Acceptance and admission

| Node | Case | Mode / family | Latest review |
| --- | --- | --- | --- |
| node.intraop.anesthetic-intraoperative-crises.mh-potassium-cardiotoxicity.v1 | case.intraop.anesthetic-intraoperative-crises.mh-electrolyte.v1 | live / procedure.groin_hernia_repair | docs/research/question-intraop-anesthetic-intraoperative-crises-review2-20261112.json |
| node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1 | case.intraop.endoscopic-perforation-and-injury.postclip-hospital-record.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-endoscopic-perforation-and-injury-review2-20261112.json |
| node.intraop.ercp-access-and-adverse-events.periampullary-diversion.v1 | case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-ercp-access-and-adverse-events-review2-20261112.json |
| node.intraop.ercp-access-and-adverse-events.collection-after-diversion.v1 | case.intraop.ercp-access-and-adverse-events.periampullary-injury-course.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-ercp-access-and-adverse-events-review2-20261112.json |
| node.intraop.ercp-access-and-adverse-events.pancreatic-protection-after-access.v1 | case.intraop.ercp-access-and-adverse-events.pancreatic-protection.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-ercp-access-and-adverse-events-review-20261112.json |
| node.intraop.groin-hernia.sliding-sigmoid-plane.20261112.v1 | case.intraop.groin-hernia.sliding-sac.20261112.v1 | live / procedure.groin_hernia_repair | docs/research/question-intraop-groin-hernia-anatomy-and-injury-review2-20261112.json |
| node.intraop.groin-hernia.adherent-distal-sac.20261112.v1 | case.intraop.groin-hernia.sliding-sac.20261112.v1 | live / procedure.groin_hernia_repair | docs/research/question-intraop-groin-hernia-anatomy-and-injury-review2-20261112.json |
| node.intraop.groin-hernia.urinary-leak-localization.20261112.v1 | case.intraop.groin-hernia.urinary-findings.20261112.v1 | live / procedure.groin_hernia_repair | docs/research/question-intraop-groin-hernia-anatomy-and-injury-review2-20261112.json |
| node.intraop.lap-access.major-access-injury.20261112.v1 | case.intraop.lap-access.outside-access-rescue.20261112.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-laparoscopic-access-and-insufflation-review2-20261112.json |
| node.intraop.operative-hemorrhage.pringle-persistent-posterior.20261112.v1 | case.intraop.operative-hemorrhage.posterior-liver-record.20261112.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-operative-hemorrhage-and-splenic-injury-review2-20261112.json |
| node.intraop.i25.anatomy-before-dilation.20261112.v1 | case.intraop.i25.unmapped-narrowing.20261112.v1 | live / procedure.egd | docs/research/question-intraop-pediatric-egd-food-impaction-eoe-review2-20261112.json |
| node.intraop.i24.battery-injury-imaging.20261112.v1 | case.intraop.i24.battery-injury-record.20261112.v1 | chart_review / procedure.egd | docs/research/question-intraop-pediatric-endoscopy-foreign-body-review2-20261112.json |
| node.intraop.thyroid-nerve-monitoring.proximal-verification.v1 | case.intraop.thyroid-nerve-monitoring.distal-response-coverage.v1 | chart_review / procedure.thyroidectomy | docs/research/question-intraop-thyroid-nerve-monitoring-review2-20261112.json |
| node.intraop.thyroid-nerve-monitoring.recording-check.v1 | case.intraop.thyroid-nerve-monitoring.two-signal-events.v1 | chart_review / procedure.thyroidectomy | docs/research/question-intraop-thyroid-nerve-monitoring-review2-20261112.json |
| node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1 | case.intraop.thyroid-nerve-monitoring.two-signal-events.v1 | chart_review / procedure.thyroidectomy | docs/research/question-intraop-thyroid-nerve-monitoring-review2-20261112.json |
| node.intraop.unexpected-bowel.base-margin.20261112.v1 | case.intraop.unexpected-bowel.base-margin.20261112.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-unexpected-appendix-and-bowel-findings-review2-20261112.json |
| node.intraop.unexpected-bowel.ileitis-restraint.20261112.v1 | case.intraop.unexpected-bowel.ileitis-restraint.20261112.v1 | chart_review / procedure.hospital_operation | docs/research/question-intraop-unexpected-appendix-and-bowel-findings-review2-20261112.json |

## Skipped — not present in fresh supply

| Node | Reason | Unaccepted scored siblings |
| --- | --- | --- |
| node.intraop.anesthetic-intraoperative-crises.anaphylaxis-infusion.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.anesthetic-intraoperative-crises.anaphylaxis-first-drug.v1 |
| node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.anorectal-eua.changed-tract-sampling.20261112.v1 |
| node.intraop.asc-access.anterior-port-course.20261112.v1 | No supported port-insertion procedure family or fluoroscopic port-redirection capability exists in ENG-I01. | none |
| node.intraop.biliary-safety.major-injury-transfer.20261112.v1 | As written the cases require fluoroscopy/near-infrared cholangiography or transcystic exploration. ENG-I01 does not establish these specialized capabilities from its generic cholecystectomy family. | none |
| node.intraop.biliary-safety.stone-clearance-route.20261112.v1 | As written the cases require fluoroscopy/near-infrared cholangiography or transcystic exploration. ENG-I01 does not establish these specialized capabilities from its generic cholecystectomy family. | none |
| node.intraop.biliary-safety.unexplained-bile.20261112.v1 | As written the cases require fluoroscopy/near-infrared cholangiography or transcystic exploration. ENG-I01 does not establish these specialized capabilities from its generic cholecystectomy family. | none |
| node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1 | The live cases explicitly require confirmed closure-device expertise and stocked closure/rescue equipment. ENG-I01 establishes a generic EGD/colonoscopy source, not those specialized capabilities. | none |
| node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1 | The live cases explicitly require confirmed closure-device expertise and stocked closure/rescue equipment. ENG-I01 establishes a generic EGD/colonoscopy source, not those specialized capabilities. | none |
| node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1 | The live cases explicitly require confirmed closure-device expertise and stocked closure/rescue equipment. ENG-I01 establishes a generic EGD/colonoscopy source, not those specialized capabilities. | none |
| node.intraop.upper-gi-hemostasis.dry-tear-visible-vessel.20261112.v1 | The live case requires a booked therapeutic hemostasis service/equipment; ENG-I01 does not establish that scope from the generic diagnostic EGD family. | none |
| node.intraop.upper-gi-hemostasis.esophageal-plug-treatment.20261112.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.upper-gi-hemostasis.failed-banding-stent-bridge.20261112.v1 |
| node.intraop.parathyroid.sample-integrity.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.parathyroid.inferior-search.v1 |
| node.intraop.parathyroid.selective-salvage.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.parathyroid.capsular-branches.v1 |
| node.intraop.pediatric-anesthesia-events.persistent-laryngeal-closure.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.pediatric-anesthesia-events.postobstructive-lung-support.v1 |
| node.intraop.pediatric-anesthesia-events.ventilated-expiratory-wheeze.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.pediatric-anesthesia-events.incomplete-expiration-adjustment.v1 |
| node.intraop.pediatric-orchiopexy.residual-cord-bands.20261112.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.pediatric-orchiopexy.ring-entry.20261112.v1 |
| node.intraop.polypectomy.right-colon-defect-after-clearance.20261112.v1 | Whole-case acceptance: scored siblings are not in the manager PASS list. | node.intraop.polypectomy.visible-remnant-before-margin-treatment.20261112.v1 |
| node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1 | Magnifying dye chromoendoscopy and its trained optical-assessment/specimen workflow are not represented by the installed generic colonoscopy capability. | none |

The accepted split is **4 live cases / 5 scored nodes** and **10 clinic chart-review cases / 12 scored nodes**. I18 uses its existing authored I18_SCORABLE_PREVIEW_CASES two-node source: its held third construct was already excluded by that export. No node was cut from a scored source case by this lane. All other mixed cases stay withheld. There are no retirements or replacement relations in this additive batch.

Live contracts bind only procedure.groin_hernia_repair (staffed ASC OR, ordinary/extended operation line) and the authored pediatric procedure.egd (staffed endoscopy room). Native tests exercise each real source through its actual procedure phase and reject wrong family, room, phase, nurse, provider or capability and ordinary unsourced admission. The child additionally needs Level 4, an accessible operational Pediatric Examination Room, one exact parent and matching 5–17 child art. Its family/source survives format-3 and journal reloads. Hospital procedures stay in clinic records; no local hospital equipment or ENG-I02 executed result is implied.

The source freeze retains both original and accepted question/node/case serializations and hashes, plus source/review files and thirty unchanged authoring-packet/ledger dependencies. Eighteen name-only string substitutions use {patientName}; pronouns already match the single constrained profile. One newline in the derived combined summary is normalized to a space by the existing projector. No clinical wording, option/key, explanation, concept identity or approval change occurred. The packet is key-first **for review only**; runtime shuffling remains enabled.

Artifacts: [packet](question-intraop-acceptance-batch9-packet-20261112.json), [source freeze](question-intraop-acceptance-batch9-source-freeze-20261112.json), [dispositions/correction ledger](question-intraop-acceptance-batch9-dispositions-20261112.json), [validation/full failure details](question-intraop-acceptance-batch9-validation-20261112.json). Existing source records and atomic claims are reused exactly (17 question mappings,174 retained claims,58 source records; no missing mappings or new clinical claims). Specialized device/operative feasibility and rescue protocols remain clinician-review boundaries.

Original authored concept records are exported unchanged. Six omit an educationalTier field; this metadata gap is recorded rather than inferred from facility stage. All facility-stage, patient-profile and procedure-capability gates remain separate and retain their authored values.

## Runtime testing estimates

**All 16 required bindings are installed; none remain.** These reuse authored existing profiles as planning-only, not-executed choices, including distractors. They do not assert local availability or enact tests/results. No fixed wait is inserted into clinical prose.

| Node | Choice | Existing timing profile |
| --- | --- | --- |
| node.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1 | choice.intraop.endoscopic-perforation-and-injury.postclosure-gas-observation.v1.repeat — Repeat colonoscopy to reassess the clipped defect | timing.test.lower_endoscopy |
| node.intraop.groin-hernia.urinary-leak-localization.20261112.v1 | choice.intraop.groin-hernia.urinary-leak-localization.retrograde-fill.20261112.v1 — Instill dyed saline through the indwelling catheter | timing.test.general_diagnostic |
| node.intraop.groin-hernia.urinary-leak-localization.20261112.v1 | choice.intraop.groin-hernia.urinary-leak-localization.iv-dye.20261112.v1 — Give intravenous indigo carmine and inspect the field | timing.test.general_diagnostic |
| node.intraop.groin-hernia.urinary-leak-localization.20261112.v1 | choice.intraop.groin-hernia.urinary-leak-localization.pyelogram.20261112.v1 — Obtain retrograde pyelography through a ureteric catheter | timing.test.radiography |
| node.intraop.i25.anatomy-before-dilation.20261112.v1 | choice.intraop.i25.anatomy-before-dilation.esophagram.20261112.v1 — Barium contrast esophagram | timing.test.contrast_swallow |
| node.intraop.i25.anatomy-before-dilation.20261112.v1 | choice.intraop.i25.anatomy-before-dilation.manometry.20261112.v1 — High-resolution esophageal manometry | timing.test.esophageal_manometry |
| node.intraop.i25.anatomy-before-dilation.20261112.v1 | choice.intraop.i25.anatomy-before-dilation.biopsies.20261112.v1 — Repeat esophageal mucosal biopsies | timing.test.esophageal_multilevel_biopsy |
| node.intraop.i24.battery-injury-imaging.20261112.v1 | choice.intraop.i24.battery-injury-imaging.cta.20261112.v1 — Computed tomographic chest angiography | timing.test.ct_angiography |
| node.intraop.i24.battery-injury-imaging.20261112.v1 | choice.intraop.i24.battery-injury-imaging.swallow.20261112.v1 — Water-soluble contrast esophagography | timing.test.contrast_swallow |
| node.intraop.i24.battery-injury-imaging.20261112.v1 | choice.intraop.i24.battery-injury-imaging.egd.20261112.v1 — Catheter-based thoracic aortography | timing.test.advanced_diagnostic |
| node.intraop.thyroid-nerve-monitoring.proximal-verification.v1 | choice.intraop.thyroid-nerve-monitoring.proximal-verification.1 — Obtain operated-side vagal responses to determine further resection | timing.test.clinical_procedure |
| node.intraop.thyroid-nerve-monitoring.proximal-verification.v1 | choice.intraop.thyroid-nerve-monitoring.proximal-verification.3 — Stage right lobectomy pending postoperative flexible laryngoscopy | timing.test.clinical_procedure |
| node.intraop.thyroid-nerve-monitoring.recording-check.v1 | choice.intraop.thyroid-nerve-monitoring.recording-check.1 — Check tube position and electrode contact | timing.test.clinical_procedure |
| node.intraop.thyroid-nerve-monitoring.recording-check.v1 | choice.intraop.thyroid-nerve-monitoring.recording-check.2 — Check neuromuscular recovery with quantitative twitch monitoring | timing.test.clinical_procedure |
| node.intraop.thyroid-nerve-monitoring.recording-check.v1 | choice.intraop.thyroid-nerve-monitoring.recording-check.3 — Check stimulus delivery with a replacement probe | timing.test.clinical_procedure |
| node.intraop.thyroid-nerve-monitoring.verified-loss-extent.v1 | choice.intraop.thyroid-nerve-monitoring.verified-loss-extent.3 — Exchange the electrode tube before completing right lobectomy | timing.test.clinical_procedure |

## Counts and hashes

| Measure | Before | After |
| --- | ---: | ---: |
| cases | 1407 | 1421 |
| nodes | 1610 | 1627 |
| registeredMeanings | 1109 | 1126 |
| scoredMeanings | 909 | 926 |
| acceptedRows | 777 | 794 |
| timingRows | 2932 | 2949 |

Manifest: question-ship.2026-11-12.v18; SHA256 895e5c9a6c589117efb64e84499fe60172ec4a9ab6f9f2777a9c0d590e062b83. Default SHA256 3cca07abdb08699e4de7cb06715a830a5d170dd8558a1ba67e29231bd901d3f0. Catalog SHA256 3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40 (unchanged). Timing SHA256 2a5023ff0ce6314b514790ae06571da795076ee3e3c972508c9ba3d47223bcf5. All 1407 previous cases,1109 registered meanings,777 authority rows and2932 timing tuples remain exact and in order.

## Validation

| Check | Exact result |
| --- | --- |
| clinical-final | 3464 passed / 12 failed / 0 skipped (3476); 233 files; exit 1 |
| domain-full | 6063 passed / 27 failed / 1 skipped (6091); 222 files; exit 1 |
| player-full | 5520 passed / 0 failed / 0 skipped (5520); 455 files; exit 0 |
| Seven workspace typechecks | 7/7 passed; exit 0 |
| Cue-linter tests | 33 passed /0 failed; exit 0 |
| Accepted cue lint | 0 findings /17 variants /34 profile contexts; no suppressions |
| Whole-bank cue lint | 1824 findings before =1824 after |
| Actual content pacing CLI | PASS; first-finish 26281; reference 26281; drift 0%; exit 0 |

Pacing used the unmodified tools/qa/content-pacing-check.mjs and its ±10% bound (23,653–28,909). Closing cash 5887602 cents, 440 completions, 0 walkouts. No balance, progression, driver, reference or timeout changes.

Full player includes 28 new format-3/journal witnesses, both historical batch3/4 save suites (422/590 tests), the new wait-label group and existing ENG-I01 presentation tests. New domain integration has 16 passing tests. Twelve historical authoring test files use strict exact-epoch bridges for original exclusions/source pins; no assertion/capture or budget is removed. New current-default and mutation-rejection tests independently protect acceptance. The full-library naming guard passes.

Exact clinical-final output:

```text
Test Files  11 failed | 222 passed (233)
      Tests  12 failed | 3464 passed (3476)
   Start at  22:14:27
   Duration  247.47s (transform 26.72s, setup 0ms, import 402.53s, tests 68.96s, environment 13ms)
exit 1
```

Exact domain-full output:

```text
Test Files  2 failed | 220 passed (222)
      Tests  27 failed | 6063 passed | 1 skipped (6091)
   Start at  21:35:48
   Duration  1456.36s (transform 33.61s, setup 0ms, import 954.07s, tests 1914.60s, environment 24ms)
exit 1
```

Exact player-full output:

```text
Test Files  455 passed (455)
      Tests  5520 passed (5520)
   Start at  21:32:49
   Duration  2159.85s (transform 38.80s, setup 0ms, import 1245.55s, tests 3012.39s, environment 45ms)
exit 0
```

Remaining clinical failures (all retained intake-era pins/guards; see JSON for messages):

- question-flags3-20261107.test.ts: flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact
- question-harden1-n3r4-acceptance-20261110.test.ts: exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures
- question-intraop-anesthetic-intraoperative-crises-20261112.test.ts: I11 explicit-import intraoperative crisis authoring sidecar preserves the exact before serializations and all captured source hashes
- question-program-batch5-acceptance-20261111.test.ts: topic batch5 final exact manager acceptance freezes the original reviewed serializations and full source file hashes
- question-program-batch5-acceptance-20261111.test.ts: topic batch5 final exact manager acceptance binds every scoped existing-source correction to its captured preimage
- question-stats1-20261108.test.ts: stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration
- question-stats1-acceptance-20261108.test.ts: stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions
- question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts: two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items
- question-topic-esophagus-motility-achalasia-20261111.test.ts: esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case
- question-topic-pediatric-gi-abdominal-wall-20261111.test.ts: pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review
- question-topic-surgical-infection-antibiotics-20261111.test.ts: surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue
- question-topic-trauma-initial-abdomen-20261111.test.ts: trauma initial abdomen: reviewed clinic chart-review sidecar validates the exact shared acceptance epoch and keeps salvage out of the default release

Remaining domain failures (manager census/evidence lane; source/behavioral captures unchanged):

- approved-clinical-admission.test.ts: approved clinical admission boundaries keeps the unapproved prototype runtime release limited to explicitly admitted concepts
- level-five-integration.test.ts: M9 connected Level 5 reducer journey binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 5
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 6
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 7
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 8
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 9
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 5
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 6
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 7
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 8
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 9
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 5
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 6
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 7
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 8
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 9
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 5
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 6
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 7
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 8
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 9
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 5
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 6
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 7
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 8
- level-five-integration.test.ts: M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 9

## Level 5 bound inputs and scope

| Changed recorded input | Before SHA256 | After SHA256 |
| --- | --- | --- |
| packages/clinical-content/src/synthetic-content.ts | 1a87490f6ba82ed0bd0a1673e10e0fe5f6be48cfc584f31d3a22551cb14fcc38 | fbec53164c3bfcc12d6c0a5e0e57b28a9c102ec7b25990c4a4939c9327c86b34 |
| packages/clinical-content/src/index.ts | a6f8bec343b46ad08b0c810c0b9b6b32f5fcc849adb50debc1deb4d4cb0b0461 | 2a0d4fe95613674ee092a0d5cee79410a2822a1e2d5cc940263c3b79417fb95c |
| packages/clinical-content/src/answer-choice-timing.ts | 721dd09e871137e975c15edb39270e02406a5b058b9aca41b20f637e4c28bac9 | 8a3795167915fa8cc4e091988faae70b54779793a094961fc9e95164ebce51b1 |
| packages/game-domain/src/test-choice-orders.ts | e08fd207f81a6d07a5ac4e02f3f770653a6c6755d3d92d8756c6f118ee2bde03 | 13f27aa5d0b902d7992bb8b92bc1a83219dcb3dffff250d4dde2284528d06b6e |

Manifest and the new accepted-data/view module are additional transitive inputs. No Level 5 evidence, pin or behavioral capture was edited or rebound. The exact file/digest list is in the validation JSON and source-migration ledger; twelve question-intraop-*.test.ts files changed only historical test contexts, never authoring .ts or packets. No runtime routing/progression, balance-config, save/cloud, Supabase, GS-release, network, Git, install, agent, deploy or rebind operation.

The [file receipt](question-intraop-acceptance-batch9-files-20261112.json) lists every owned new/changed file and hash, plus preserved concurrent observations. Runtime metadata changes are confined to the manifest, accepted view/data, minimal index/synthetic registration, timing registry and the test-choice-order append. Other existing-source edits are tests or strict test-support adapters.

Handoff: the accepted bytes and supported routes are ready for manager integration. The18 excluded nodes require whole-case salvage or explicit specialized family/capability work before reconsideration. Named clinical sign-off and browser visual QA remain with the manager/clinician. This is a local working-tree checkpoint; the manager owns the GitHub backup/release gate.
