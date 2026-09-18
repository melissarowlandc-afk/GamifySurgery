# GS-021 M1 reconstructed review evidence

This evidence is a **reconstructed baseline**, not an original pre-edit snapshot.
The first attempted snapshot did not capture file contents. The baseline mirror
therefore reverses only the exact M1-authored changes available from the prior
worker's patch fragments, plus the later Sol-authored changes recorded during
this handoff. It must not be described as the original working tree.

- `../gs-021-m1-sol-start/` is the verified, byte-for-byte snapshot captured
  before the Sol completion edits for the ten files then assigned.
- `../gs-021-m1-reconstructed-baseline/packages/` is the reconstructed
  pre-M1 source used for review.
- `../gs-021-m1-current/packages/` is the final 13-file M1 source mirror.
- `m1-authored.patch` is the cumulative reconstructed-baseline-to-final patch.
- `hashes-reconstructed-baseline.tsv` and `hashes-current.tsv` contain SHA-256
  hashes with paths relative to each `packages/` mirror.
- `../gs-021-m1-review-replay3/packages/` was created from the reconstructed
  baseline by `git apply -p3`. All 13 replayed files matched the final mirror
  byte-for-byte by SHA-256 on 2026-09-17.

The earlier `gs-021-m1-review-replay` and `gs-021-m1-review-replay2` attempts
are retained as failed evidence: their patches were written with Windows CR
line endings. `replay3` used an LF-only patch and is the verified replay.
