# Release port 27: nonretryable conflicts and bounded usage delivery

## Goal and constraints

Port only the client changes accepted in
`docs/research/nonretryable-cloud-conflicts-20261110.md`, plus its new migration
and rollback/disposable SQL test files as inert repository files. Work only in
GS-release. GamifySurgery is read-only. No commits, push, install, network,
agents, database connection, SQL execution, deploy or .github changes.

## Entry and ownership

- Native read-only HEAD: ae0405e85fc87defde913ecb7896e3d2551a9e4e. Existing
  untracked artifact directories are unrelated and will remain untouched.
- Captured 7,542 public files including .github and supabase, all 553 Level 5
  bound inputs (411 clinical), and prior source-guard fixtures before edits.
- Private immutable staging/logs: `.local-dev/release-port27-20261110/`.
- Own the report's six client/test paths, four new SQL files, report/ExecPlan,
  minimal strict source-guard metadata and additive release handoffs.
- Preserve released cloud backoff/recovery and all port-26 renderer/memory
  sources. Exclude clinical harden1, N3 rounds 4/5 and other unreleased work.

## Milestones and acceptance

1. Capture the exact accepted source manifest, isolate every observed content
   difference, and stage only the owned lane. Runtime differences are the two
   conflict codes and the bounded Auth/RPC/fetch/JSON usage request deadline.
2. Adapt only the new static SQL inventory test to the release's five installed
   functions (optional efficient lease migration is absent), while still checking
   all six migration/rollback targets. No default test may execute SQL or open a
   database. Keep the optional request-budget migration excluded; the disposable
   SQL driver must be invoked with NONRETRYABLE_SKIP_EFFICIENT=1 in this tree.
3. Record authorized hash deltas for the two protected transport source/test
   files. Preserve all prior history, captures, unrelated pins, absences and
   guard assertions. Propagate linked guard digests only where required.
4. Verify Level 5 inputs, checkpoints, reports, evidence and launch pins remain
   unchanged. Stop/report a failure; do not rebind.
5. Run focused tests, all seven CI workspace suites with threads, all workspace
   typechecks, boundary/launcher verifiers and the player build. Audit all paths
   and hashes; record exact outputs and a short manager handoff/dispositions.

## Progress and next action

All five milestones complete. 12 accepted paths published (11 exact LF copies,
one static SQL inventory adaptation); 8 strict guard/fixture updates preserve
179 unrelated rows, 74 absences, captures and all earlier authorization history.
23 public paths including additive/new release coordination. Dispositions:
11 copied /9 hunk-ported /113 excluded.

Seven full CI suites:778 files/11,235 tests pass/0 failures/1 existing skip;
focused 141 and Level 5 44 pass. All seven typechecks, player build (664 modules/
12.62s), boundary and launcher assertions pass (exact native Git inventory adapter
after Node Git EPERM). No isolated rerun. All 553 bound inputs (411 clinical),
evidence/checkpoints/reports/launch/history remain exact. No rebind.

Final audit and exact native receipts: .local-dev/release-port 27-20261110/.
GS028 and current-thread handoffs contain the 23-file list, hashes, validation and
manager SQL/browser gates. All existing SQL, .github, port 26 renderer/memory and
excluded lanes remain exact. No SQL executed or applied. No implementation
remains; work is local/uncommitted for manager review, backup and rollout.

## Risks / manager gates

SQL files are not applied here. Manager owns disposable SQL execution (with the
optional-lease skip flag), definition/ACL review, browser cloud/recovery checks,
dual-code client rollout before SQL apply, and live observation. This port does
not establish the exact deployed server retry implementation or reconstruct
expired usage. Owner origin/profile/path and existing saves remain unchanged.
