# Harden1 / N3 round4 acceptance; hernia round2 handoff

Three exact PASS versions are accepted in the default draft projection. The
hernia was revised separately and **is not accepted**. All new versions remain
`needs_clinician_review`; no Melissa Rowland clinical approval is inferred.
No Git, network, installation, agent, deployment, release-tree or evidence
rebind operation was performed.

## Accepted authority and frozen versions

The [manager decision](question-harden1-n3r4-manager-decision-20261110.md) and
[accepted packet](question-harden1-n3r4-accepted-20261110.json) record:

- H1-03: `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3`,
  replacing live v3.r2 through an explicit whole-case relation. New case:
  `case.harden1.phosphate-handling.20261110`; old case:
  `case.gs028f.nutrition.c1-metabolic-transition`.
- `review.n3.delayed-regurgitation-proximal-anatomic-study.v4`: new default case.
- `review.n3.venous-ulcer-with-competing-arterial-findings.v4`: new default case.

The first reviewed H1 source and the full reviewed five-case N3 round4 source
are bound by exact source hashes. Only the two N3 PASS rows are admitted. The
three other N3 candidates and all hernia candidates remain withheld. N3 writer
files were not edited. The static retained N3 source avoids an import cycle
between the authoring catalog and production projection.

| Binding | SHA-256 |
| --- | --- |
| H1 reviewed source / `harden1-round1` | `d7b5a4751ac104d5ed6fa26307295bd86faf0a0a37d6cf2de2758d28a3a6c36b` |
| N3 reviewed source / `n3-round4` | `2ded730f8d582d472301b479018a6bd7711e102f690fdb2e6d05dbddb1f9d994` |
| Accepted phosphate case | `2cc0c55f2b5ce3425b110cb9d92416e3192c59b6cee62c7a106770132242a2c3` |
| Accepted delayed-regurgitation case | `ce4b697f86b2be0d8cf8723041951f4aec8f823c25dec0ebb782af8cf204b186` |
| Accepted venous case | `188d81df478242036469efd23d0de6b7cf77726b0203a22f0ad82bb9c29b758e` |

Old definitions remain retained for frozen encounters. The old phosphate
mechanism concept is not remapped into the new renal-handling concept. The N3
delayed-regurgitation identity is stable; the venous version uses its reviewed
existing arterial-assessment-before-compression concept. Six exact testing
choices get centralized estimates and external-only order records; no service
execution or domain acceptance check is added.

Seven new player tests pass: default admission and format3 reopen/completion
for each accepted case; old phosphate v3.r2 frozen reopen/completion; committed
old phosphate admission-journal replay; and both prior N3 frozen versions.
They assert exact frozen questions, choice identities, original concept and
review history, plus idempotent scoring. Blank cards legitimately initialized
for newly registered concepts remain unreviewed; old histories are preserved.

## Counts and hashes

| Default/authority measure | Before | After |
| --- | ---: | ---: |
| Cases | 1,141 | 1,143 |
| Decision nodes | 1,452 | 1,454 |
| Registered concept identities | 606 | 608 |
| Distinct scored meanings | 450 | 452 |
| Distinct question versions | 1,447 | 1,449 |
| Manifest accepted rows | 134 | 137 |
| Legacy tuple bindings | 1,423 | 1,423 |
| Whole-case relations | 3 | 4 |
| Timing rows | 2,284 | 2,287 |

Manifest ID: `question-ship.2026-11-10.v8`.

- Previous manifest: `0e70c49460b6f93ec6766f6f59ad10eb9e4b0e38d8745283d9fa35818d68c06c`.
- New manifest: `164db3d76d2f380d8ef3035e981dc703f05e2e6cf820a483cdd4dc7660946eaa`.
- Previous default: `db795ec578f8b5bfa77d1260b2e53c5a59f779f51edcba538fd8753bdb3de139`.
- New default: `01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4`.

The 1,140 other old cases and all 606 old registered meanings are exact. The
catalog and 62 statistics cases are unchanged. The live hernia case remains
type v1 followed by management r12, byte for byte. All 134 previous authority
rows remain; the old F4-01 row is archived authority rather than a fresh case.

## Draft hernia revision

See the [round2 packet](question-harden1-round2-20261110.json) and
[draft handoff](question-harden1-round2-handoff-20261110.md). Two provenance
rows trace H1-01/H1-02 to **one** new executable question:
`question.groin-hernia.ultrasound-type-and-intervention.v3`.

