# Topic program acceptance batch 6 - 2026-11-12

Accepted **all four requested salvage PASS nodes as four complete cases**.
There are **zero requested-node skips**. Every accepted question and family
record remains **needs_clinician_review**. Manifest `question-ship.2026-11-12.v15`
has **690 authority rows**. The default contains **1340 cases, 1535 nodes,
1039 registered meanings and 844 scored meanings**.

[The acceptance packet](question-topic-acceptance-batch6-packet-20261112.json)
contains exact source/review/claim records, node and question hashes, current
clinical contexts, runtime probes, family bindings and cue findings. Keys are
shown first for review only. Runtime choices shuffle.

## Accepted identities

| Node | Accepted standalone case | Question variant | Concept |
| --- | --- | --- | --- |
| node.pediatric-neck-thoracic-gu.20261111.node-sample | case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1 | question.pediatric-neck-thoracic-gu.20261111.node-sample.v1 | concept.pediatric-neck-thoracic-gu.inadequate-node-sample-escalation.v1 |
| node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy | case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1 | question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1 | concept.pediatric-neck-thoracic-gu.mediastinal-peripheral-biopsy-route.v1 |
| node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1 | question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | concept.pediatric-neck-thoracic-gu.proximal-hypospadias-gonadal-workup.v2 |
| node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2 | case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1 | question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2 | concept.pediatric-neck-thoracic-gu.cdh-physiologic-readiness.v1 |

Each accepted record has a PASS verdict in
docs/research/question-topic-pediatric-neck-thoracic-gu-review-salvage-20261111.json.
The negative-exploration and pyogenic-drainage identities are excluded under
the manager's decision. Their salvage verdicts remain REVISE and they have
zero acceptance rows. Each accepted case contains exactly one scored node.

## Frozen source and presentation corrections

[The source archive](question-topic-acceptance-batch6-source-freeze-20261112.json)
retains all four original reviewed node/question serializations and original
source-file hashes. Serialized object order matches all four runtime records.
The accepted source-view hash is recorded below.

Six exact patient-name substitutions affect three accepted cases. The
[presentation correction ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch6-literal-name-corrections-20261112.json)
binds every original/revised string and its source hash. Fixed ages, sex,
pronouns, options, keys and explanation meaning retain their reviewed values.
The family records bind each named child, selected profile, child art and
named parent to the real runtime chart.

## Pediatric admission and family bindings

All four cases pass native admission with their prospective timing and family
metadata installed. They use an operational Pediatric Examination Room, a
single compatible child profile and one parent. The CDH visit uses the reviewed
current six-year-old child profile while its question concerns neonatal ICU
records. The chart-review chronology remains explicit in the source context.

The clinical package's public family registry now composes the original 20
families with four exact manifest-accepted family records. Index exports expose
that registry to the existing pediatric admission functions. The original
20 family objects retain exact serialized values. The topic preview test now
uses the public registry and verifies exact later acceptance membership.

| Case | Profile | Child | Age / sex | Child art | Parent |
| --- | --- | --- | --- | --- | --- |
| case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1 | profile.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1 | Lucas Ellis | 14 / Male | level3-roster-v2.030 | Sarah Ellis (mother) |
| case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1 | profile.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1 | Grace Turner | 11 / Female | level3-roster-v2.027 | James Turner (father) |
| case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1 | profile.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1 | Noah Wells | 5 / Male | level3-roster-v2.022 | Daniel Wells (father) |
| case.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1 | profile.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness-salvage.v1 | Isla Chen | 6 / Female | level3-roster-v2.021 | Mei Chen (mother) |

| Family registry | Count | SHA-256 |
| --- | --- | --- |
| Before | 20 | 8ce0fd8265aabb096dadc92bb42a2a538d9194c3896c458e7c3184d129fcf45c |
| After | 24 | 200c354f793202a1a9dd8b9683ec6b989f90063d188401e9e57a4c5e5b7f51ca |

## Runtime wait bindings

**Current test-order/wait-binding count is zero.** Each accepted source timing
row is no_test. These decisions review outside care. Their options have no
service requests and their nodes have no result gate. Real admission and
completion create zero service operations. All four timing rows are installed.

