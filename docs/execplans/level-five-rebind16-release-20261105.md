# Level 5 rebind 16 — release routine ambulatory OR arrivals

## Goal, ownership and constraints

Rebind the actual Level 5 journey in `C:/Users/rowla/Projects/GS-release` after
the manager-accepted routine OR scheduler/cadence changes. User-stated HEAD is
`c94f657e`, branch `release/beta1-20261016`. The live tree is read-only.
No Git, installs, network, agents, deployment, runtime/content/test edits or
guard/assertion relaxation. Manager retains acceptance and global handoff.

Worker-owned repository writes: results metadata/input bindings, checkpoints
only if permitted by the strict unchanged-state gate (otherwise leave intact),
this execution plan, and the requested GS028 handoff append. Private staging,
backups and validation receipts are confined to
`.local-dev/l5-evidence-rebind16-release-20261105/`.

## Entry evidence and decisions

- Read repository instructions, current handoff, both actual native generators,
  the existing guarded staging/verification/publication/command scripts, and the
  read-only routine OR worker research handoff.
- Captured 6,612 public repository file hashes. Exactly two of 418 bound inputs
  differ: service-income-catalog.ts and service-operations.ts; their new hashes
  match the manager-accepted worker handoff. No input added/removed. All 290
  clinical hashes match; 15 historical input entries already exist.
- The binding guard is unchanged at
  `812c9823ed10c4007460f56d41c30dc698c61576a0631e55a24e92094c129909`.
- Required unchanged run: 26,362 commands, 6,056,335 cents, 410 completions,
  zero walkouts, all three reports and all nine checkpoints byte-identical.
  No retail exception applies to this rebind. The OR handoff's older retained
  comparison includes pre-rebind-14 retail drift; compare freshly against this
  release's actual canonical bytes instead.
- Root npm test/build and test:boundaries invoke Git tracked-path inventory.
  Preserve the verifier and use the existing No-Git preload to block Git before
  spawn. Record these root-command failures honestly; run all seven workspace
  test suites and the player production build directly as independent checks.
  No approval or verifier change is required or requested.

## Milestones and acceptance

1. Run the unchanged native journey from its original seed/funded opening into
   staging, then the actual lower helper. Assert stable current source hashes,
   unchanged clinical inputs, cash reconciliation and every native assertion.
2. Save exact old/new totals, report/checkpoint hashes and differences before
   enforcing gates. Stop before canonical writes if any total/report/save or
   other native summary changes. Require all nine entire checkpoint bytes.
3. Publish only results bindings/metadata after verification: preserve every
   earlier inputHistory entry, append the complete previous input/artifact map,
   and apply only the established raw liveCap 4 ->5 correction. Leave identical
   checkpoint bytes untouched, guard/assertions unchanged.
4. CI=true root npm test, all workspace tests with sandbox threads, seven
   typechecks, boundaries and root build; independent launcher/player build as
   needed for the known No-Git blocker. Classify every failure/timeout without
   hiding it. Append rebind 16 with changed evidence hashes, before/after totals,
   exact validation counts/output and any remaining blocker.

## Progress and next action

Baseline captured; canonical evidence unwritten. Prepare task-scoped versions
of the existing guarded scripts and start a fresh actual journey. If a partial
journey dies, archive that attempt and start from scratch; never resume it.

### Native run and publication completed

- Fresh actual journey completed in 264,107.7 ms, native exit 0; lower helper
  exit 0. All original assertions retained. Both wrote private staging only.
- Strict verification passed: 26,362 commands /6,056,335 cents /410 completions
  /zero walkouts; every other native summary value, all three reports and all
  nine serialized checkpoints are unchanged. All 290 clinical hashes match.
- Updated only canonical results metadata/input hashes after the accepted-run
  verification receipt. SHA-256 5050e1e0460995ed641b4253db3fd422e370ad0e6208d4742c7440f9f2f75d8f
  ->b59b0b5fe689cc654136770586731010d4509ae5ee8c48bc17bf1805919a3712.
  Prior 15 history entries preserved; new history count 16. Checkpoints were
  not rewritten (SHA 51b18e225a75ac77b345d74ea15b3e0f6841807d00276b6fe6b78f5c7886df7d).
  The complete native progress diagnostic was already identical; not rewritten.
- CI=true root npm test, boundaries and root build each exit 1 solely at
  the unchanged Git inventory check, blocked before spawn by the explicit
  No-Git preload. Seven workspace typechecks and independent launcher contract
  pass. All-workspace tests are running directly with threads/two workers and
  native JSON reporting per workspace; the workbench already passes 43/43.
- Remaining: finish all seven workspace suites, independent player build,
  final source/byte audit and requested GS028 handoff. Do not replay or
  republish the completed verified native evidence on resume.

## Final validation and handoff

- All seven workspace suites ran after publication: 690 files, 9103 passed /0 failed /1 existing optional skip. Exact per-workspace counts and all native exits are in validation-summary.json and the GS028 handoff.
- Seven workspace typechecks, standalone production player build and launcher contract pass. Root npm test, test:boundaries and root build each retain native exit 1 solely because the explicit No-Git preload blocks their Git tracked-path inventory before spawn. These root commands remain unverified; no verifier, package script, guard, assertion or timeout was weakened.
- Fresh Level 5 evidence remains 26,362 commands /6,056,335 cents /410 completions /zero walkouts; all reports and all nine checkpoints byte-identical, cash exact. Only the results artifact changes. The checkpoint and native progress files are not rewritten. InputHistory has 16 entries, preserving the prior 15 and their complete maps.
- All 290 clinical hashes, accepted OR tests, 418 current source bindings and every other public repository source remain unchanged from entry. Final scoped files are the results JSON, this plan and the requested GS028 handoff. No live-tree write, Git process, install, network, agent, owner-save access or deploy occurred.
- Next action: manager reviews the scoped receipts/handoff and reruns the unchanged root commands in a validation context that permits their Git inventory. Global handoff and backup decisions remain manager-owned.