The new stable case reports two competing ultrasound necks and identifies the
skin-marked target. The player classifies that swelling, then applies the
compartment-specific boundary of watchful waiting despite a painless reducing
course. It removes the independently obvious emergency action and implied
failed reduction. Four options form a complete, parallel diagnosis/judgment
matrix. Moving the marker to the other neck changes both the classification
and observation-eligibility answer.

This materially changes the unaccepted acute v2 objective, so it has a separate
v3 concept. No old card is migrated. Four recorded permitted sources and five
atomic basis claims support the new application; no new retrieval, threshold,
probability or clinical approval is asserted. The
[source ledger](sources-question-harden1-round2-20261110.json) retains access
dates, reuse restrictions and the single-guideline/comparator limitations.

The author predicts moderate difficulty and explicitly records the residual
landmark-recognition shortcut. No independent PASS is claimed. The exact
accepted phosphate and original first-round reviewed source are unchanged.

## Lint, guards and fixture reconciliation

The three accepted items have **zero** advisory findings. The hernia draft has
**one raw convergence advisory**, with no suppressed findings. Its complete
2×2 repeats each component twice; the first independent review recognized that
this is not a unique component-frequency advantage. Exact spans remain in the
packet for the next reviewer. No linter rule is changed.

Eighteen explicit existing-file deltas have immutable before texts/hashes and
exact postimages. Test-only epoch adapters first prove the entire authorized
three-case/three-row/two-concept delta, then restore the historical assertion
epoch. Original capture entries remain unchanged.

The stale N3 domain fixtures now accept exact current round3 **or round4**
authority. The ship-gate/manifest tests assert that the retired phosphate case
is absent and the exact replacement is present, instead of dereferencing the
retired case. The player test checks the full manifest-bound variant ID rather
than assuming every accepted N3 ends in `.v2`.

The strict character-count test gets one exact frozen-version exception for
the manager-accepted N3 venous key (51 characters versus43), with both measured
lengths and its whole-case hash asserted. Other exceptions and bounds remain
exact; no broad length allowance is added and the reviewed key is not edited.

## Exact validation output

All Vitest commands use `--pool=threads --maxWorkers=2`. Full stdout summary,
commands, failed titles and local report paths are recorded in the
[validation receipt](question-harden1-n3r4-validation-20261110.json).

| Run | Exact result | Duration |
| --- | --- | ---: |
| Full clinical-content | 128 files passed / 3 failed; 1,618 tests passed / 3 failed, total 1,621 | 242.40s |
| Final acceptance + hernia draft clinical tests | 2 files / 13 tests passed | 9.42s |
| Full game-domain | 203 files passed / 3 failed; 5,226 tests passed / 28 failed / 1 skipped, total 5,255 | 831.87s |
| Final four domain admission/ship fixture files | 4 files / 319 tests passed | 20.23s |
| Isolated historical patient-supply repeat | 3 passed / 1 timeout, total 4 | 20.54s |
| Final five focused player files | 4 files passed / 1 failed; 91 passed / 1 failed, total 92 | 64.85s |
| Player questionShip save file repeat | 1 file / 33 tests passed | 38.34s |
| Root `npm.cmd run typecheck` | All 7 workspace scripts passed, exit0 | — |
| `npm.cmd run clinical:lint:test` | 33 passed / 0 failed, exit0 | — |

Root typechecks: clinical-context-workbench (client and server configs), player,
balance-config, clinical-authoring, clinical-content, clinical-research and
game-domain. The last root run follows final source generation.

Player commands use the existing
`tools/question-quality/adversarial-r5-player-preload-20261102.cjs` workaround
for Vite's optional Windows drive-mapping probe. It does not replace gameplay,
assertions, timeout or codec budgets. Linter execution disables the Node
experimental-warning banner only. Both generation/acceptance tools also pass
their `--check` regeneration checks.

### Residual failures, explicitly left open

- Clinical: flags3 and stats1 source guards identify the existing
  `packages/game-domain/src/diagnostic-timing.ts` hash mismatch; stats1
  acceptance identifies the existing cloud `codecJson.ts` mismatch. Neither
  file nor its old capture was edited here.
- Domain:26 Level 5 failures comprise the current input-binding check and the
  25 exact historical-load hashes (levels0–4 ×schemas5–9). The full exact titles
  are in the receipt. The binding check first names unrelated balance
  `guidance-tips.ts`; the four additional bound inputs moved here are listed
  below. Rebind/historical evidence refresh remains the manager's lane.
