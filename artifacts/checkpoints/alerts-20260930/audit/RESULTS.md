# Checkpoint audit evidence

Assembly date: 2026-09-30

- Source branch/HEAD: `beta` / `57de88061a17b0e59eeba34d7ea6f1b66c9e7fe2`
- Exact task files: 20
- Shared integration records: exact TypeScript slices, an isolated unified CSS
  patch, and restoration notes covering 6 mixed files
- Deployment/release actions: none
- Dependency/package-manager actions: none

## Integrity

`audit/assemble.ps1` copies only its explicit allowlist and creates a SHA-256
manifest. Manifest verification recomputes each payload hash and byte count.

## Scope scans

The final archive was checked for forbidden path classes (`.env`, save/storage,
credentials, dependency stores, logs, build output, screenshots, generated art,
raw inputs and clinical development batches). None are payload paths.

Text scans for common credential markers, private-key headers, bearer tokens,
GitHub tokens and AWS access-key prefixes found no candidate secret. URL review
found only the public design references already recorded in the task plan and
the canonical local playtest URL in project documentation.

Clinical-content review found no authored cases, questions, answer choices,
diagnoses, evidence claims or clinical source excerpts. Some software names and
player-facing clinic terms are expected; this checkpoint changes notification
behavior and presentation rather than clinical teaching content.

## Limitations

The runtime source files listed in `recovery/shared-integration.md` were not
copied wholesale because current versions contain concurrent unrelated work.
Exact alert code slices are preserved, but their integration is manual and must
be reviewed/tested on the selected base.
The manifest protects archive integrity, not semantic compatibility with an
arbitrary future branch.

The isolated CSS patch passes `git apply --check --ignore-space-change` against
the captured M5 baseline. The flag is required because baseline line endings
differ from the generated patch context.

