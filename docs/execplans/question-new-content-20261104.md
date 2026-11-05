# N0 supply diagnosis and N1 new content — 2026-11-04

## Goal and requirements

Measure whether the owner's Level 3/4 arrival slowdown follows exhaustion of unseen or due concepts, map current coverage to the locally recorded public ABSITE outline, then add approximately forty independently selectable concepts to playable supply with one or two variants each. Preserve an existing unadmitted identity when the clinical meaning is unchanged; distinguish that from a newly authored decision identity. Prioritize existing Level 3/4 clinic capabilities. Every new clinical record remains `needs_clinician_review`; a technical packet and automated checks confer no approval.

## Constraints and ownership

This is the manager-assigned new-content worker lane. The tree is shared with a worker rewriting existing questions. Preserve every existing question/concept definition and unrelated edit. Own new `question-new-n1-*` content/test files, new supply/admission tests and measurement/review scripts, this plan, the N0/N1 research artifacts, and a separated registry append. Do not edit cloud/session, Supabase, Level 5 evidence, or rebind Level 5 inputs. No Git commands, installation, network access, external messages, or sub-agents.

Read `AGENTS.md`, `docs/clinical/question-authoring-standard.md`, owner review JSON, and current handoff before implementation. Reuse only locally recorded verified clinical claims and rights-reviewed sources, retaining actual access dates and uncertainty. Do not infer new precise criteria from general summaries. ABSITE scope can use only the public ABS outline's recorded topic metadata, never SCORE. Record any offline verification limitation.

## Repository state and decisions

- Existing authoring standard: `question-authoring.2026-11-04.v13`.
- Concurrent rewrite modules are already present. Exact current file hashes will be captured without Git before any implementation.
- Routine selection is concept-first, gives due reviews priority, and requires every scored concept in a case to be unseen or due. Multi-node cases can strand an unseen companion behind a future-due concept.
- New standalone single-decision cases will avoid that companion dependency. No scheduler, arrival cadence, FSRS, progression or routing change is authorized.
- Existing constructed table/key-value exhibits are suitable when comparing findings; no unsupported image or promised asset.

## Milestones and acceptance

1. **N0 supply:** reproducible stage/tier census, seed range of fixed-time exhaustion and an owner-like progressed history with actual FSRS scheduling; demonstrate routine admission when content is unseen, future-due or due. Separate theoretical facility gates from operational capabilities, and simulated history from owner data.
2. **N0 gaps:** `docs/research/question-coverage-gaps-20261104.md`, prioritized topic/capability mapping and transparent ABS public-outline source record/verification limitations. Recommend an editorial supply target with explicit session assumptions.
3. **N1 authoring:** approximately forty concepts new to playable supply, each with one/two finite variants; 3–4 specific parallel options, findings rather than labels, meaningful resident decisions, explicit reasoning/closest error and atomic evidence mappings. Runtime shuffling and complete testing-choice wait metadata. Register through isolated append, preserve all legacy definitions and previously authored stable IDs where appropriate.
4. **Review and validation:** regenerate `docs/research/question-new-n1-20261104.json` (key shown first for review only), lint new cases and resolve findings or document legitimate advisory false positives, clinical-content/lint/focused domain tests, full domain and player with `--pool=threads`, seven workspace typechecks. Record exact commands/results and changed Level 5 bound inputs without rebinding.
5. **Handoff:** update this plan and current handoff with measurements, gaps, changed paths, validation, holds and manager next steps. Local checkpoint only; manager owns independent review, release and GitHub backup.

## Progress

- [x] Read repository rules, authoring standard, owner notes and current handoff.
- [x] Capture baseline and measure current supply.
- [x] Complete coverage gap/source ledger.
- [x] Author and register N1.
- [x] Generate review packet and complete the requested validation runs (full-suite failures are recorded, not waived).
- [x] Record manager handoff.
- [ ] Manager integration, independent question review, source currentness review and named-clinician approval of exact N1 versions.