| Accepted node | Current classification | Runtime wait bindings needed |
| --- | --- | --- |
| node.pediatric-neck-thoracic-gu.20261111.node-sample | no_test | 0 |
| node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy | no_test | 0 |
| node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | no_test | 0 |
| node.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2 | no_test | 0 |

Eight option labels describe outside investigations or biopsy plans. The
source author's proposed profiles are retained below with their exact node
and choice identities for future planning-preview work. The original proposals
identify the earlier main-case contexts. The packet records both those source
proposals and their matching accepted standalone case IDs.

| Node | Accepted case | Choice | Outside-record label | Authored proposed profile |
| --- | --- | --- | --- | --- |
| node.pediatric-neck-thoracic-gu.20261111.node-sample | case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.node-sample.excision | Excisional biopsy of the cervical node | timing.test.biopsy |
| node.pediatric-neck-thoracic-gu.20261111.node-sample | case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.node-sample.fna | Repeat fine-needle aspiration of the cervical node | timing.test.biopsy |
| node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy | case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.peripheral | Cervical-node excision with local anesthesia | timing.test.biopsy |
| node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy | case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.thoracoscopy | Mediastinal thoracoscopy with general anesthesia | timing.test.biopsy |
| node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy | case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.core | Mediastinal core biopsy with deep sedation | timing.test.biopsy |
| node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.17ohp | Baseline serum 17-hydroxyprogesterone | timing.test.advanced_diagnostic |
| node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.amh | Baseline serum anti-Mullerian hormone | timing.test.advanced_diagnostic |
| node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2 | case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1 | choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.stimulated | Cosyntropin-stimulated adrenal steroid profile | timing.test.combined_diagnostic |

## Projection and frozen-save compatibility

Two ordinary whole-case replacements retire
case.pediatric-clinic.growing-firm-neck-node and
case.pediatric-clinic.retractile-testis-remains-scrotal from fresh selection.
The original 1035 meaning definitions and 686 authority rows pass exact
preservation checks. Four source-declared meaning versions are added. Every
other prior default case is hash-bound to its original serialization.

All **eight new compatibility tests pass**. Four verify default admission,
canonical child/parent/art, format-3 reopening and complete FSRS scoring. Two
verify retired snapshot reopening/completion and two verify committed original
admission-journal replay/completion. Original question and concept identities,
existing reviews and frozen fields remain checked. Existing budgets remain.

| Retired case | Original question | Original SHA-256 |
| --- | --- | --- |
| case.pediatric-clinic.growing-firm-neck-node | question.pediatric-clinic.growing-firm-neck-node.v2 | c92eba9d6bc0c304952970f51c4a9574244d53127c0e35274bddef6a09c37367 |
| case.pediatric-clinic.retractile-testis-remains-scrotal | question.pediatric-clinic.retractile-testis-remains-scrotal.v1 | 615f4397f8666bf2248909ffc3c2156bdd532295bc001e6c7742fe97dfa0fd0e |

## Counts and hashes

| Measure | Before | After |
| --- | --- | --- |
| cases | 1338 | 1340 |
| nodes | 1533 | 1535 |
| registeredMeanings | 1035 | 1039 |
| scoredMeanings | 840 | 844 |
| acceptedRows | 686 | 690 |
| timingRows | 2836 | 2840 |

| Artifact | SHA-256 |
| --- | --- |
| Default release | 4eef72623a1de415f302d7d44819b40a4749b523d18c325102ad35b5d0c5d2e7 |
| Manifest | 75c681e29d13d5dbe27fa5f5599244276f9e314b3e9ef1b95f0a91fa41a0ad91 |
| Authoring catalog | 3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40 |

| Accepted source view | Cases | Nodes | SHA-256 |
| --- | --- | --- | --- |
| topic-batch6-pediatric-neck-thoracic-gu | 4 | 4 | 51c69bd360532acf227f708a1e3ed75427d80c2e0d12f64b6c7b512a8cb03867 |

The packet reuses 15 existing atomic claims and
7 source records from the topic's source ledger,
including full citations, URLs, reuse status and claim links. This integration
adds no clinical facts or external-source records.

## Validation and remaining guards

