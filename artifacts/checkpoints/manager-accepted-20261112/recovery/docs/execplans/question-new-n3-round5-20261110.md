# N3 round 5 — three returned candidates

## Goal and authorization

Resolve only the three REVISE items in the manager's round-four decision:
foot culture versus clinical infection, lactation drain contact, and chyle-leak
nutrition. Produce an executable new draft only if recorded permitted evidence
supports a genuinely consequential second inference and the nearest competitor
can be resolved fairly. Otherwise park it and state the precise evidence gap.

## Constraints and ownership

This is the new-question worker lane in a shared tree. No agents, Git, network,
installs, commits, release or external messages. Do not edit the manifest,
projection, the two round-four PASS versions, the thirteen owner-decision
holds, the seventeen accepted drops, existing definitions or concurrent rewrite
files. No player/session, Supabase or Level 5 evidence/pin edits. New clinical
content remains `needs_clinician_review`; Melissa Rowland is clinical sign-off.
Runtime choices shuffle; review packets explicitly display the key first only
for review. Existing source dates/limitations are retained. Tests and author
self-checks confer no independent PASS or clinical approval.

Owned outputs are new round-five source/tools if warranted,
`docs/research/question-new-n3-round5-20261110.json`, the matching handoff,
this plan, and an append to the current thread handoff.

## Intake and decisions

- Read repository instructions, authoring standard v15 and the independent
  round-four review. The review calls all three returned items fair but easy.
- Captured 2,337 existing files before implementation in
  `.local-dev/question-new-n3-round5-20261110/intake.json`; retained the entire
  existing shared handoff prefix. No Git operations.
- The two PASS items and their source file are frozen. The manager/rewrite
  lane may concurrently add their exact versions to live projection metadata;
  this worker must record such deltas, not overwrite them.
- Offline source feasibility is the first milestone. A superficially harder
  wording change or two repetitions of the same rule is not a revision.

## Milestones and acceptance

- [x] Capture pre-edit clinical-content test results; inspect recorded atomic
  claims and local verification ledgers for each proposed second decision.
- [x] Record prospective reasoning steps, deciding observation, closest rival,
  ablation and counterfactual. Revise supportable items in new files; park the
  others with the specific missing fact, without asking broad owner approvals.
- [x] Apply the reviewer's rubric to all three dispositions and any executable
  candidates. Run cue lint on the full visible candidates, without suppressions.
- [x] Generate the round-five packet, preserving the exact two PASS versions,
  all historical drafts and the thirteen existing holds.
- [x] Run full clinical-content Vitest with `--pool=threads --maxWorkers=2`,
  seven-workspace typecheck and question-quality lint tests. Attribute every
  remaining failure against the pre-edit run and file-level receipts.
- [x] Write exact validation, files, evidence limitations and any Level 5 bound
  input effects to the handoff; append the current handoff and stop.

## Validation commands

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
npm.cmd run clinical:lint:test
```

## Progress and next action

Complete: all three returned items are parked using the authorized unsupported-
revision branch. Ten existing atomic facts and eight recorded sources do not
establish the suggested new keys. The packet records prospective steps,
deciding observations, credible competitors and counterfactuals without
inventing resolving data or a v5 key. No new clinical source files or runtime
registrations were created. Two round-four PASS versions, all five round-four
definitions, thirteen owner holds and seventeen accepted drops are preserved.

Pre-edit clinical: 1,605 passed / 3 existing failures / 1,608 tests in 129 files.
Closing integration run: 1,222 passed / 18 failed / 1,240 executed tests in 129
files; eleven suites failed during import as concurrent harden1/N3-round4
acceptance changed manifest/header and reconstruction inputs. Exact per-file
attribution and captured other-lane input hashes are in the handoff/receipts.
This lane edits no package source or test. Seven closing workspace typechecks
and all 33 lint tests pass. Retained-three diagnostic lint: zero findings in
six contexts; not a new-candidate PASS claim. Own Level 5 bound-input edits:
none. No existing capture/assertion was changed. Stop for manager review.
