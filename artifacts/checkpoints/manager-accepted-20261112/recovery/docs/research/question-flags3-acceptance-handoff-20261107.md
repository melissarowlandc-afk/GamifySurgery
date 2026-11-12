# Flags3 acceptance handoff - 2026-11-07

Implemented the manager's bounded decision in the shared working tree. Exactly
F3-01, F3-02, F3-03-type and repaired F3-03 are default-admitted unapproved drafts.
All remain `needs_clinician_review`; Melissa Rowland remains clinical sign-off.
No clinical approval, deployment or release-worktree operation was performed.

[Manager decision](question-flags3-manager-decision-20261107.md),
[fixed acceptance packet](question-flags3-accepted-20261107.json),
[exact scope/hashes](question-flags3-acceptance-scope-20261107.json),
[validation and every failure title](question-flags3-acceptance-validation-20261107.json).
Key shown first for review only; runtime answers remain randomized.

## Per-item result

| Item | Accepted exact variant | Result |
| --- | --- | --- |
| F3-01 | `question.statistics-ethics.predictive-value-prevalence.v4.r1` | Entire reviewed statistics case unchanged; accepted as directed. Owner's clarity note resolved. Easy remains a future difficulty issue. |
| F3-02 | `question.achalasia.manometric-recognition.v2.r7` | Entire exact moderate PASS case unchanged, including its preceding acquisition question, feedback and gate. Supersedes B2A02's second-node acceptance. |
| F3-03-type | `question.groin-hernia.ultrasound-type.v1` | Type question/exhibit/options/feedback exact. Remove caregiving lifts from shared presentation; it now belongs only to management. Necessary raw anatomy remains visible before classification. |
| F3-03 | `question.inguinal-hernia.symptomatic-elective-repair.v3.r12` | Own update starts `Ultrasound classification: femoral hernia.` It also carries functional status, reduction and nonacute examination. Fully answerable from its own fields; classification appears only after the type decision. Task/options/feedback unchanged from r11. |

The reviewed round-one source, data, evidence, retained input, packet and
independent review are byte-exact. The original r11 remains available there.
The narrow context repair has a new r12 identity and content version. Its
statement mapping explicitly links the carried-forward classification to the
existing compartment claim; no new clinical fact, source, threshold or rule was
created. Existing statistics, secondary-junction and femoral-management concept
IDs remain stable. The newly scored anatomical objective retains its separate
`concept.groin-hernia.ultrasound-compartment-classification.v1` identity, with
no FSRS history migration.

Classification has paired-only coverage. The existing due-selection policy can
defer this pair while its management companion is future-due; no selector or
history migration was introduced to change that established limitation.

## Projection and frozen compatibility

Explicit source view `flags3-accepted` is
`QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE`. Four exact tuples and three headers
are pinned. F3-02 supersedes B2A02; F3-03 supersedes B2A08 and is paired with the
new type row. Therefore 69 - 2 + 4 = 71 rows. All other 67 prior acceptance rows
and all 1,423 legacy bindings are exact. No runtime acceptance gate was added.

The hernia whole-case relation replaces the old workup/plan node list with
classification/plan for fresh encounters. Statistics and dysphagia use exact
node overrides with pinned headers; dysphagia retains its first node. Legacy
source views, concepts, timings and order records remain archived. No selector,
FSRS policy, save format or journal format changed.

All 31 ship-save tests pass. Twelve added cases cover each of the three flags:
fresh default admission/format-3 completion; old waiting snapshot completion;
old in-progress snapshot completion; and committed old admission journal replay
through completion. Checks retain exact frozen question/concept IDs, complete
node lists, randomized choice order, old reviews, idempotent scoring, correct
card ownership, durable state and completed reloads. New classification history
is not copied from the retired workup card.

The test helper's old assumption that every second decision returns from a
result gate to the founder desk was corrected: the new no-gate type/plan pair
stays in its examination room. Existing gated cases still assert return to the
desk. The 240-tick bound, codec limits and runtime routing were not relaxed.

