# Seventh checkpoint worker handoff

**Local only.** The manager audits, stages, commits, pushes and verifies GitHub.
Worker writes stay inside this new archive; no Git mutation, network, agents,
install, deployment or publication. Shared handoff is live-only because it changed
during the run; the worker did not edit it.

- **3,343 archive/stage files; 1,151,859,323 bytes.**
- **2,938 recovered targets:** 350 exact patches and 2,588 whole files.
- Integrity/live hash/provenance checks, disk restoration, forward/reverse/reapply,
  **27 negative guards**, full safety scan and final metadata/subset seal: **PASS**.
- All **8,526** files in six prior archives match manifests and committed blobs.
- **56 topic packets + 56 source ledgers**, **422 clinical-package targets**;
  drafts remain **needs_clinician_review**. No clinical approval or promotion.
- No real credentials/env files, tester identities/rosters, owner saves/browser
  data, proprietary source containers or regenerable build/test output included.
  **127** reserved synthetic identities are listed.
  Source-prose checks are offline declarations/fields/paths, not plagiarism review.
- **56 observed concurrent paths** are live-only;
  **15** were intake selection targets. Exact paths/hashes and
  available immutable release references are in live-only-recovery-references.json.
- **SIZE FLAG:** total exceeds **1 GB**; no file exceeds **50 MB**. Largest file
  is **27,134,983 bytes**. Proposed two-volume split: core-and-fixtures: 679,370,772 bytes; research-packets: 472,488,551 bytes.
  No split performed; recombine both volumes before verification/restore.

Exact output: [strict verification](strict-verification-output.txt),
[restore dry run](restore-dry-run-output.txt),
[isolated disk/patch reproduction](restore-roundtrip-output.txt).
The first disk attempt hit Windows' path limit; shortened archive-local scratch
passed and all temporary files were removed. Gameplay/build/DB tests were not run.

Manager next action: inspect README, exclusions, safety/full-seal and split records;
rerun the README checks; stage exactly **STAGE_PATHS.txt** using the proposed commit
message. Verify the pushed remote commit, then update the shared handoff. This
worker task has not created a GitHub backup. Origins/profiles/pathways are unchanged.
