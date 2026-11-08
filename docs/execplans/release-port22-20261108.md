# Release port 22 — desktop splitter and UI density

## Goal and constraints

Port only the accepted splitter map shade and UI density rounds 1–4 from the
read-only live tree into GS-release (manager-stated entry HEAD de270ecd).
Preserve all clinical content, game behavior, evidence, cloud and unrelated work.
No commits, push, installs, network, agents or deploy. Shared files require hunk
review. Camera preferences remain presentation-only and origin-local.

## Ownership and acceptance

Scope is the changed-file lists in `docs/research/splitter-map-shade-20261108.md`
and `docs/research/ui-density-20261108.md`, including their tests and plans.
Record every observed source difference in
`.local-dev/release-verify/port22-20261108.json`.
Level 5 guard, launch pins, reports, numbers and checkpoint files must remain
unchanged. Stop and report any Level 5 failure; no rebind is authorized.

## Milestones and validation

1. Capture release hashes and live snapshots; content-diff and attribute hunks.
2. Port accepted layout files and tests, preserving unrelated release fixes.
3. Verify Level 5, run all seven workspace suites (CI, threads), seven typechecks,
   boundaries, player build and affected e2e typecheck.
4. Audit exact changed paths, unchanged bindings/clinical/evidence, and record
   validation and open risks here, in GS028 and the current-thread handoff.

## Progress

- Read both accepted handoffs, including all four density rounds. Browser/GPU
  acceptance belongs to the manager; this task runs no browser.
- Entry snapshots and scoped source copies are in
  `.local-dev/release-port22-20261108/`.
- Port complete: 33 complete files copied and seven camera-only hunks applied
  to `FacilityScene.ts`. Its character-art/QA and access-modifier differences
  were excluded. MobileShell/WorkspaceSplitter require no text change.
- All 124 content-diff paths dispositioned, plus four accepted documentation
  paths: 33 copied / 1 hunk-ported / 94 excluded.
- Focused Level 5: 2 files / 44 tests passed. All 547 input hashes (405 clinical),
  nine saves, three reports, results, guard, launch pins and workload fixture exact.
  Totals remain 26,531 / 6,019,042 / 412 completed / 0 walkouts. No rebind.
- Seven typechecks, affected e2e typecheck and player build pass. Boundaries and
  launcher pass with the actual read-only tracked inventory (7,292 paths);
  direct Node Git spawn is EPERM. Assertion code remains unchanged.
- Broad e2e typecheck has 140 diagnostics in 24 unchanged old files. Native tsc
  against a byte-verified private entry mirror reproduces identical full output
  after path-prefix normalization. No new e2e diagnostic; no unrelated repair.
- Complete: seven suites pass (757 files, 11077 tests, 0 failures,
  1 existing skip). Final scope/hash audit and GS028/current handoffs prepared.
  Manager browser acceptance remains; broad e2e has identical preexisting type debt.
  No rebind, Git mutation, install, network, agent, deploy or clinical approval.