Historical tests first pin the full exact flags3 delta, then reconstruct their
original epoch and verify the original captures. No prior capture was refreshed,
removed or loosened. The source migration receipt pins both current bytes and
original captured bytes; 1,348 other captured files remain unchanged. Ten new
clinical acceptance tests cover exact source hashes, the self-contained fix,
the full prior-default/manifest delta, isolated new meaning and timing archive.

## Counts and hashes

| Default metric | Before | After |
| --- | ---: | ---: |
| Cases | 1,141 | 1,141 |
| Decision nodes | 1,452 | 1,452 |
| Distinct active question IDs | 1,447 | 1,447 |
| Active concept IDs | 449 | 450 |
| Registered meanings | 605 | 606 |
| Manifest accepted rows | 69 | 71 |
| Legacy bindings | 1,423 | 1,423 |
| Whole-case relations | 2 | 3 |
| Exact timing rows | 2,215 | 2,219 |

Exactly three current cases change; the other 1,138 complete cases and all 605
prior meaning objects are exact. The main draft catalog is unchanged.

SHA-256 values below hash `JSON.stringify` of the named object:

- Default before: `77261db946b72dbf0f001e6ce11aab75928b561a19a8a17a874274f08b185a30`.
- Default after: `0fbd0efc0502cb47e463a07ea2c8a74e6ce992876f27442ec5597b17cc5273cf`.
- Manifest before: `8f1f6840174448e987ae008f98c50846e6f70c0c0bc5a86e5f73b3e07a7e02a3`.
- Manifest after: `c32128d1bebad68306fdfb28b893278548998fecb988a0c50dfb2377ebe413d6`.
- Fixed source view: `12418fd9c79c7f7e85d46879ff6077a83349b833e5f317aeeefb1128129ff404`.
- Reviewed round-one view, unchanged: `3be43217d9e9077b2ce47945e28e0d55b88c20e97a494e8bae4d1d91c53f2033`.
- Timing before: `3728af1d3c0c074476b9340e7b4fc555d07fadb4945be689e43d1177f06fdd97`.
- Timing after: `8fd21099e711c374553b039405e86d106fff65dd57870abdaad59873bb5aea0d`.

Manifest version is `question-ship.2026-11-07.v5`. The packet includes each
accepted node, full question metadata and full case hash. Every historical
exact wait row remains; only four accepted identities and three future-planned
procedure-preview order records were appended. No procedure execution added.

## Lint and self-check

Rechecked all three complete cases, five nodes and ten finite/canonical
contexts, including prior visible feedback. Counts unchanged: four advisory
findings on new variants plus one on the preserved acquisition question; zero
suppressed. F3-01 and management have zero findings. Type has three necessary
anatomical/rationale overlaps; F3-02 has one limited test-name lexicon warning.
The preserved first dysphagia node has its original `after` overlap. Exact
phrases and manager-accepted dispositions are retained in
`tools/question-quality/question-flags3-accepted-lint-20261107.json`.

Options stayed in their original parallel categories. Classification is absent
from type's pre-answer fields and explicit in management's own update. The
neutral task and nonacute findings distinguish elective repair from emergency
exploration, with femoral anatomy distinguishing repair from surveillance.
The independent easy ratings for statistics/type (and paired management) are
recorded as future difficulty work, not hidden or relabelled as moderate/hard.

Source/claim ledger remains
[sources-question-flags3-20261107.json](sources-question-flags3-20261107.json):
14 recorded sources, 15 basis claims and ten existing atomic applications;
actual original access dates remain. No network/source text retrieved.

## Exact validation

