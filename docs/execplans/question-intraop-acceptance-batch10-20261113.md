# Intraop acceptance batch 10

## Goal and requirements

Integrate the eight requested ENG-I01b-enabled nodes and eight independently passed salvage cases where the complete scored case meets current admission. Record every accepted and skipped identity. Exclude polypectomy salvage. Keep accepted versions needs_clinician_review.

## Ownership and repository state

The Main manifest and acceptance modules, metadata registration, testing estimates, integration tests and batch10 receipts belong to this lane. Question-intraop authoring modules and their packets are read-only. The salvage writer owns polypectomy. Balance, progression, GS-release, cloud/Supabase and evidence files remain outside this lane. The task prohibits Git, installs, network, agents, deploy and rebind.

Intake contains manifest v18 with 794 rows and a default release with 1421 cases, 1627 nodes and 1126 registered meanings. Exact hashes were captured before edits. Existing frozen encounters, saved formats and FSRS identities are preserved.

## Decisions and milestones

1. Capture current source, reviews, manifest, release and timing bytes. Match exact requested identities and check whole-case review and runtime families.
2. Freeze accepted copies with patient-name placeholders and explicit live or clinic source contracts. Add exact authority rows and planning wait bindings.
3. Add native procedure/room/equipment and pediatric gate tests, format-3 and journal completion tests, and strict prior-acceptance adapters. Reconcile or explain the anesthetic schema pin using the exact ENG-I01 change.
4. Run clinical, full domain/player thread suites, seven workspace typechecks, cue lint/naming checks and actual content-pacing CLI. Record every failure and cause.
5. Write docs/research/question-intraop-acceptance-batch10-20261113.md and append the current-thread handoff.

## Current findings

All eight A nodes have supported ENG-I01b families and installed equipment. Five salvage cases fit current families. The Crohn EUA and two endocrine salvage cases still require unsupported families. Their exact reviewed source versions will stay in the skipped list.

The anesthetic pin expected the schema and founder route before ENG-I01. Strict source adapters now verify the exact authorized postimages and restore their original captured bytes. The focused I11 tests pass. Historical authoring exclusions and standalone-salvage guards retain every original assertion through exact source-epoch adapters. Authoring content files remain unchanged.

## Implementation and focused validation

The manifest admits 13 nodes in 11 complete cases, consisting of ten live cases and one clinic record review. All eight ENG-I01b nodes are included. Five salvage cases are included. The Crohn EUA and two endocrine salvage cases remain withheld because their declared families lack runtime support. Polypectomy remains excluded.

Manifest v19 contains 807 rows. The default contains 1432 cases, 1640 nodes, 1138 registered meanings and 939 scored meanings. Twelve meanings are appended and one newly scored node reuses an already registered meaning. All prior cases and concepts remain exact.

All eleven testing-choice waits are bound. Three exact pediatric family/art profiles are registered. Accepted source/node/question/case hashes, naming substitutions and the native combined-summary synchronization are recorded.

Focused clinical validation passes 161 tests in twelve files. The excluded polypectomy's source guard passes 22 tests after test-only pin reconciliation. Native source/admission tests pass 15 tests. Focused player validation passes 33 tests including 22 format-3/journal completion witnesses. Seven workspace typechecks and 33 linter tests pass. The thirteen accepted variants have zero advisory findings.

The actual content-pacing CLI passes at tick 26377, compared with the unchanged reference 26281. The native journey has zero walkouts and positive cash.

The final full clinical run reports 3508 passed and 11 failed in 234 files. All remaining failure titles match the prior batch9 baseline. The I11 failure has been resolved. The full domain run reports 6104 passed, 27 failed and one skipped in 224 files. All 27 failures match the prior baseline, covering the explicit concept census and retained Level5 input/legacy-behavior evidence. Exact logs and JSON receipts are in .local-dev/question-intraop-acceptance-batch10-20261113.

The full player suite passed all 5543 tests in 456 files with native exit 0. Its log is player-full.log in that directory. Its native exit is recorded in player-full-exit.json. Concurrent App.cloudBrowserFailures.test.tsx edits are preserved and recorded separately from this lane's captured source changes.

## Next action

All implementation, validation and handoff milestones are complete. The final report is docs/research/question-intraop-acceptance-batch10-20261113.md, with source-freeze, packet, dispositions, validation and file/hash receipts. The current-thread handoff has a prefix-preserving appended completion record. Manager integration, the three unsupported procedure families, named clinical review and the evidence rebind remain assigned to the manager.