Vitest runs use npm.cmd with --pool=threads --maxWorkers=2. Player tests use
the existing Windows preload and an explicit native exit capture. Full output,
commands and every failure message are recorded in
[the validation receipt](question-topic-acceptance-batch6-validation-20261112.json)
and .local-dev/question-topic-acceptance-batch6-20261112/.

| Run | Files | Pass | Fail | Skip | Duration |
| --- | --- | --- | --- | --- | --- |
| clinical-final | 201 | 2942 | 10 | 0 | Duration  313.91s (transform 51.02s, setup 0ms, import 540.38s, tests 57.53s, environment 17ms) |
| domain-final | 218 | 5876 | 27 | 1 | Duration  1113.09s (transform 49.22s, setup 0ms, import 820.18s, tests 1369.42s, environment 23ms) |
| player-focused | 4 | 89 | 0 | 0 | Duration  104.07s (transform 37.73s, setup 0ms, import 61.80s, tests 127.83s, environment 0ms) |
| focused-final | 9 | 117 | 2 | 0 | Duration  49.40s (transform 34.24s, setup 0ms, import 90.74s, tests 5.89s, environment 1ms) |

The final clinical run retains all eight failure titles from the previous
runtime-binding validation plus the two source pins already mismatched at
this task's intake. The domain run retains the same 27 failure titles,
comprising 26 Level5 evidence/input bindings and the legacy 587-meaning census.
The census currently observes 1039 meanings. Manager reconciliation remains
pending for these retained guards. Native exits are recorded for each run.

Workspace typechecks pass 7/7.
Cue tests pass 33/33. The complete naming guard passes in focused and full
clinical runs. The initial focused run includes two earlier batch5 source-pin
mismatches. Their observed hashes already differed at this task's intake.

Two narrow topic-test corrections bind pediatric membership to exact accepted
authority and make the wound-healing manifest-source assertion use the complete
exported current identity. Its earlier date-only assertion expired with v15.
The receipt retains the first full run and the final rerun after this repair.

The eight outside-record wait-profile proposals remain pending domain review.
The accepted source's no_test classification and zero service operations are
covered by all four real pediatric admission/completion tests.

| Input with pre-existing guard mismatch | Recorded batch5 SHA-256 | This task intake SHA-256 |
| --- | --- | --- |
| packages/clinical-content/src/question-topic-pediatric-neck-thoracic-gu-20261111.ts | a856c174d6b5e7630ecf5ada86699a00ad7a03a8261398318630d80b62a5037c | cc088d37bf249056798b48ab7c88182c7f71df4e8730f447299844c9ae55ce00 |
| packages/clinical-content/src/question-topic-vascular-venous-lymphatic-access-20261111.test.ts | 929774f0ccc716c7d5e6b239218c9deabf4aeb52bd9688a994a67f57fda17985 | 3db4d1b3a2567118aec011246bf538c275fc3df2981d4f1b2b710a0f6cb0ff17 |

The old batch5 guard chain validates this acceptance's exact projection,
manifest, timing and source deltas before restoring historical contexts. The
four additional family records are separately hash-bound. Existing clinical,
source, ownership and approval assertions remain in place.

