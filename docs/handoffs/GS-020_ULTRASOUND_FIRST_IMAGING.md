# GS-020 — Ultrasound-first imaging

Status: closed with verified GitHub backup; owner explicitly authorized audit/commit/GitHub backup/verification/archive on 2026-09-17 ("Okay, you can do 2"). No additional hands-on gameplay confirmation is inferred.
Plan: [ultrasound-first-imaging](../execplans/ultrasound-first-imaging.md).

## Approved scope and decisions
GS-011-028/034 authorize Level-1 ultrasound in place of the required X-ray room, no new imaging control rooms or control-specific access dependencies, and mobile shared imaging technicians. X-ray moves to optional Level 2 with no added progression objective. Existing prices, service timing phases and rewards remain. GS-011-029's global timing table/economy redesign and new clinical material are excluded; GS-006 retains clinical meaning/version review. CT/MRI progression remains unchanged.

Ultrasound construction remains $950, X-ray $750, and technician hiring $300. The obsolete $440 control-room purchase is no longer needed. Examination Room upgrade upkeep remains +$1; an accidental intermediate change was rejected during parent review and restored before final player validation.

Existing saved control rooms retain identity, geometry and doors as legacy space, with zero base and upgrade upkeep. New construction/upgrades are blocked. Manual sale retains the established resale calculation; no automatic refunds, demolition, exchange or resets occur. Existing X-ray rooms and unlocked levels remain usable. Level-1 campaigns still need ultrasound to satisfy the new objective; already-reached Level 2 is not revoked.

Generic ultrasound orders whose frozen clinical gate permits the existing offsite ultrasound service may select its equivalent onsite route for a newly scheduled test. No clinical text, key, concept version or result narrative changes. Already-pending tests retain their frozen route/timing. Technician travel must fit the existing acquisition window; otherwise the established offsite route remains available, without inventing new timing values.

The selected operational room and concrete reachable technician are chosen together. Reservations persist through delayed answer feedback and end after acquisition, allowing the same worker to travel to another room while external interpretation continues. Busy assigned techs cannot be fired. Reload preserves/reconciles the task/worker pair; legacy pending services without worker IDs retain their aggregate capacity reservation.

## Baseline and ownership
Shared beta starts at c26c96a111103d8665e33c9258ef54071d729f14 with extensive unrelated changes. Ignored `.local-dev/gs-020-baseline/` records initial status, full tracked patch and relevant source/test/document snapshots for task-relative review. Preserve GS-016 accepted opening/tutorial behavior, GS-017 alerts/chart/patient flow and GS-015/018/019 art/motion. No renderer/art ownership taken.

Terra `imaging_inventory` completed dependency review, initial catalog/domain implementation and UI changes. Parent review found scheduling/guard defects; Sol `imaging_scheduling_review` independently reviewed, corrected the coupled scheduling/save issues, implemented direct regressions and completed browser acceptance. Parent reviewed actual baseline-relative diffs, independently tested, and made one tiny test correction to assert reload during actual partially completed movement. No Spark assignment: scheduling, compatibility and routing require judgment.

Concurrent GS-017 patient-attention/cadence and alert-persistence changes appeared after the initial baseline. They are not GS-020 changes; baseline-relative whole-file patches are not a staging manifest. Scope any future backup to imaging hunks only.

## Implementation map
- Catalog, unlocks, prices, legacy buildability, technician OR prerequisites and existing service capability requirements: `packages/balance-config/src/prototype-balance.ts`, `schema.ts`; imaging alert copy/level eligibility in `prototype-alerts.ts`.
- Ordinary doors and resource/technician selection: domain `doors.ts`, `selectors.ts`, `patient-travel.ts`; technician home choices in `staff.ts`.
- Frozen concrete technician identity, movement task, feedback reservation, build/hire/upgrade/fire guards and reload reconciliation: domain `types.ts`, `reducer.ts`, `persistence.ts`; obsolete control dependency removed from `facility-experience.ts`.
- Player build/hiring/legacy inspector and setup guidance: player `session/viewModels.ts`, `session/alertViewModels.ts`, `ui/HelpDialog.tsx`. Legacy renderer/icon support remains deliberately intact.
- Direct regressions: new domain `tests/ultrasound-first-imaging.test.ts`, updated balance catalog test and domain facility-management/facility-experience/game-domain/spatial fixtures; new browser `tests/e2e/ultrasound-first-imaging.spec.ts`.

