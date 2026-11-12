# Pilot owner round-two handoff — 2026-10-29

Historical handoff. The active continuation is [owner round three and batch one, 2026-11-02](question-round3-batch1-handoff-20261102.md). Counts, pending-owner statements and validation below describe the preceding round.

**LOCAL DRAFTS ONLY. Nothing ships. The six returned tasks and their changed
context companions need another owner review. Every clinical question/claim
remains `needs_clinician_review`; owner editorial approval is not clinical
approval. No Git, installs, network writes or cloud-lane edits.**

Implementation, review artifacts and requested validation are complete. The
full-domain run retains the binding mismatch and three pre-existing timeouts
listed below; its suite is not green. No evidence or deadline was changed.

## Owner decisions and changes

The exact round-one authored questions for A04/A08/A17/A22/A23/A27/A28/A38 are
unchanged and have an owner editorial-review receipt tied to their old variant
identity. None was promoted to clinically approved. The six returned items are
in [the manager's review input](question-pilot-round2-20261029.json) and the
updated [full review packet](question-pilot-review-20261028.md), including
round-one/current fields and rationale pairs, with the key shown first for
review only. Runtime choices remain randomized.

| Item | Concrete revision | Clinical review focus |
|---|---|---|
| A02 | Delete the complete stability/availability sentence; retain symptoms and inconclusive ultrasound | Confirm one best next study without an availability preference; comparative accuracy is not a universal next-test algorithm |
| A06 | Mixed raw observations: left-sided staining between examinations plus bilateral expressed secretion; parallel interpretations of both patterns | Confirm a clear unprovoked history and credible competing overgeneralizations; classification is not a lesion diagnosis |
| A11 | Remove preservation preference; keep selected surgery, existing 2 cm size and extent/staging facts; map the initial-operation recommendation explicitly | ATA 2025 recommendation 15A is profile-specific; bilateral cancer or another indication can change extent. Same-organization corroboration, not independent guidelines |
| A25 | Remove swallowing/availability permission and generic well-controlled reassurance; add a generic stop-instruction conflict; compare complete continuation, complete interruption and booster omission | Confirm administration feasibility and credible errors. No exact withholding interval, fasting rule or uncoordinated partial regimen is taught |
| A30 | Remove explicit oversized-cutout and effluent-contact conclusions; show skin distribution and inner-edge barrier moisture; ask for fit reassessment | Observations justify assessment, not an assumed exact opening dimension; wear time and coexisting problems can remain relevant |
| A40 | Four abdominal-wall hernias: epigastric key, Spigelian/incisional/lumbar competitors; include the prior incision's location | Confirm pediatric plausibility and localization. Morgagni is diaphragmatic, so it is omitted from this category |

All concept IDs and definitions remain stable. No concept-version change is
intended: the objectives remain discharge classification, disease-extent
planning, coordinated ART continuity, pouch-fit care and hernia localization.
Clinicians must confirm that the revised applications and recommendation
strength remain equivalent. A11's 2 cm observation is retained, not invented;
no new exact clinical timeline, dose, threshold, probability or demographic
weight was added. A40's prior-incision location is a fictional decision-critical
case observation, not an epidemiological claim.

Six tasks and three companions have new identities: A06 advances `.r2` → `.r3`;
A02/A11/A25/A30/A40 and A06/A25/A30-context advance `.r3` → `.r4`, with content
version `question-authoring.2026-10-29.v3`. Three companions need versioning
because shared presentation changes. The 19 current identities coexist with
25 superseded local-draft timing identities and 19 original identities, giving
1,467 total registered node-timing identities across the bank. Every original,
prior `.r2` and owner round-one draft remains reconstructible without rewriting
frozen saves or FSRS history.

A02 and A06-context append two exact new keyed-test bindings, preserving all
prior labels/timing/services/routes and non-execution contracts. A40's three
new wrong-choice IDs map explicitly to the original no-terminal-outcome
contracts, with current labels/rationales/source IDs. No reducer, save schema,
service-routing algorithm, game timing or Level 5 evidence is changed.

## Standard, lint and proposed batch

The [standard](../clinical/question-authoring-standard.md) now applies the
deletion and rationale-paraphrase tests to every case sentence, including
preferences, goals, mechanism descriptions and setting permissions. Necessary
observations and required patient context stay. Removing a tie-breaking goal
requires independently re-solving the revised option set; it must not create
multiple defensible keys.

Linter `question-cue-lint.2026-10-29.v3` adds two advisory rules:

- `case-detail-decision-cue`: transparent preservation-goal, availability and
  opening-mismatch patterns. Regressions use the owner's actual A11/A02/A30
  round-one examples.
- `case-detail-key-rationale-overlap`: a case-detail word phrase unique to the
  complete explicit keyed rationale. Reasons are post-answer metadata, never
  visible context. Missing/conflicting reasons disable the comparison. Synonyms
  and clinical necessity still require a human; no automatic deletion or build
  blocking is introduced.

Current bank: 1,418 variants / 1,423 nodes / 1,110 cases / 370 concepts / 6,039
canonical-profile references; 68 three-option and 1,350 four-option variants.
There are 1,894 advisory signatures across 926 variants, including 9 variants
with explicit case-detail flags and 38 with rationale-phrase flags. Complete
explicit reasons cover 179 variants; 162 educational tiers remain unknown.
Warnings overlap and include legitimate raw findings; they are not verified
flaws, measured difficulty or a reason to remove decision-critical data.

[Batch 1 proposal](question-rewrite-batch1-proposal-20261029.md), with
[machine-readable IDs/findings](question-rewrite-batch1-proposal-20261029.json),
lists 40 unmodified variants: 20 at facility entry level 1, then 20 at level 2.
Educational tier is separate. Case-reference counts are the available structural
exposure proxy; actual play exposure is unknown and no analytics was added.
Every proposed item currently has one case reference, so cue-review priorities
break those ties. Direct name disclosure and explicit/explanatory cues precede
the lower-confidence rationale-overlap heuristic. Tutorial sequences and the
current pilot are excluded. Review concept siblings together and classify
foundational candidates before increasing difficulty. **No batch-1 content was
rewritten.**

## Validation

| Command | Exact result |
|---|---|
| Clinical-content, threads / two workers | 90 files / 712 passed, 0 failed; 21.83 s |
| Lint tests | 18 passed, 0 failed |
| Six focused domain files, threads / one worker | 6 files / 989 passed, 0 failed; 73.52 s |
| Two touched player tests, documented preload / threads / two workers | 2 files / 22 passed, 0 failed; 2.39 s |
| Full game-domain, threads / two workers | 163 files: 161 passed, 2 failed; 4,312 tests: 4,308 passed, 4 failed; 847.62 s; exit 1 |
| Seven workspace typechecks | All 7 passed; final command exit 0 |

Commands (run from the repository root with `npm.cmd` in this sandbox):

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 --reporter=dot
npm.cmd run clinical:lint:test
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 --reporter=dot
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --reporter=dot src/session/briefEarlyLevelsPresentation.test.ts src/session/pediatricChartsViewModels.test.ts
npm.cmd run typecheck
```

For the player command, the existing command-local `NODE_OPTIONS` preload is
`.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs`; it handles the
sandbox's optional `net use` EPERM and was restored after the command. The seven
typechecks cover clinical-context-workbench, player, balance-config,
clinical-authoring, clinical-content, clinical-research and game-domain.

The two player files were validation-only this round:
`apps/player/src/session/briefEarlyLevelsPresentation.test.ts` and
`apps/player/src/session/pediatricChartsViewModels.test.ts`. They already follow
the current authored cases and needed no further edits. No production player,
App, CloudSaveControls, session/cloud or cloud-e2e file was edited. The previous
phase's cloud opening-deadline intermittent failure remains its owner's issue;
a full-player rerun was not requested this round.

Exact full-domain failures:

| File | Test | Classification |
|---|---|---|
| `packages/game-domain/tests/level-five-integration.test.ts` | `binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash` | The only binding-only failure: first differing input is `answer-choice-timing.ts`; recorded/current hashes are below. Manager rebind required after acceptance |
| `packages/game-domain/tests/level-five-integration.test.ts` | `matches continued play after save/reload at integration-running` | Pre-existing 30,000 ms timeout, reproduced with pre-pilot content in the previous investigation |
| `packages/game-domain/tests/level-five-integration.test.ts` | `continues normal operations, completes a genuinely lower retry and retains the higher best and first finish` | Pre-existing 300,000 ms timeout, reproduced with pre-pilot content in the previous investigation |
| `packages/game-domain/tests/level-five-latent-bugs.test.ts` | `finishes the garden return before starting offsite movement after live` | Pre-existing 5,000 ms timeout, reproduced with pre-pilot content in the previous investigation |

The legacy garden mode passed this run. The manager declined spatial
optimization; the three timing failures remain separate follow-up work.
`spatial.ts`, both Level 5 test files, evidence manifest and captured checkpoints
match all five protected hashes; the lower-run driver also matches. No
assertion/deadline was relaxed.

Report integrity QA passed: deterministic inventory/report and six review
packets, 17,604 exact occurrence/profile evidence spans (98 explicitly marked
post-answer spans), eight unchanged owner-approved assembled drafts, 1,096
unchanged non-pilot cases, 40 unmodified batch candidates, and 30 local links.
All six revised tasks have no new case-detail/lead-in cue warning. Remaining
advisories are A02's lexical imaging-category/length flags, A06's meaningful
classification near-duplicate and A11's short operation-name length disparity;
they remain visible for human review rather than being suppressed.

## Sources and provenance

Four new source records and seven atomic claims are in the [round-two evidence
module](../../packages/clinical-content/src/question-quality-pilot-round2-evidence-20261029.ts)
and [research source ledger](sources-question-writing-20261028.md). Checked
2026-10-29: Pitarch et al. 2025 discharge review (CC BY 4.0); ATA's official
extent summary (copyrighted targeted verification, same-organization support);
Henriksen et al. 2024/2025 wall-hernia review (CC BY 4.0); Lassandro et al. 2011
anatomical cross-check (publisher CC BY-NC 4.0 versus PMC rights-reserved notice,
disagreement recorded). Only the underlying Morgagni compartment fact is used
in the review; no protected expression or images are imported.

Existing ACR, NYSDOH and WOCN anchors were rechecked for the bounded pattern,
ART-continuity and pouch-assessment points. The source ledger records the ATA
quick-reference cross-check and unsuccessful/non-evidence access checks
separately. No independent ART guideline was newly established. Hernia sources
support general anatomy, without transferring adult management/rates to a child.
No external item, recalled board item, source article text, table or algorithm
is stored or copied. No source is fetched during gameplay.

## Exact Level 5 input impact

Relative to the recorded 378-input evidence manifest, four existing source
paths differ and six new runtime clinical files need collection. The other
374 recorded inputs and the lower-run driver match. Relative to the preceding
phase, this round changes the pilot data/module and exact-binding registry and
adds the owner-round-one archive plus round-two evidence module. Timing/index/
synthetic assembly files retain their preceding-phase bytes, although their
imported data now resolves the new identities.

| Existing recorded source | Recorded SHA-256 | Current SHA-256 |
|---|---|---|
| packages/clinical-content/src/answer-choice-timing.ts | ad821c697ca2c8f6553ea03affd0cb868db65b56418c29e1c000307e771358eb | d29ef3e3710fc29bc20de5e77089561fa5fbf0889d95acdaa2d316bf1443a625 |
| packages/clinical-content/src/index.ts | dbb342121a1e49279c8977f2fcdb1106a9b4a228894fbc54b2b2cd27546a5223 | a0c63a856e7a5ba1b5d1e570b604c97ed4dd4eb1cbbd78f8a641285205ac5388 |
| packages/clinical-content/src/synthetic-content.ts | 09d9797f7c659d6f3e7bd4ac5e0f4b72d79fff83f2bc64ed3ccf996ae7f2bc16 | b5941ecaa92f0ee36fc259618edb912a9e6dab27eacbfe8442e087c5dfb89de2 |
| packages/game-domain/src/test-choice-orders.ts | c7ddaea75d35c7f8da695d1c9e2f9a84027530563a61d8b227d3bd45a9338b00 | d4d768609da9a7cad70ce75d8aa82c35adfbfb1212cd61e46cc7dfb037bd7761 |

| New runtime source | Current SHA-256 |
|---|---|
| packages/clinical-content/src/question-quality-pilot-20261028-data.ts | da78d19afb80ad216be806fcb81e0c87819db04c2d409e45b984114a8a6b84fd |
| packages/clinical-content/src/question-quality-pilot-20261028-r2.ts | 539f5cc86cb4e24fc2923bff7f8929c7a456918c4c66d003eae76cc1519153ea |
| packages/clinical-content/src/question-quality-pilot-20261028.ts | d3ab39ce67b7eda6961cd18c8f0ffb8ab92a6ec9609776eb66f969a64df5af81 |
| packages/clinical-content/src/question-quality-pilot-20261029-round1.ts | 6b2dc53219de4bc4a016da65a2bb3b49e797d2fc8808215761c557f4e7997c46 |
| packages/clinical-content/src/question-quality-pilot-evidence-20261028.ts | 3197bf248b802fa129feafcb81a83bc1921a2504d3948fc37ab532405aaad2dd |
| packages/clinical-content/src/question-quality-pilot-round2-evidence-20261029.ts | 03ca239ab0e79f8bc1613e0114199a46a4724912e0b480b2eee1384fa2c2425d |

Machine-readable hashes: `tools/question-quality/round2-bound-inputs-20261029.json`.
The manager schedules an actual rebind only after acceptance; do not patch
recorded hashes or replace frozen saves. No evidence file was edited here.

## Files written this round

- `packages/clinical-content/src/question-quality-pilot-20261028-data.ts`
- `packages/clinical-content/src/question-quality-pilot-20261028.ts`
- `packages/clinical-content/src/question-quality-pilot-20261029-round1.ts`
- `packages/clinical-content/src/question-quality-pilot-round2-evidence-20261029.ts`
- `packages/clinical-content/src/question-quality-pilot.test.ts`
- `packages/game-domain/src/test-choice-orders.ts`
- `packages/game-domain/tests/test-choice-order-inventory.test.ts`
- `tools/question-quality/lint.mjs`
- `tools/question-quality/lint.test.mjs`
- `tools/question-quality/pilot-review.mjs`
- `tools/question-quality/owner-round2-review.mjs`
- `tools/question-quality/report.mjs`
- `tools/question-quality/README.md`
- `tools/question-quality/fixtures/owner-round1-before-20261029.json`
- `docs/clinical/question-authoring-standard.md`
- `docs/execplans/question-quality-phase1-20261028.md`
- `docs/research/sources-question-writing-20261028.md`
- `docs/research/question-pilot-review-20261028.md`
- `docs/research/question-pilot-round2-20261029.json`
- `docs/research/question-rewrite-batch1-proposal-20261029.md`
- `docs/research/question-rewrite-batch1-proposal-20261029.json`
- `docs/research/question-inventory-20261028.md`
- `docs/research/question-quality-phase1-handoff-20261028.md`
- `docs/research/question-pilot-round2-handoff-20261029.md`

Local validation/QA artifacts are under `tools/question-quality/`:
`round2-clinical-validation-20261029.log`, `round2-domain-focused-20261029.log`,
`round2-domain-validation-20261029.log`, `round2-player-touched-20261029.log`,
`round2-typecheck-20261029.log`, `round2-lint-validation-20261029.log`,
`round2-lint-report-20261029.log`, `round2-review-generation-20261029.log`,
`round2-pilot-review-totals-20261029.log`,
`question-cue-round2-report-20261029.json`, `round2-bound-inputs-20261029.json`
and `round2-report-qa-20261029.json`; final command exit codes are in
`round2-validation-exits-20261029.json`. Earlier-phase files/validation remain
historical in [the phase-1 handoff](question-quality-phase1-handoff-20261028.md).

## Open review and handback

- Owner reviews the six current packets and changed companion context; the
  manager publishes the review page. This worker performs no publication.
- A named clinician confirms one best key, plausible distractors, profile/source
  sufficiency and unchanged concept meaning. A02/A11/A30 need particular ranking
  review; A06 endocrine interpretation and A40 pediatric competitors need
  plausibility review. Tests/lint do not approve clinical content.
- Manager accepts or adjusts the proposed 40-variant batch and resolves
  foundational classifications. Exposure is unknown beyond the stated proxy.
- Manager owns Level 5 rebind and separate performance/cloud follow-up. No
  analytics, backup, deployment or release is implied. These files remain only
  in the shared working tree under the owner's no-Git/no-shipment instruction.
