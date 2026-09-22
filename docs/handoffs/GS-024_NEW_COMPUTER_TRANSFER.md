# GS-024 new-computer GitHub checkpoint

This handoff describes the candidate on `backup/new-computer-2026-09-22`.
The parent task records the final commit, remote verification and clean-clone
results here after publishing. Until then, this is not a remote backup. The
original shared `beta` worktree and index were not changed by this audit.

The candidate contains the current integrated game/workbench source, locked
dependencies, runtime assets, tests, public-safe plans/handoffs/screenshots,
accepted GS-018 static poses, GS-022 approved front concepts and unfinished
cardinal work, and public-safe character-tool text. Backing up these files does
not approve draft clinical content, pending room designs or unfinished art for
runtime. `GS-024_INVENTORY.json` lists each included path, byte count and SHA-256.
The pre-documentation payload has 4,075 files / 522,025,395 bytes. All 4,075
source and candidate hashes matched on 2026-09-22. The final manifest also
lists this handoff and the two candidate-authored setup/audit documents.

`GS-024_AUDIT.md` records the public/privacy audit and excluded categories.
The owner's whole-computer Tailscale transfer is separate from this GitHub
checkpoint; this task has not verified its private-art contents at the new PC.
No private dependency should be inferred to exist in a fresh Git clone.

Use [NEW_COMPUTER_SETUP.md](../NEW_COMPUTER_SETUP.md) for the exact branch,
install, validation and launcher steps. Browser-local campaigns are tied to
their origin and browser profile and do not transfer through Git. Codex task
history and credentials also are not restored by cloning the repository.

Pending parent acceptance: review exact staged paths, verify test/build and
basic startup from a clean retrieval, record final branch SHA and remote SHA,
then update this handoff with results. No main merge or Pages deployment is
part of this checkpoint.

## Pre-push validation
Locked install passed. Build, runtime boundaries and all seven workspace typechecks passed. Serial workspace checks plus repeated clinical-research verification passed1,577 tests. The only checkpoint-specific code/configuration correction sets clinical-research Vitest pool to threads to avoid Windows nested-worker fork crashes; it passed83/83 tests three consecutive times. No gameplay changes were authored for transfer. Fresh remote retrieval is still pending.