| Directory / command | Closing output |
| --- | --- |
| `packages/clinical-content`: `npm.cmd test -- --pool=threads` | **123 files / 1,362 tests passed; 35.98 s; exit 0** |
| `packages/game-domain`: `npm.cmd test -- --pool=threads` | **203 files passed / 2 failed; 5,159 passed / 27 failed / 1 skipped (5,187 total); 304.21 s; exit 1** |
| Root: `npm.cmd run typecheck` | **All seven workspaces passed; exit 0** |
| `apps/player`: focused command below | **2 files passed / 1 failed; 78 tests passed / 1 failed (79 total); 63.88 s; exit 1** |
| Root: `npm.cmd run clinical:lint:test` | **33 passed / 0 failed; 1,839.7339 ms; exit 0** |

Player command uses the existing command-local sandbox preload:

`npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx`

All 31 ship-save tests and flagFreeze pass. The sole player failure is the
previously documented `separateCampaign.test.ts > explicit separate account
campaign for a divergent local branch > retains real retired encounters which
no longer exist in the playable state`: CloudCodecError at codecJson.ts:63,
JSON string exceeds the codec limit (call at separateCampaign.test.ts:54).
Cloud/save implementation and limits were left untouched.

The domain has the same 27 known failure titles documented before this task:

- `tests/approved-clinical-admission.test.ts > approved clinical admission boundaries > keeps the unapproved prototype runtime release limited to explicitly admitted concepts`: static list expects 585 meanings; before this task actual was already 605, now 606.
- `tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash`: source binding first fails at the previously changed balance guidance input. No rebind performed.
- Twenty-five `M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level L/schema S` loaded-state hash failures: every level +0, 1, 2, 3, 4 x schema 5-9. Every exact title is in the validation JSON. Evidence refresh remains manager-owned.

No new domain failure title. No full-green domain/player claim. Final accepted
packet, scope and validation `--check` commands pass. Local raw log paths and
SHA-256 values are in the validation JSON under
`.local-dev/question-flags3-acceptance-20261107/`.

## Files changed

Five existing runtime integration files:

- `packages/clinical-content/src/answer-choice-timing.ts`
- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/question-ship-manifest.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/game-domain/src/test-choice-orders.ts`

Ten existing tests/support files (historical checks preserved with exact epoch
adapters; only the player test file changes in the player lane):

- `apps/player/src/questionShipSaveCompatibility.test.ts`
- `packages/clinical-content/src/answer-choice-timing.test.ts`
- `packages/clinical-content/src/question-bank-batch2b-acceptance-20261105.test.ts`
- `packages/clinical-content/src/question-flags2-round3-20261105.test.ts`
- `packages/clinical-content/src/question-flags3-20261107.test.ts`
- `packages/clinical-content/src/question-new-n3-acceptance-20261105.test.ts`
- `packages/clinical-content/src/question-new-n3-acceptance-test-support.ts`
- `packages/clinical-content/src/question-new-n3-round3-20261105.test.ts`
- `packages/clinical-content/src/question-ship-case-replacements.test.ts`
- `packages/clinical-content/src/question-ship-manifest.test.ts`

New files:

- `packages/clinical-content/src/question-flags3-accepted-20261107.ts`
- `packages/clinical-content/src/question-flags3-acceptance-20261107.test.ts`
- `packages/clinical-content/src/question-flags3-acceptance-test-support.ts`
- `tools/question-quality/capture-question-flags3-acceptance-20261107.mjs`
- `tools/question-quality/review-question-flags3-accepted-20261107.mjs`
- `tools/question-quality/record-question-flags3-source-migration-20261107.mjs`
- `tools/question-quality/check-question-flags3-acceptance-20261107.mjs`
- `tools/question-quality/record-question-flags3-validation-20261107.mjs`
- `tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json`
- `tools/question-quality/fixtures/question-flags3-acceptance-source-migration-20261107.json`
- `tools/question-quality/question-flags3-accepted-lint-20261107.json`
- `docs/execplans/question-flags3-acceptance-20261107.md`
- `docs/research/question-flags3-manager-decision-20261107.md`
- `docs/research/question-flags3-accepted-20261107.json`
- `docs/research/question-flags3-acceptance-scope-20261107.json`
- `docs/research/question-flags3-acceptance-validation-20261107.json`
- `docs/research/question-flags3-acceptance-handoff-20261107.md`
- `docs/research/question-flags3-acceptance-files-20261107.json`

Also append-only `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. The capture tool was
created before its intake capture, so its final storage-format adjustment is
also present in the source-migration receipt; it is a new milestone tool, not an
older protected application file. Source bytes for receipt construction are
local code snapshots; no external clinical source text is stored.

