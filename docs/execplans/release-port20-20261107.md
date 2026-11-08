# Release port 20 and Level 5 rebind 20: flags3 acceptance

## Goal and scope

Port only the manager-accepted flags3 lane described in
`docs/research/question-flags3-acceptance-handoff-20261107.md` and its manager
decision. All writes stay in GS-release; the live tree is read-only. No Git,
installs, network, agents, commits, push or deployment. Preserve the release's
iPhone memory fix, unrelated source, every evidence assertion, frozen saves,
clinician approvals and catalog-only draft boundaries. Do not author content.

## Entry and ownership

Manager identifies HEAD `46e19b2f`. Entry inventory: 7,320 public paths; all
533 recorded inputs match, including 391 clinical files; history has 19 entries.
Level 5 baseline: 30,501 commands, 6,790,515 closing cents, 471 completions,
zero walkouts. Private snapshots and receipts:
`.local-dev/release-port20-20261107/`. Final dispositions:
`.local-dev/release-verify/port20-20261107.json`.

Own the accepted clinical integration, manifest, timing/order hunks, tests,
source/claim ledger and documentation listed by the acceptance handoff, plus
strictly required immutable source/fixture dependencies. Exclude other live
lanes and parked/unaccepted changes. Source retention required for historical
or accepted-source construction does not authorize default admission of r11.
The current release's source and game context are captured before porting.

## Acceptance criteria and milestones

1. Content-diff and disposition every observed path. Inspect shared files by
   content; use hunks if unrelated release/live work is mixed. Record exact
   source/entry/final hashes. Freeze the intended source snapshot before port.
2. Verify exactly four flags3 directed rows supersede B2A02/B2A08, preserving
   all other 67 accepted rows, 1,423 legacy bindings and 11 prior approvals.
   Manifest: 71 rows, SHA-256
   `c32128d1bebad68306fdfb28b893278548998fecb988a0c50dfb2377ebe413d6`.
   Default: 1,141 cases / 1,452 nodes / 606 meanings; SHA-256
   `0fbd0efc0502cb47e463a07ea2c8a74e6ce992876f27442ec5597b17cc5273cf`.
   All four newly accepted versions remain needs_clinician_review.
3. Prove old waiting and in-progress encounters for the three replaced live
   variants preserve frozen identity, choices, reviews and completion under
   snapshot/journal loading. Retain strict codec/runtime limits.
4. Rerun unchanged native Level 5 journey and lower helper in staging with
   original seed/funded opening; verify cash, three reports, best/latest/first,
   >20,000 commands and zero walkouts. Explain every numeric/checkpoint delta
   from actual release inputs. Guard/drivers/assertions stay unchanged.
   Publish only through verify-staged/publish-verified, appending complete
   previous input maps and every prior history entry; only liveCap 4-to-5
   metadata correction. Adjust strict launch pins only to verified results.
5. If legacy comparison hashes or full admitted-concept inventory require
   refresh, prove the exact flags3-only delta, use the established generator,
   and preserve all original serialized inputs and assertion strength.
6. CI=true: all seven workspace suites with threads, all workspace typechecks,
   boundaries if possible, and player build. Classify blockers/timeouts with
   exact native output. Finish with full file/hash audit and appended GS028
   and current-thread handoffs; manager owns review/acceptance and backup.

## Progress and next action

- Read repository instructions and both accepted handoffs. No source/evidence
  ported yet. Entry source and canonical evidence snapshots are retained.
- Scoped content comparison complete. Inspect accepted source/test hunks and
  required fixture dependencies, then port and verify projection/save safety.

## Verified integration checkpoint — 2026-11-07

- 42 source/record paths ported; clinical projection and full manifest hashes
  exactly match the accepted handoff. Eleven clinical approvals and 38 protected
  approval-source paths remain exact. Historical drafts remain unadmitted.
- Strict source-guard adaptation retains the original main-tree capture while
  pinning 35 excluded paths to release entry bytes (13 remain absent). Every
  protected path is still checked; no unrelated implementation was imported.
- Focused clinical 37/37 and player 79/79 pass, including all 31 ship-save tests
  and 12 flags3 fresh/waiting/in-progress/journal cases. Their retained inputs
  are the exact three cases captured from GS-release before this port.
