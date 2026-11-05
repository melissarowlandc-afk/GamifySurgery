# Release port 19: Level 2 endoscopy Ready-but-stuck fix

## Goal and scope

Port only the manager-accepted lane documented in
`docs/research/endoscopy-ready-stuck-20261105.md` from the read-only live tree.
All writes are confined to `C:/Users/rowla/Projects/GS-release`. No Git,
installs, network, agents, deployment, clinical changes or unrelated live work.
Preserve all shared release changes and every evidence assertion.

## Entry evidence and ownership

Manager identifies release HEAD `33846e50`. Entry content inventory contains
7,307 public files; all 532 recorded inputs match, including 391 clinical files.
The results have 18 history entries. Private entry snapshots, content diff,
source copies and immutable command receipts live under
`.local-dev/release-port19-20261105/`. Dispositions will be recorded in
`.local-dev/release-verify/port19-20261105.json`.

The lane owns ten source/test paths in the accepted handoff: service-operations,
index, endoscopy-setup, guidance-tips, two routine-endoscopy-ready fixtures/tests,
viewModels, clinicAlertActions, endoscopyReadiness and buildViewModels tests.
Also copy the accepted research handoff and source execution plan. Changes to
the shared player test must retain release-specific Break Room expectations.
This execution plan and appended GS028/current-thread handoffs are coordination
documents. Evidence results may change only after guarded verification; leave
checkpoint bytes untouched if the native regeneration is identical.

## Acceptance and validation

1. Content-diff and attribute every differing path. Copy or hunk-port only the
   accepted lane; exclude all unrelated art, cloud, perf and evidence changes.
2. Prove the two prepared synthetic snapshot saves preserve state on load and
   recover on ticks; retain routing, repair, no duplicate credit and replay tests.
3. Run the Level 5 pins. If binding needs refresh, rerun the unchanged native
   journey and lower helper in isolated staging with the original seed/opening.
   Require all nine checkpoint bytes, three reports and every simulation number
   unchanged: 30,501 commands, 6,790,515 closing cents, 471 completions, 0 walkouts.
   Require all 391 clinical hashes unchanged. Preserve guard/drivers/assertions,
   apply only established liveCap 4-to-5 metadata correction, append inputHistory.
   Publish only after a successful independent verify-staged receipt.
4. CI=true: all seven workspace suites using threads, all workspace typechecks,
   player build. If root test is blocked by its Git inventory, use the seven
   direct suites and report the blocker. No browser execution in this sandbox.
5. Final content/hash inventory, exact validation counts, old/new evidence hashes,
   excluded paths and remaining risks; append durable handoffs.

## Progress

- Entry read complete; no source or canonical evidence written.
- Source handoff's retained-content Level 5 check is insufficient for this
  release's 69 accepted questions; an actual release-tree CHECK is required.
- The release already includes the manager's Level 4 float comparison correction.

## Next action

Compare all ten lane paths against the source's owned diff, port only the
accepted hunks, then run focused recovery and evidence checks.


## Completion — 2026-11-05

- Port complete: eleven copied paths, one hunk-ported, 85 excluded live paths.
- Both synthetic snapshot controls recover only under the fixed runtime;
  exact logical load state, one receipt, unique beds and preparation preserved.
- Fresh native journey and lower helper completed. All simulation values,
  nine checkpoint bytes and three reports exactly match entry: 30501 / 6790515 /
  471 / 0. Clinical hashes: 391 unchanged. Strict verifier passed before the
  results-only local publication; history 18 to 19, inputs 532 to 533.
- Guard, drivers, launch pins, checkpoint and legacy artifacts unchanged.
- Seven suites: 745 files, 10470 passed, 0 failed,
  1 existing skip. All seven typechecks and player build pass.
- Root npm test remains blocked by its Git inventory before spawn; seven direct
  suites passed. No browser execution. Existing build warnings remain.
- Durable handoffs appended; final scope/SHA audit receipt is
  `.local-dev/release-port19-20261105/final-file-inventory.json`.
  Manager accepts/reviews; no additional implementation remains.