## Level 5 inputs and open work

Exactly four already-listed bound inputs changed here. Raw file SHA-256 values
are distinct from the object hashes above:

| Bound input | Intake SHA-256 | Closing SHA-256 | Existing evidence SHA-256 |
| --- | --- | --- | --- |
| `packages/clinical-content/src/index.ts` | `ee124fd210f55353e3568e3a701248b742fa09ed2f1af9c3dc06fc302f329905` | `f22453a850aa22d4ffba37f05710e8abfb43784547f46cbb28397a76e2181e6b` | `a57ffcec34d75e2e337790f1ac0d71e4bfdc8f79d53cdb28596e00ead60413e4` |
| `packages/clinical-content/src/synthetic-content.ts` | `e93b4deae7bda1134869b80324d77c5698e075e65b97815eb4f991c8aba5ef81` | `819c38fce01be9684a8ef35e09c5bb64978dc710993862dbcf066b2c5f9392ed` | `6d9870d53383af7da6ee7547ba702410a2545882876faa1696c0e1217fae311c` |
| `packages/clinical-content/src/answer-choice-timing.ts` | `7f2d9129e930cd1654dc71415a5b7c514341e13c8d994edc41214d94c65f4e54` | `37b65085cf5d41a543fea68ba3bed0f82ebd8277f345c53e2957d54a1647d63d` | `7db1b1253c7d3064adb0602360925c0739bb65c719603507c3fa09a6732ba245` |
| `packages/game-domain/src/test-choice-orders.ts` | `0e692d44de8c72f1d2dd89a18debc05e78fd4da679b2e5b8b15964ef5e9198c1` | `cfb0739a97e9eeaa9c671fd4e1da458ec45b0aa2b731863534b42551d80f79e6` | `522c3fbd3b3503f4b6d74f38e7dbd994b98727a3037b0374f86e58dbf5a41639` |

The manifest is another modified runtime dependency, not individually listed
in the existing evidence input map. Five newly loaded runtime dependencies:

- `packages/clinical-content/src/question-flags3-accepted-20261107.ts` - `4c4c2e1b2ccbd32dba5e6cfb056fe480d11091a48bdc75ec788fd2e57398d344`.
- `packages/clinical-content/src/question-flags3-20261107.ts` - `be252da89b3ceb215f8ab7de45f535272ab9ddd95caabf30bff6be4a1a2a3b35`.
- `packages/clinical-content/src/question-flags3-20261107-data.ts` - `2df687fec9495647dff2a235f48d7983ed1de89d060b14c1a731142f5ae82d8d`.
- `packages/clinical-content/src/question-flags3-evidence-20261107.ts` - `8e7cd9e640718d150ba30387d0efddda6117fa46fd6522c09c0b36752e0897a6`.
- `packages/clinical-content/src/question-flags3-retained-input-20261107.ts` - `c177ea2dba248474cae76e817614c052aa52fdecade6f50815d33e4d7a7afb35`.

The four older flags3 preview files are unchanged; acceptance now loads them
through the default/index wiring. Only the accepted-source helper is new.
No Level 5 evidence/pin/checkpoint was edited; no rebind. Manager owns release
integration, exact-version inspection, later evidence work, the stale registry
fixture and the unrelated cloud codec failure. Clinical sign-off and future
difficulty work remain separate from this editorial acceptance.

No Git, installs, network, agents, deploy, other question rewrites, selector or
save/cloud implementation changes. No playtest origin/profile/pathway changed.
This is a local working-tree checkpoint; no new backup was created. Manager
owns any separately authorized "push to GitHub" checkpoint and release. Stop
at this bounded handoff.
