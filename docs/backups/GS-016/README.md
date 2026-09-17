# GS-016 scoped reconstruction package

This package preserves the exact 22-file baseline-to-accepted scope for the
owner-accepted GS-016 examination-room milestone. It is evidence and a
deterministic reconstruction, not a standalone runnable game and not a patch
that can be applied directly to repository HEAD `c26c96a`.

## Restore and verify

From PowerShell, choose a new or empty destination:

```powershell
& .\restore-scoped-evidence.ps1 -Destination C:\path\to\empty\gs-016-restored
```

The script refuses a non-empty destination, copies the preserved `a/`
baseline, preflights and applies the binary-capable patch, and verifies every
restored file against the accepted SHA-256 value in `manifest.json`. Patch
application explicitly disables Git line-ending conversion so the accepted LF
bytes reproduce even when the caller has `core.autocrlf=true`.

## Contents

- `a/`: exact pre-GS-016 versions for the scoped paths that already existed.
- `gs-016-baseline-to-accepted.patch`: binary-capable baseline-to-accepted
  patch, including new test evidence and screenshots.
- `manifest.json`: path inventory plus baseline, accepted, current and HEAD
  hashes or blob IDs where available.
- `restore-scoped-evidence.ps1`: safe empty-target reconstruction and hash
  verification.
- `AUDIT.md`: applicability, dependency, validation and safety findings.
- `head-overlay-*-typecheck.log`: proof that the accepted scope alone is not a
  compilable overlay on HEAD because it relies on inherited routing and
  persistence work outside this milestone.

The optional local `b/` directory is a redundant accepted-byte snapshot used
during audit. Reconstruction depends only on `a/`, the patch and manifest.
The large local HEAD archive and working overlay are audit scratch material and
must not be copied into the GitHub backup package.