- Initial domain gate: 27 failures = one recorded-input binding, 25 new-history
  comparisons and one complete inventory (605 to 606). Existing comparisons were
  regenerated with the established 25-schema/120-minute loop: only the one new
  empty history on load, and newly admitted encounters during continuation;
  every preexisting frozen encounter and serialized input is exact.
- Native journey and lower helper complete, assertions intact: 26,531 commands /
  6,019,042 closing cents / 412 completions / 0 walkouts. All nine saves and three
  reports changed. Unlock tick 18,644 to 14,906; final tick 28,416 to 24,681.
  Completion rate increases from 16.575 to 16.693 per 1,000 facility minutes.
- Counterfactual current-engine run with only the exact pre-port clinical
  release restores all prior metrics, reports and nine checkpoint bytes. The
  ordinary sorted concept-pool selection first diverges at tick 60; first answer
  choices differ at 102, cash at 103 and XP at 105. This explains the progression
  and elapsed-time change without a simulation/balance change.
- Strict verify-staged passed before local publication. Results, checkpoints
  and legacy artifact written; history 19 to 20, inputs 533 to 539 (397 clinical).
  Six prior bound files changed and six added; the complete release map also
  binds manifest/test-support files omitted from the live handoff's older map.
- Launch pins updated only to verified first report: 51 patients,
  62.51688977024545; player score label 62.51. Existing 4,900,000-byte large-entry
  threshold retained; the staged native fixture measures 5,035,511 bytes.
- Seven typechecks and player build pass (1,034 modules, 7.35s). Five smaller
  workspace suites pass, including 1,362 clinical tests; 33 lint tests pass.
- Root/boundary initially blocked by the inherited no-Git preload. The latest
  brief allows read-only inventory: an exact `git ls-files -z` retry with optional
  locks disabled fails with real sandbox `spawnSync git EPERM`. No Git mutation
  or network was attempted. Standalone launcher check and full player/domain
  suites remain to finish. Keep existing command receipts and staging intact.

Next action: finish full suites, append final handoffs and run the scoped
content/hash audit. Do not rerun or republish native evidence.

## Player validation correction

The initial full player run exposed two launch presentation failures caused by
this worker's temporary 62.52 expectation. The existing domain formatter floors
scores to two decimal places; the correct label for 62.51688977024545 is 62.51.
Only that literal test pin was corrected. The unchanged formatter and all
canonical evidence remain exact. Isolated launch checks pass 16/16; a fresh
complete player run is pending as `player-full-final`, with its own JSON/log.
The initial report is retained rather than overwritten. Use the final full
player report for final workspace totals; record both runs in the handoff.


## Completion — 2026-11-07

- Exact accepted 71-row projection and default hashes verified. No unintended
  default draft admission; all eleven approvals and frozen old cases retained.
- Native current run, lower helper, full pre-port-content control and matched
  prefix establish content-only causal delta; all native invariants preserved.
- Results/checkpoints/legacy generated through guarded staging and publication;
  history 20, 539 inputs. Guard and drivers unchanged. Source/draft/iPhone scope
  preserved. All nine saves and three reports changed, with exact hashes recorded.
- Seven suites: 751 files, 10528 passed, 0 failed,
  1 existing skip. Seven typechecks, player build, lint 33/33 and
  launcher and strict native-inventory boundary checks pass.
- Final-source reruns are domain-full-final and player-full-verified. The
  temporary score-label pin was corrected to the unchanged formatter's 62.51;
  the derived workload retains 18 unique authentic historical operations from
  this run's checkpoints, restoring the existing 27-operation stress fixture.
  Runtime and performance assertions remain unchanged; initial/interim logs
  are retained and classified in the GS028 handoff.
- Boundary recovery uses the actual native-shell read-only inventory with
  unchanged index/inventory hashes. Its 7,219 tracked paths pass the unchanged
  verifier; only Node's direct Git spawning remains restricted by the sandbox.
- Durable GS028/current-thread handoffs appended. Final scope receipt:
  `.local-dev/release-port20-20261107/final-file-inventory.json`.
  Manager owns review/acceptance; no further worker implementation remains.
