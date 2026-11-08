# Unsafe-number blocked save (2026-11-08)

## Goal and constraints

Diagnose the supplied redacted Level-2 format-3/worker report using repository
code and synthetic fixtures only. Repair the source and automatically recover
only deterministically repairable numeric values without losing progress,
learning or frozen work. Keep strict integrity, lineage and writer fencing.

Shared tree: preserve the completed UI lane and concurrent content/domain work.
No tester saves/account data, Git, agents, installs, network or live database.
Owned: player session/cloud and narrow source-level domain fix only if proven
necessary; no clinical, character or unrelated UI edits. No Level-5 rebind.

## Evidence and investigation

- Read root AGENTS, the iOS memory-change report and supplied redacted diagnostic.
- Codec `unsafe_number` becomes coordinator `corrupt`, revokes authorization and
  fences every command. The reported worker is healthy, with no task restarts.
- Snapshot encode serializes with JSON.stringify before strict parsing; distinguish
  unsafe integers from harmless signed-zero serialization and genuinely lossy
  incoming decimal tokens. Trace sentinel arithmetic, journal and worker paths.
- No original tester bytes are available/authorized; do not claim an exact live
  field unless the synthetic reproduction and code establish it.

## Milestones and acceptance

- [x] Reproduce and identify field/path; inspect recent memory changes. Indefinite
  attendance counter countdown becomes a fictitious finite calendar interval;
  37 unsafe forecasts across four Level-2 services. Actual resident order is not
  in the supplied trace; no private save was accessed.
- [x] Minimal source fix plus narrowly defined boundary recovery/diagnostics.
  Changed domain bound inputs: reducer.ts and diagnostic-timing.ts; no rebind.
- [x] Regressions: unsafe kinds, snapshot/checkpoint/upload/reopen, blocked-state
  recovery, preserved FSRS/frozen state, real corruption still rejected.
- [x] Focused 19 player files/196 tests and 9 affected domain files/104 tests
  pass; final seven workspace and cloud e2e/QA typechecks pass; player build
  1053 modules/8.03 s passes. Full player: 390 files/3951 tests pass, same four
  files/four tests fail (394/3955), 458.53 s, exit 1. Full suite not green.
- [x] Handoff: docs/research/unsafe-number-blocked-save-20261108.md and additive
  CURRENT_THREAD_HANDOFF; manager owns browser validation/release and rebind.

## Validation environment

Use npm.cmd from PowerShell and the existing sandbox preload
`.local-dev/ios-reload-loop-20261107/validation-preload.cjs`; no browser spawn.
Raw scoped baselines, test logs and measurements:
`.local-dev/unsafe-number-20261108/`.
