# GS-024 public checkpoint audit

Audit date: 2026-09-22. Candidate branch:
`backup/new-computer-2026-09-22`. This is an isolated checkpoint audit, not a
receipt for a push. The remote is public, so art/source boundaries matter.

## Included and verified

- The pre-documentation payload had 4,075 per-file source SHA-256 records
  totaling 522,025,395 bytes. Rehashing those files in the source and candidate
  found 0 missing, 0 source changes and 0 candidate mismatches. The final
  manifest also records this audit, the setup guide and updated handoff as
  candidate-authored files. The source worktree/index were not modified.
- Added 374 public-safe character-tool text files for GS-018, GS-019 and GS-022,
  including approved-pose validators, prompt/provenance records and design
  validation tools. Four explicitly private-path GS-019 scripts remain excluded.
- Added 440 current tool/artifact text files whose paths were in the audited
  GS-013 text-only branch allowlist. These are copied from the **current** source
  tree and independently hashed, not overlaid from the historical branch.
- GS-018 approved 704 standing/seated pose outputs and 30 clipboard outputs
  remain in the candidate. Ten final approved contact sheets remain. GS-022
  approved 40 front designs and pending 280 other poses retain their review
  status; their text-generated source sheets and continuation records are in the
  included output roots. These are development assets, not new runtime joins.

## Excluded from public GitHub

- `Photos for Codex/`, `Photos for Codex 2/`, `generated_images/`, and source,
  rejected or unapproved GS-010/GS-013/GS-019 raster iterations and proofs.
  Specifically, all `artifacts/character-movement/gs019-*` rasters and
  `tools/character-mapping/gs019-*/*.{png,webp}` stay out. The four GS-019
  private-path scripts are listed in `GS-019_BACKUP_INVENTORY.json`.
- GS-018 `f19-reference.png`, `f20-reference.png`, and 577 intermediate/source/
  candidate proof files were removed from the isolated candidate after each
  matched its original copy hash. Their exact paths and hashes are in
  `GS-024_INVENTORY.json` under `removedPrivateAndIntermediate`. The final
  approved poses and ten final contact sheets remain. GS-018 tool asset PNGs
  include private source/rejected candidates and are excluded, while their
  public-safe prompt/tool text is preserved.
- Credentials, `.env` values, browser saves, private clinical inputs,
  proprietary PDFs, dependency/build caches and `.local-dev` remain outside
  GitHub. Prohibited source PDFs were not opened. Optional art pipelines may
  need private local inputs; this Git clone alone cannot rebuild every art proof.

The owner reports a separate whole-computer Tailscale transfer. This audit
neither reconstructs nor verifies the private files on that computer and makes
no claim that the GitHub checkpoint contains them.

## Text scan and staging gate

The scoped credential-pattern scan returned four matches in the pre-document
payload: `apps/clinical-context-workbench/server/commands.test.ts:908` (synthetic
query fixture), `integrated-services.test.ts:147` (NCBI API-key test fixture),
and `apps/player/src/session/prototypeStorage.ts:194,197` (local campaign token
generation). No match values are stored in this report. The parent must confirm
the test fixtures and perform the final staged-path/secret review before commit.
The pattern scan cannot prove absence of all secrets.

The final push/clean-retrieval receipt and test results belong in the transfer
handoff after parent verification. This audit does not authorize a main merge,
release or deployment.

Parent gate review: all four pattern hits are confirmed synthetic fixtures or local token-generation identifiers. A further scoped known-token/private-key scan and inline base64-image scan found no matches. Parent independently rehashed4075 source/candidate files with zero drift. The test-only clinical-research pool correction is recorded as an intentional departure from its captured source hash.
