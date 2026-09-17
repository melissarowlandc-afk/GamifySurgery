# GS-020 scoped reconstruction package

This package preserves the audited 23-file baseline-to-accepted scope for the
technically verified, owner-authorized GS-020 closeout. It is evidence and a
deterministic reconstruction. It is not a standalone runnable game, a deployed
build, or a patch that can be applied directly to repository HEAD `c26c96a`.

Seven shared files contain unrelated GS-017 changes after the GS-020 baseline.
Their accepted hashes therefore describe task-only reconstructions rather than
the complete bytes now present in the shared working tree. The manifest marks
those files with `acceptedMatchesCurrent: false`.

## Restore and verify

From PowerShell, choose a new or empty destination:

```powershell
& .\restore-scoped-evidence.ps1 -Destination C:\path\to\empty\gs-020-restored
```

The script refuses a non-empty destination, copies the preserved `a/`
baseline, preflights and applies the binary-capable patch, and verifies every
restored file against `acceptedSha256` in `manifest.json`. Line-ending
conversion is disabled so accepted bytes reproduce under different Git user
settings.

## Contents

- `a/`: exact pre-GS-020 versions for scoped paths that already existed.
- `gs-020-baseline-to-accepted.patch`: task-only reconstruction, including the
  two dedicated regression suites and two synthetic browser screenshots.
- `manifest.json`: authoritative path inventory and baseline, accepted,
  current-tree and HEAD identities.
- `restore-scoped-evidence.ps1`: empty-target reconstruction and hash check.
- `AUDIT.md`: scope, exclusions, dependency, safety and validation findings.

The local `b/` directory is audit scratch used to compute accepted hashes. It
must be removed before this package is committed. Runtime integration should
reapply the task semantically after its prerequisite routing and persistence
foundation is isolated.
