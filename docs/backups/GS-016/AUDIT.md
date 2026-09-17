# GS-016 scoped backup audit

## Conclusion

The accepted GS-016 result cannot be represented as a conventional runtime
patch against repository HEAD `c26c96a111103d8665e33c9258ef54071d729f14`.
Its reducer and several tests depend on a larger inherited, uncommitted patient
routing, check-in and persistence foundation. Applying all of that foundation
would mix unrelated work into the GS-016 backup. This package therefore stores
the exact bounded before/after evidence and a deterministic reconstruction; it
must not be described as a standalone runnable game or merged as a runtime
change.

HEAD already contains a Front-Desk-only `initialRooms` default and the room
construction tutorial wording. The visible defect existed in inherited dirty
starter-room changes captured by the task baseline. The GS-016 acceptance work
then added the narrow tutorial routing bridge, fixture corrections, regressions
and browser evidence on top of other inherited routing work.

## Exact accepted scope

`manifest.json` records 22 accepted files and their SHA-256 hashes:

- 2 balance source/test files.
- 2 player tutorial source/test files and 3 adjacent player test fixtures.
- 1 domain reducer and 9 domain regression/fixture files.
- 2 Playwright specifications.
- 2 PNG browser screenshots.
- 1 E2E receipt log.

The manifest is the authoritative path inventory. All 22 `acceptedSha256`
values matched the accepted shared-tree bytes at package creation, including
the PNGs and E2E log.

## Applicability and dependency evidence

- The binary-capable patch passed `git apply --check -p1` against the preserved
  `a/` baseline.
- The same patch failed preflight against clean HEAD. Conflicts included the
  tutorial, balance, reducer and several domain tests; the two E2E specs were
  absent from HEAD.
- A clean HEAD overlay containing only the 22 accepted files passed the
  balance-config typecheck.
- The domain overlay failed typecheck because HEAD lacks the inherited routing
  and check-in foundation: `getRoomCareAnchor`, encounter check-in and waiting
  fields, public-waiting navigation, new founder activity kinds, unstaffed
  check-in balance fields and the newer persistence schema.
- The player overlay also failed because HEAD lacks accepted persistence APIs
  (`clearPrototypeCampaignStorage`, `createPrototypeCampaignWriteGate`, and
  `savePrototypeProfileResult`) plus the same domain foundation.

The detailed compiler receipts are in
`head-overlay-game-domain-typecheck.log` and
`head-overlay-player-typecheck.log`. These failures establish the backup
boundary; they are not evidence that the owner-accepted shared-tree milestone
failed. The integrated shared tree had already passed the full domain, player,
balance, typecheck, boundary, production-build and browser acceptance described
in the active ExecPlan and handoff.

Final package validation on 2026-09-17:

- Patch SHA-256 matched the manifest:
  `eb27e585b93aaed51d2e3fcc7aa2d60036761d5e38a7f08c7c7d6f348dfd5f5b`.
- A fresh reconstruction under the system temporary directory verified all 22
  accepted hashes exactly, including all text files and both PNGs.
- Re-running the script against that populated target was refused before any
  copy or patch operation.
- The credential-pattern and restricted-provenance scans returned no matches.

## Reconstruction

Run `restore-scoped-evidence.ps1` with a new or empty directory. It copies the
preserved baseline, checks and applies the patch, then compares every restored
file with the accepted hashes in `manifest.json`. It refuses to overwrite a
non-empty target. Git repository discovery is bounded above the destination and
line-ending conversion is explicitly disabled, so the result remains exact
when invoked below another checkout or under a different user Git setting. The
reconstructed directory contains only the scoped files; it is not a complete
checkout.

## Safety and provenance

- Credential-pattern scanning found no API keys, authorization headers,
  private-key markers, passwords or OpenAI-style secret tokens in the accepted
  scope.
- The scope contains no user save/profile export, ignored clinical-workbench
  input, proprietary source, article corpus or clinical-data directory.
- Clinical-looking material is limited to existing synthetic game fixtures and
  regression tests. GS-016 adds no medical claim, question content or clinical
  approval change.
- The two PNG files are intentional browser evidence from disposable synthetic
  game state. They contain game UI and synthetic names, with no personal data.
- Generated and binary evidence is explicitly inventoried and hash-locked in
  the manifest.

## Recommended GitHub backup shape

Commit this reconstruction/evidence package on the isolated
`backup/gs-016-accepted-2026-09-17` branch under a durable backup directory.
Exclude the 140 MB HEAD archive, working overlay, redundant `b/` snapshot,
unrelated feedback/handoff snapshots and all shared-tree runtime files. Label
the commit as scoped acceptance evidence, not a runnable or merge-ready source
checkpoint.

A future runtime integration should first isolate and commit the prerequisite
routing/check-in/persistence foundation. GS-016 can then be reapplied by
semantic hunk selection and rerun against that base. This backup authorizes no
merge, release, deployment or Pages publication.

The shared `beta` worktree, its index and its branch were not changed by this
audit.