| Run | File | Failing test |
| --- | --- | --- |
| clinical-final | packages/clinical-content/src/question-flags3-20261107.test.ts | flags3 exact owner-flag candidates and retained live source leaves every existing protected source and decision file byte-exact |
| clinical-final | packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts | exact harden1 H1-03 and two N3R4 PASS acceptances pins each explicit authorized preimage without changing immutable captures |
| clinical-final | packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance freezes the original reviewed serializations and full source file hashes |
| clinical-final | packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance binds every scoped existing-source correction to its captured preimage |
| clinical-final | packages/clinical-content/src/question-stats1-20261108.test.ts | stats1 short single-skill candidates without live acceptance preserves every protected source/capture through the exact authorized standard/test-hook migration |
| clinical-final | packages/clinical-content/src/question-stats1-acceptance-20261108.test.ts | stats1 exact manager acceptance and frozen identities pins each authorized existing-source delta before preserving old capture assertions |
| clinical-final | packages/clinical-content/src/question-topic-esophagus-gerd-barrett-hiatal-20261111.test.ts | two returned salvage revisions rechecks only the two returned contexts and preserves the nine earlier accepted items |
| clinical-final | packages/clinical-content/src/question-topic-esophagus-motility-achalasia-20261111.test.ts | esophagus motility and achalasia authoring sidecar freezes the passed salvage context and every pre-revision export while submitting only the returned case |
| clinical-final | packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts | pediatric GI and abdominal-wall topic sidecar repairs only the intussusception timepoint and excludes gastroschisis from further review |
| clinical-final | packages/clinical-content/src/question-topic-surgical-infection-antibiotics-20261111.test.ts | surgical infection and antibiotics authoring sidecar keeps the three reviewed salvage identities in the current revision queue |
| domain-final | packages/game-domain/tests/approved-clinical-admission.test.ts | approved clinical admission boundaries keeps the unapproved prototype runtime release limited to explicitly admitted concepts |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 connected Level 5 reducer journey binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 5 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 6 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 7 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 8 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level +0/schema 9 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 5 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 6 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 7 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 8 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 1/schema 9 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 5 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 6 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 7 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 8 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 2/schema 9 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 5 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 6 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 7 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 8 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 3/schema 9 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 5 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 6 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 7 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 8 |
| domain-final | packages/game-domain/tests/level-five-integration.test.ts | M9 Level 0-4 intake behavior after the ordinary cap-5 switch matches the actual pre-M9 load and next 120 minutes for level 4/schema 9 |
| focused-final | packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance freezes the original reviewed serializations and full source file hashes |
| focused-final | packages/clinical-content/src/question-program-batch5-acceptance-20261111.test.ts | topic batch5 final exact manager acceptance binds every scoped existing-source correction to its captured preimage |

Advisory cue lint reports 7 findings across
4 of 4 accepted variants. Whole-bank
lint reports 1849 findings across
880 of 1530
unique variants. [The cue inventory](question-topic-acceptance-batch6-lint-20261112.json)
retains exact phrases and fields.

## Level5 inputs and files

| Changed bound input | Intake SHA-256 | After SHA-256 | Recorded SHA-256 |
| --- | --- | --- | --- |
| packages/clinical-content/src/synthetic-content.ts | bfc1c6c3051d46543b6f2ca13efa90d2683924d78f6d15506aef468eb90c538f | 73ebbee54704c8cc86d0bba3851844ff7674c6033a8e493f39c41bce52227a83 | 6d9870d53383af7da6ee7547ba702410a2545882876faa1696c0e1217fae311c |
| packages/clinical-content/src/index.ts | 80f335e1752faa411561443223f30b8a59e0d1a4dd65d89641db04ae6e21a017 | 485749eb369c0f499b0e34a9ae616f803e22ce4e81d500dc056abf2f0dea8ba1 | a57ffcec34d75e2e337790f1ac0d71e4bfdc8f79d53cdb28596e00ead60413e4 |
| packages/clinical-content/src/answer-choice-timing.ts | 32ca68874463e954dfccdd211145fa410aaf61bc351001ccc9dd651523a244cd | c1149f878874858589737930b2c458173cdf2bb98a41a4b51fe18f486260c027 | 7db1b1253c7d3064adb0602360925c0739bb65c719603507c3fa09a6732ba245 |

| New runtime dependency | SHA-256 |
| --- | --- |
| packages/clinical-content/src/question-program-batch6-accepted-data-20261112.ts | 0855b1ba9ecead9905e770765a644504556fb0e8f9309cd409d65223656c855f |
| packages/clinical-content/src/question-program-batch6-accepted-20261112.ts | 39fccc832bc746049e0f5e5ba908687c12480f49e8d058f5b9ccb8c6d0e21903 |

The manager owns the dependency inventory, evidence rebind and release
integration. Exact existing-source preimages/postimages, new files and the
protected-topic receipt are recorded in
[the scoped file receipt](question-topic-acceptance-batch6-files-20261112.json).
The ExecPlan and append-only shared handoff record this bounded milestone.
This checkpoint is local to the main working tree. The manager owns the
backup gate and can request the checkpoint with "push to GitHub".