## Discoveries and next action

`rg` is unavailable in this sandbox; filesystem enumeration and native Node text search were used. Public ABS outline metadata and the October 3 original semantic audit supplied the sole topic frame. No network retrieval occurred. Original source access/check dates are retained, including the ABS outline's recorded October 3 access.

### N0 findings

- Frozen initial catalog: 414 registered concepts / 402 active scored concepts (386 patient, 16 employee), 12 inactive registered identities, 1,110 cases. Stage 3 unlocks 23 patient concepts; stage 4 only nine.
- Sixteen-seed cold exhaustion: stage 0 169–178 patients, stage 1 238–247, stage 2 261–269, stage 3 280–288, stage 4 290–298. At stage 4, 8–12 unseen concepts can remain stranded by paired-case eligibility.
- Native admission: unseen 1 patient, future-due 0 patients, due-now 1 patient. The future-due opportunity still schedules another deadline. Concept availability changes whether an arrival occurs; it is not an input that gradually stretches the configured interval.
- Owner-like synthetic volume scenarios use real FSRS and explicit XP/pacing assumptions, not owner correctness or exposure statistics. Minimal progression leaves ample supply; a four-times-XP construction-delay scenario exhausts supply before its modeled Level 3 target. No claim that Melissa's actual save was diagnosed.
- Suggested fresh expansion inventory: 75–100 independent concepts per major level, based on an explicitly editorial 60-chart/two-hour scenario plus reserve. Before N1, this implies 52–77 additional Level 3 and 66–91 additional Level 4 concepts. After N1, 24–49 and 54–79 remain to that target.

### N1 implementation and ownership adjustments

- Forty new-to-playable-catalog identities / forty single-node cases / forty variants, 28 at Level 3 and 12 at Level 4. **17 newly authored decision IDs; 23 preserved previously unadmitted IDs.** This is forty additional supply slots, not forty newly invented clinical meanings. Reusing stable IDs follows the explicit concept-history discipline.
- Every new version, finite profile, claim and source-record version remains `needs_clinician_review`; no independent PASS or clinical approval. Eighty-five inherited atomic claims and 68 clinical source records retain the original verification dates. Single-source and offline-currentness limitations are explicit.
- All cases are ordinary clinic encounters or clearly identified outside-hospital record reviews. Existing testing estimates, including wrong choices, are bound to exact labels and `not_executed/external_only` dispositions. No new clinical service, result gate, blood bank, ICU or hospital operation is installed.
- All runtime names use the established patient-name token materializer. The technical packet renders named canonical patients and retains the exact authored template and hash. Ages/sex and finite profiles stay constrained.
- Shared edits are separated N1 appends in clinical `index.ts`, `synthetic-content.ts`, `answer-choice-timing.ts`, and domain `test-choice-orders.ts`. A new domain helper owns N1 non-execution records. The prior contents of all three clinical registries match the captured pre-append files after removing N1 and restoring the declaration name (scope audit).
- Eleven historical clinical test files now explicitly use the pre-N1 assembly for their original deferred-package/inventory assertions; no original source-package definition or approval changed. New N1 tests prove exact default-assembly addition, unchanged pre-N1 cases, pending review, actual admission, no local execution and saved-history compatibility. The temporary literal-name test adjustment was reverted after using normal runtime name materialization.
- The concurrent rewrite lane appended round-three versions and one additional active construct during this work. Its edits are preserved and not attributed to N1. Current coverage counts and the frozen initial N0 census are distinguished in the reports.

### Final validation evidence