- Domain: `approved clinical admission boundaries > keeps the unapproved
  prototype runtime release limited to explicitly admitted concepts` has
  21 older registered meanings missing from its expectation. All 21 are proved
  present in the immutable pre-milestone606 registry. This task adds its two
  new IDs to the expected list; it does not absorb the unrelated old mismatch.
  Exact21 IDs are in the receipt.
- Domain: `routine patient supply > records the current clinical inventory and
  exact unseen-patient boundary by stage` hit its existing10,000ms budget:
  first full run passed in9,970.66ms; final full run took11,844.99ms and isolated
  repeat13,069.92ms. It uses the unchanged explicit N2 historical author-stage
  release, not the new default. No selector, fixture or timeout edit was made.
  Timing cause remains open; the first pass alone does not prove provenance.
- Player: `explicit separate account campaign for a divergent local branch > retains real retired encounters which no
  longer exist in the playable state` exceeds the existing JSON codec string
  limit. The cloud implementation and budgets remain untouched.

An earlier combined player run also timed out an existing dysphagia journal
test at 5 seconds. It passed 33/ 33 on file repeat and all 33 pass in the final
five-file run; no assertion or time budget changed. New acceptance/frozen-save
tests pass 7/ 7. Full suites are **not** represented as green.

## Exact Level 5 input changes

Intersection with `tools/qa/level-five-integration-results-20261012.json` inputs:

| Bound input changed by this milestone | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `packages/clinical-content/src/synthetic-content.ts` | `96d50250444a0f41fa6b9b77f686b5c6b2fed7fa16821ab0500a3a4443b77762` | `d1db6c1d311f08b0030cd2e9694860f70663add57317b73b82a369f87f1a85ff` |
| `packages/clinical-content/src/index.ts` | `0abfabbf84d18c022bcbb58b3454585afac1a28403cb9adec3e5994b7278d68b` | `000dfad4b8f836b66c7e81cdcf409d5fb7f46e2bc1751f44e67313dce3281043` |
| `packages/clinical-content/src/answer-choice-timing.ts` | `bb55f3dbc7ae50ec77bcd18ab50b8dc213f57acf218657cdc693db434b43c8a9` | `d8d58233291b8b31ad52f950ed31e924f914284b6d89565cdb23f394054ad565` |
| `packages/game-domain/src/test-choice-orders.ts` | `cfb0739a97e9eeaa9c671fd4e1da458ec45b0aa2b731863534b42551d80f79e6` | `573f4c6156d7c1819db74ad87e9a6413482a8a4e4f64d0563f3510f50e12a983` |

All four were already different from the recorded evidence hashes **before**
this milestone. The scope receipt stores those recorded hashes separately;
the table does not attribute the whole old mismatch to this acceptance.

Additional runtime dependencies, not listed in that older input map:

- New `packages/clinical-content/src/question-harden1-n3r4-accepted-20261110.ts`.
- New `packages/clinical-content/src/question-harden1-n3r4-accepted-data-20261110.ts`.
- New `packages/game-domain/src/question-harden1-n3r4-test-orders.ts`.
- The changed manifest, plus unchanged original harden1 source/data/evidence/
  retained-input and N3 round4 source/candidates/types/evidence modules now
  referenced from the runtime barrel. Their eight exact paths/hashes are in
  `newlyReferencedExistingSources` in the scope receipt.

The draft-only hernia round2 is not a runtime/default dependency. No Level 5
evidence, pins, tests or rebind outputs were edited.

## Files and next action

The [file receipt](question-harden1-n3r4-files-20261110.json) lists every owned
changed/new file, its role and raw SHA-256. Existing-file preimages are in the
new migration fixture, not overwritten old captures. Broad ownership groups:
three manifest/source/timing entry points plus index, two new accepted source
modules, one domain timing binding module, narrow historical-test adapters and
fixture fixes, one new player save witness, three draft hernia files,
offline capture/generation/verification tools, review/evidence/lint/decision
receipts, this handoff and the appended shared handoff.

The intake-capture and `integrate-question-harden1-n3r4-20261110.mjs` tools were
one-shot migration operations; do not rerun them or refresh their preimages.
The authoring and acceptance review tools support `--check`. File/validation
recorders can reread their existing completed outputs; they do not rerun tests.

Stop here. Manager may run independent review on the hernia round2 packet and
coordinate the remaining source guards, registry fixture, performance timeout
and Level 5 rebind. No other acceptance or rewrite was made. This checkpoint is
working-tree only; no GitHub backup exists for this turn. An explicit
**"push to GitHub"** request is needed for a later manager-owned backup action.
