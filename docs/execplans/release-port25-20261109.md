# Release port 25: cloud revision-conflict loop

## Goal, scope and ownership

Ship only the manager-accepted client fix described in
`docs/research/cloud-revision-conflict-loop-20261109.md`. Write only GS-release;
GamifySurgery is read-only. User-stated release HEAD a9559c24 reverts pan/zoom
and restores the 9439b199 tree. Preserve all shared work.

Own coordinator.ts, supabaseTransport.ts, gameSession.ts, the new
revisionConflictLoop.test.ts, the accepted report/plan, necessary exact clinical
source-guard authorizations and their digest links, and coordination handoffs.
Exclude retained camera, phone-memory, catalogue precompute/durable restart,
CI-retry test changes and every other live-tree lane. No commits, push, installs,
network, browser, agents, SQL, .github changes or deployment.

## Entry and discoveries

- Read repository instructions, current handoff and accepted report. Captured
  7,463 public files and all 553 bound inputs before implementation in
  `.local-dev/release-port25-20261109/entry-state.json`.
- Verified all seven accepted worker final-source hashes against live.
  All three runtime files in GS-release are text-identical to the worker's
  captured before versions. Their full accepted deltas are isolated; no runtime
  hunk merge is needed. Do not import the live current-thread handoff wholesale.
- The worker reproduces a renewal-conflict loop when recovery preparation
  returns false, and transport retries against a rejected base. Attribution of
  the entire live database volume remains unconfirmed. This task changes the
  client only and makes no claims about current server traffic.

## Milestones and acceptance

1. Capture source before/after and content-diff both trees; disposition every
   observed difference in `.local-dev/release-verify/port25-20261109.json`.
2. Port only six accepted source/test/document files. Record exact authorized
   source deltas where protected; retain immutable captures, every unrelated
   source/absence check and prior history; propagate only linked guard digests.
3. Verify all Level 5 inputs, pins, reports, checkpoints and evidence remain
   byte-identical and pass existing integration/launch tests. Stop on failure;
   do not rebind presentation/client changes.
4. Run focused conflict/recovery tests, all seven suites with CI=true and
   threads, seven typechecks, boundaries if possible and player build. Record
   native exit codes, exact counts and any baseline failure/timeout evidence.
5. Audit exact file scope and UTF-8/LF output. Add a short release handoff with
   file/hash list, validation, exclusions and rollout risks; update current handoff.

## Progress and next action

Six accepted files ported with LF normalization. Eight guard/fixture files record
the exact three runtime deltas and linked guard digests. All guard statements
are unchanged except fixed fixture digest/count constants. The existing pin
counts are 44→45, 46→47 and 83→84 (only supabaseTransport is a newly added row);
flags4 retains one linked pin. Complete prior fixture hashes/rows/history,
164 unrelated old pin rows and 74 required absences are preserved.

Dispositions: six copied / eight hunk-ported / 146 excluded. Runtime text before
matches the accepted worker baseline; raw live hashes were checked against the
worker manifest before LF normalization. Excluded catalogue plugin/build files
are explicitly listed as well as every helper content-diff path.

Focused cloud: five files / 92 tests pass (all 11 new regressions and the
266-command blocked-save recovery case included),13.45s. Level 5 integration/
launch: two files /44 tests pass,96.13s. All553 inputs (411 clinical), evidence,
checkpoints and launch/workload pins remain byte-identical; no rebind.

Seven typechecks and boundary/launcher checks pass (read-only native inventory
bridge after Node Git spawn EPERM). Normal player build:1048 modules,6.67s,
exit0, existing chunk/import/plugin warnings only. Full player uses its existing
four-worker cap; domain and the other five workspaces use two threads each.
No assertions, thresholds, retries or timeouts changed.

Full-suite runs and the final source audit are complete; handoffs are appended. Private logs and immutable
JSON receipts use `.local-dev/release-port25-20261109/`.

## Risks

Existing open clients retain old code until refreshed. Real browser/cloud
acceptance and request-ID correlation belong to the manager. No server-side
cancellation or reduction in live traffic can be proven by this offline port.


## Completion

All five milestones complete. Seven suites:764 files /11141 passed /0 failed /1 existing skip. Seven typechecks,boundary/launcher and build pass. No product bound input, Level5 pin/evidence, excluded lane or .github drift. Exact validation and changed-file audit are in `.local-dev/release-port25-20261109/validation-summary.json` and `scope-audit-final.json`. Local/uncommitted; manager owns browser acceptance, backup and rollout.
