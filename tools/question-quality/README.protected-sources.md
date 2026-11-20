# Protected source pins

The [current manifest](fixtures/protected-sources.json) holds one raw SHA-256 or
required absence per protected repository-relative path. Its owning milestone
identifies the source guard or migration that established the pin.

For an approved byte change, update that path's single manifest row. PowerShell
`(Get-FileHash -LiteralPath <path> -Algorithm SHA256).Hash.ToLowerInvariant()`
gives the raw digest. An approved absence uses `"sha256":null,"requiredAbsent":true`.
Keep the rows sorted with LF line endings and UTF-8 without a BOM.
Adding, removing, or renaming a protected path also updates the reviewed
path-set seal in the guard.

Run the consistency check from the repository root.

```powershell
npm.cmd test --workspace @gamify-surgery/clinical-content -- --pool=threads protected-sources.test.ts
```

At acceptance, the manager exports the manifest from the independently accepted
parent and verifies its raw digest against the review record. The private
approval file contains `parentSha256` and `changes`. Each change supplies
`path`, the exact `before` and `after` manifest rows, and an approval `reference`.
Use JSON `null` for a missing row. Keep the approval file and its reviewed digest
in the manager's acceptance lane. Run the approved checker with those two
trusted digests followed by the candidate manifest path.

```powershell
node --experimental-strip-types tools/question-quality/verify-protected-source-authorization.mjs <parent-file> <parent-sha256> <approvals-file> <approvals-sha256> <candidate-file>
```

The checker compares the entire manifest diff with the approved records,
including matched source edits and repins. Both checks are required at acceptance.
Keep earlier versions and approval history at their existing archive anchors.
The [historical scope metadata](fixtures/protected-source-history.json) binds
the retired ledgers to their recovery commit and retains the capture and
reverse-source checks. A normal test run uses the local sealed captures.