- Full clinical-content after final N1 edits: **102 files / 835 tests passed**, exit 0, 115.49 s (`clinical-final-freeze.log`).
- Focused domain after final N1 edits and the exact-case allowlist integration: **4 files / 109 passed**, exit 0, 24.07 s (`domain-final-freeze.log`). The N1 file has 87 tests: 40 stage gates, 40 FSRS eligibility checks, forty independent new opportunities, actual answer permutations/testing estimates, older-catalog restore and four native examination-room scoring flows.
- Advisory linter: **zero new owner-rule findings**; seven retained lexical/category findings have exact written author dispositions for independent review. No suppression or independent acceptance. Lint tests: **33 passed**, exit 0. All **seven workspace typechecks passed** after final edits (`typecheck-final-freeze.log`), exit 0.
- Full domain: **163 files passed / 10 failed; 4,462 passed / 38 failed / 1 skipped**, exit 1, 2,919.93 s (`domain-full.log`). Twenty-six Level 5 binding/legacy-hash failures; eleven catalog/order/selection-trace expectations, including the subsequently corrected N1 exact-case allowlist; one pediatric sold-room/reload failure. The unchanged pediatric file passes **7/7** isolated. An in-memory content-only counterfactual completes identically at tick 113 with current, pre-N1 and frozen-N0 catalogs. Original full-run pediatric cause is unresolved, not waived.
- Full player: **341 files passed / 1 failed; 3,412 passed / 1 failed**, exit 1, 1,350.58 s (`player-full.log`). The untouched `automaticResolution.test.ts:61` 400 ms opening race failed; the same unchanged file passes **32/32** isolated (`player-isolated-automatic-resolution.log`). Timing/load sensitivity is an inference, not a proved cause. No cloud edit.
- Both full suites started at 16:00:33 in the changing shared tree. They do not certify the final integrated tree. Final clinical/focused/typechecks ran after final authoring edits at 16:42 onward. The manager reruns broad gates on a frozen accepted integration; no full-green claim.
- Final artifacts: exact 40 templates/hashes/names; 85 claims / 68 sources; 37 timed testing choices / seven exhibits; all 44 public-outline topic leaves mapped, zero unresolved current concept mappings. Both the frozen N0 release hash and current after-measurement hash match (`artifact-verification.json`). Current integrated release: 462 registered IDs / 427 active patient concepts / 1,150 cases / 1,463 nodes.
- Filesystem-only scope/credential-pattern audit: three original clinical registry bodies retained; zero scoped credential-pattern findings. Full owned path hashes, observed concurrent changes and changed Level 5 inputs: `.local-dev/question-new-content-20261104/scope-audit.json`.

### Level 5 input handback

Existing bound inputs changed by N1: clinical `src/index.ts`, `src/synthetic-content.ts`, `src/answer-choice-timing.ts`, and domain `src/test-choice-orders.ts`. New transitive runtime inputs: the six non-test clinical `question-new-n1-*.ts` modules and domain `src/question-new-n1-test-orders.ts`. The read-only binding manifest confirmed the distinction. No Level 5 evidence/checkpoint/pin was rewritten or rebound; the manager handles this in the release tree after accepting exact versions.

### Handoff and next action

Detailed measurements, owned files, exact validation commands/results, all 38 domain failures, player failure, counterfactuals, source/clinical/difficulty holds and Level 5 input paths: [local worker handoff](../../.local-dev/question-new-content-20261104/HANDOFF.md). Durable summary: [current thread handoff](../handoffs/CURRENT_THREAD_HANDOFF.md), N0/N1 entry dated 2026-11-04. Review [coverage report](../research/question-coverage-gaps-20261104.md), [key-first packet](../research/question-new-n1-20261104.json), [source ledger](../research/sources-question-new-n1-20261104.json) and [advisory dispositions](../research/question-new-n1-lint-dispositions-20261104.json).

No active validation process remains. Manager next: inspect actual scoped changes, integrate historical/current inventory expectations with the concurrent rewrite lane, arrange independent review and exact-version clinical sign-off, refresh sources as needed, rerun broad gates on a frozen release tree and rebind Level 5 there. This worker used no Git, installs, network, browser, sub-agents, external messages, cloud/Supabase edits or release-tree writes. No launcher/origin/profile/save pathway changed. Local and unbacked-up; manager owns acceptance and the separately authorized GitHub checkpoint (owner says **"push to GitHub"**).
