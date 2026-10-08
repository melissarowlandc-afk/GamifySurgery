# Accepted v6c runtime integration

Owner-delegated manager acceptance on 2026-10-08 includes regenerated identity
`patient-gapfill-v6c.018`. The separate `owner-approval.json` binds the exact
accepted sources, 152 pose hashes, 76 authored contacts, corrected review proof
and manager browser results. Historical generation tools, art and pending review
labels remain byte-identical. Runtime status is recorded separately in
`artifacts/character-statics/patient-gapfill-v6c/runtime-integration.json`.

The immutable integration intake was captured before all runtime/test edits:
285 identities / 2,310 assets / 160 adult patient designs. Promotion appends
19 identities / 152 copied PNGs, yielding 304 / 2,462 / 179. All PNGs are exact
accepted bytes at `apps/player/public/art/characters/patient-gapfill-v6c/`.

```powershell
node tools/character-mapping/patient-gapfill-v6c/validate-approved-batch.mjs
node tools/character-mapping/patient-gapfill-v6c/validate-runtime-integration.mjs
node tools/character-mapping/patient-gapfill-v6c/validate-promotion-rerun.mjs
python tools/character-mapping/patient-gapfill-v6c/audit-scoped-changes.py
```

`validate-approved-batch.mjs` executes the original roster, placement, worker
review, all-catalog comparison and adult-revision validators. Its process-local
Node loader extends only the historical allowed-ID seam after checking the exact
approved append-only runtime state. Original validator source bytes and every
historical invariant remain intact; historical set-size checks still check the
original set. Original validator output describes the frozen historical review
labels; the wrapper's final line reports the current authorized runtime state.
Running the old generation-time `runtime-baseline.mjs` directly does not accept
the newly integrated batches; use the integration wrapper for current checks.

The only permitted successor is the manager-accepted `staff-gapfill-v6d` batch.
After that integration, the v6c validator and promoter recognize the exact
318-identity / 2,574-asset state, preserve the immutable v6c receipt against v6d's
pre-edit snapshots, and rerun without removing or rewriting either batch.

Full UTF-8 command output and command/exit/hash receipts are under this batch's
`validation/` artifact directory. `run-validation.py` records commands without
altering shared test configuration. The isolated player configuration runs the
full suite with native loading and one threads worker, as accepted for v6a/v6b.

No Git, deployment, clinical, art-generation, selection-code, reducer/UI or
browser-storage changes are authorized by these tools. Owner playtesting remains
`START_GAME.cmd` → exactly `http://127.0.0.1:4173` in the same persistent profile.