## Evidence
- Pre-change balance suite: 13/13 passed.
- Worker direct imaging suite:10/10; focused core suite49/49; balance13/13 and domain/balance typechecks passed.
- Parent all seven workspace typechecks and dependency/launcher boundary checks passed.
- Parent full serial domain suite342/343 passed; only failure was the existing patient-supply inventory test's5-second timeout under load. Immediate isolated rerun passed3/3 without changing its timeout.
- Parent focused imaging/timing/game-domain tutorial rerun40/40 passed. Parent then strengthened the movement assertion and reran imaging10/10 successfully. This includes the accepted all-wrong opening tutorial tests.
- Baseline player subset had7 failures in existing GS-017 alert tests; build/tutorial/service-preview subsets passed. Those active peer changes subsequently settled: parent final player suite passed438/438 across72 files.
- Parent isolated production build passed368 transformed modules into `C:/Users/KYLEKE~1/AppData/Local/Temp/GS-020-player-build`; existing large-chunk advisory only. Owner build artifacts unchanged.
- Parent confirmed clinical-content source unchanged against the task baseline and no whitespace errors in inspected domain/balance diffs.
- Sol browser acceptance2/2 passed in1.6 minutes on isolated4187; parent independently reran2/2 in1.6 minutes (43.2s build/progression,50.6s service flow). Command: `GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:4187 npx playwright test tests/e2e/ultrasound-first-imaging.spec.ts --project=desktop-chrome --workers=1`. Parent used `.local-dev/gs-020-parent-browser-results` for isolated result output.
- Browser proof starts a real fresh campaign and checks only Front Desk/no examination room; performs real ultrasound placement, ordinary shared-door placement and Done/Save; then seeds a deterministic operational L1 campaign for actual Advance-to-Level-2 and X-ray build-option checks. The authored ultrasound order is chosen through UI, remains pending with no future finding, reloads with matching operation/due/tech identity, and reveals its result after normal4x facility time. This is representative fixture-backed acceptance, not a full natural playthrough from Level0 to Level2.
- Parent visually reviewed [completed ultrasound goals](../../artifacts/screenshots/gs-020-ultrasound-build-goals.png) and [onsite pending ultrasound](../../artifacts/screenshots/gs-020-onsite-ultrasound-pending.png). The latter shows the existing75-minute route and no future result.
- Final parent all-workspace typechecks, balance13/13 and final isolated production rebuild passed. The owner subsequently authorized closeout as recorded above.

## Owner pathway and closeout
Canonical play remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in the owner's usual profile. Tests use separate local preview/storage; owner saves and server must remain untouched. No deployment authorized.

The temporary4187 preview was stopped after verification; the owner4173 server was not restarted and owner saves were not opened/reset. Review Level1's Ultrasound Room objective/build card, staff it through normal doors, and confirm X-ray is available after Level2. Existing saved control rooms remain visible as inert legacy space; existing X-ray rooms remain usable.

No qualifying implementation was left undelegated. Parent's only implementation correction was the tiny stricter mid-walk regression assertion; parent otherwise owned planning, review, documentation and independent validation. Terra implemented catalog/access/UI; Sol completed difficult scheduling/persistence and browser acceptance.

Scoped backup committed and pushed to `backup/gs-020-imaging-2026-09-17`: [fdd5bf7cd75d1c4b7926c06447d8ed2dd988ed3d](https://github.com/melissarowlandc-afk/GamifySurgery/commit/fdd5bf7cd75d1c4b7926c06447d8ed2dd988ed3d). `git ls-remote` verified the exact commit on origin; beta remains c26c96a111103d8665e33c9258ef54071d729f14. No merge or deployment occurred.

Sol prepared the isolated `docs/backups/GS-020/` reconstruction package; parent reviewed the actual imaging-only patch, credential/provenance inventory and staged paths. Seven mixed files exclude concurrent GS-017 hunks. The package preserves19 prerequisite baseline files, a23-path binary-capable patch, SHA-256 manifest, audit and empty-target restore script. It is evidence/reconstruction, not a standalone runnable or merge-ready game. Parent independently verified all23 restored hashes, populated-target refusal, source whitespace, zero credential-pattern hits, and a second restore from the committed Git archive. Patch-artifact whitespace notices are required blank context lines. Shared beta source/index, owner server and saves were preserved.

Closeout complete under the owner's explicit step-2 authorization; task ready for archival. Owner reports completion to GS Manager.
