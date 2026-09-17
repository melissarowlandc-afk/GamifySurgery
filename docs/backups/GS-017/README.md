# GS-017 scoped reconstruction package

This package preserves the audited GS-017 baseline-to-accepted scope for the
owner-authorized playthrough batch. It is evidence and a deterministic
reconstruction. It is not a standalone runnable game, a deployed build, or a
patch that can be applied directly to repository HEAD
`c26c96a111103d8665e33c9258ef54071d729f14`.

The captured baseline came from an integrated dirty tree with prerequisite
work from earlier milestones. Shared files changed concurrently during GS-017.
The accepted reconstruction removes GS-020 imaging hunks while retaining all
GS-017 follow-ups, including staff-event suppression, daily low-cash cadence,
and clinic-wide complaint wording. `manifest.json` marks accepted bytes that
deliberately differ from the current shared tree.

## Restore and verify

From PowerShell, choose a new or empty destination:

```powershell
& .\restore-scoped-evidence.ps1 -Destination C:\path\to\empty\gs-017-restored
```

The script refuses a non-empty destination, copies the preserved `a/`
baseline, preflights and applies the binary-capable patch, and verifies every
restored file against `acceptedSha256` in `manifest.json`. Line-ending
conversion is disabled so accepted bytes reproduce under different Git user
settings.

## Contents

- `a/`: exact pre-GS-017 versions for scoped paths that already existed.
- `gs-017-baseline-to-accepted.patch`: task-only reconstruction, including
  focused tests and six reviewed browser screenshots.
- `manifest.json`: authoritative baseline, accepted, current-tree and HEAD
  identities for all scoped paths.
- `restore-scoped-evidence.ps1`: empty-target reconstruction and hash check.
- `AUDIT.md`: scope, exclusions, dependency, safety and validation findings.

The local `b/`, `scratch/` and `build-package.py` items are audit scratch. They
must be omitted when the durable package is copied to the backup branch.
