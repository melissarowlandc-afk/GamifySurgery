# Codec string-limit diagnosis — 2026-11-11

**Fixture artifact. This failure does not demonstrate a real full-bank save
blocker.** The retirement test passed `initial.sourceRecovery` to the evidence
encoder as `source`. That object includes `.text`, the *entire serialized game*.
The production provenance contract has only `sha256`, `utf8Bytes`, `schemaVersion`.
The encoder consequently embedded the redundant save string at
**`header.source.text`**, where the 262,144-byte **per-string** JSON bound correctly
rejected it. The fix is to pass the three metadata fields, using the full current
bank. No production codec limit, runtime, save format, SQL or domain change.

## Evidence / reachability

- Original main-tree test reproduced unchanged: **11 pass / 1 fail**, 18.60 s,
  failure at separateCampaign.test.ts:54 -> codecEvidence.ts:75 -> codecJson.ts:63.
- `codecEvidence.ts:129–142` creates metadata-only provenance for a real import,
  then returns a *separate* local recovery receipt `{ text, ...provenance }`.
  TypeScript structural typing allows that wider object to be accidentally used
  as provenance; `codecEvidence.ts:74–75` serializes the supplied object directly.
- `importCampaigns.ts:118–122,230–240` uses explicit three-field provenance for
  legacy evidence imports/branches. Snapshot-capable separate campaigns use
  `snapshotImport` instead. The profile importer also selects the three fields.
- `gameSession.ts:95,158,387,509,526` carries `loaded.source`, not sourceRecovery.
  `journalCodec.ts:98–112` uses that seed for old-format checkpoints; normal
  loaded headers have the three fields. Native snapshot journaling/encoding uses
  the game-state object directly. No production caller passes sourceRecovery
  to encodeCloudEvidenceCheckpoint. The remaining such uses are fixture helpers
  which also select metadata explicitly.
- `snapshotCodec.ts:46–84,94–108` serializes/loads a structured game-state object,
  without embedding a whole save as a single text field. Format-2/schema-one
  compatibility imports use the proper provenance route above.
- The 256 KiB check is for decoded application/evidence JSON strings, not the
  aggregate save size. Checked wire blobs and cache envelopes have independent
  aggregate/hash bounds (`codecWire.ts:8–27`, `codecCache.ts:16–32`); they do not
  parse their entire compressed/base64 payload as one bounded gameplay string.

The release's test is **not exercising its 1,250-case default bank** at this
point: GS-release's separateCampaign.test.ts:39–43 explicitly creates the fixture
with QUESTION_FLAGS_PRE_REVISION_RELEASE. The retained control has **1,110 cases /
396 meanings**. Its equivalent 12-retired raw save is 211,453 bytes, below the
cap. The full current bank has 1,330 cases / 1,019 meanings; that raw save becomes
405,238 bytes. The entire 193,785-byte difference in these controlled fixtures is
the initial FSRS/history map (114,479 -> 308,264 bytes). These are structured
cards/IDs, not an embedded clinical catalog/digest. The bad *whole-save-as-string*
argument makes their aggregate size look like one oversized string.

This main-tree test was also a documented baseline failure before batch 4
(`nonretryable-cloud-conflicts-20261110.md`). No new codec behavior is responsible:
normalized source in the checked encode/parse/snapshot/task/import/journal/cache/
wire files matches GS-release. Three raw comparisons differ only in line endings
(snapshotCodec, codecTasks, journalCodec); the other five are byte-identical.
No release-tree file was modified. No tester/account/private-backup data used.

## Measured headroom

All rows use deterministic synthetic or checked-in public Level 5 states; no
saved text, answers, clinical prose or patient details were logged. Byte counts
are UTF-8. Snapshot columns are native format 3, decoded / gzip stored.

| Current full-bank scenario | Accidental `source.text` | Native snapshot raw / stored | Largest actual snapshot string | Free against 262,144 |
| --- | ---: | ---: | ---: | ---: |
| Fresh clinic | 320,948 | 321,402 / 25,901 | 303 | 261,841 |
| 12 retired encounters | 405,238 | 405,692 / 26,813 | 303 | 261,841 |
| 12 retired + 24 active, longest shipped strings | 781,339 | 781,793 / 70,736 | 1,063 | 261,081 |
| Level 5 journey finish | — | 1,694,959 / 140,682 | 6,118 | 256,026 |
| Level 5 lower-repeat checkpoint | — | 1,926,968 / 158,995 | 6,118 | 256,026 |

Level 5's largest field is
`gameState.alertHumor.guidanceTips.observations[discussion-key].signature`;
**97.67% of the per-string budget is free**. These checkpoints retain **403 / 553
FSRS reviews** and **13 / 12 encounters**. Current decoded state is 1,694,470 /
1,926,473 bytes, below 80% of the unchanged 3,000,000-byte ceiling. Header largest
strings are 99 bytes in fresh/crowded current-bank fixtures, 6,118 in Level 5.
The proper header's `source` never contains `.text`.
The original schema-9 Level 5 fixtures also contain exactly 403 / 553 reviews;
their bytes are unchanged (fixture SHA-256 10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346).
The signature builder (`game-domain/src/guidance-tips.ts:628–644`, read only)
records room/door/staff levers, not the growing question bank or FSRS map.

These measurements establish headroom for the current full-bank/realistic Level
5 workloads, not infinite history or arbitrary future content. Existing aggregate
capacity policies remain. Future string/whole-state growth now has an executable
guard rather than a historical catalog pin.

## Fix / guard

- `apps/player/src/session/cloud/separateCampaign.test.ts`: select the three
  provenance fields; assert the exact header fields. Keep the current default
  bank and every retirement/immutable-record/full-state assertion. Nothing is
  removed from the original recovery receipt, FSRS history or frozen encounters.
- Same metadata correction in `session/cloud/automaticResolution.test.ts` (four
  unrelated-slot seed calls), `App.cloudLifecycle.test.tsx` (one),
  `App.cloudReopenAsync.test.tsx` (two), and `tests/e2e/cloud-recovery.spec.ts`
  (one). The first wider cloud run exposed five automatic-resolution failures
  in these seed steps, all with the same header.source.text error. The original
  retirement file's schema-one seed had the same harmless-on-small-input mistake
  and is corrected too. No assertions, transport faults, operation counts,
  conflict/slot/fencing/reload behavior or e2e imports were changed. No remaining
  whole-sourceRecovery argument exists outside the deliberate guard reproduction.
- New `codecStringHeadroom.test.ts`: expand the previously release-only
  investigation into a current-bank guard plus historical control and two real
  Level 5 checkpoints. Reproduce/reject the accidental wide argument; require
  actual header/native strings below **80%** of the existing cap. Check exact
  whole-state, FSRS and encounter round trips, format-2-to-3 conversion, schema-one
  import, and separate-campaign imports with and without snapshot capability.
  Native results contain zero evidence rows. Original input copies remain exact.
  Optional GAMIFY_CODEC_HEADROOM_REPORT emits technical size JSON only.
- This report, ExecPlan and additive CURRENT_THREAD_HANDOFF section.

No runtime sanitization or larger JSON allowance is warranted by this artifact.
Existing legacy headers/readers remain untouched; correct imports still retain
the original source structurally in baseline/evidence references. In the release
port, remove the historical retirement-fixture pin and use this explicit metadata
argument; keep the historical context only as the new guard's labeled control.

## Validation / manager handoff

Artifacts/originals/measurements/comparison patches:
`.local-dev/codec-string-limit-20261111/` (measurements.json has all eight rows).

- Before fix: separateCampaign **11 passed / 1 failed**, 18.60 s, exit 1.
- Focused separateCampaign + new guard, CI/preload/threads: **2 files / 24 tests
  PASS**, 21.43 s, exit 0.
- Guard with measurement artifact: **1 file / 12 tests PASS**, 23.40 s, exit 0.
- First wider cloud run: **74 files / 756 tests PASS, 1 file / 5 tests FAIL**,
  256.55 s, exit 1; all five were the additional fixture setup errors above.
- Corrected retirement/automatic-resolution/App lifecycle/reopen fixtures:
  **4 files / 72 tests PASS**, 46.21 s, exit 0.
- Player typecheck: **PASS**, including final optional-artifact test code.
- Affected cloud-recovery e2e + QA typecheck: **PASS**; no browser execution.
- Final **all cloud + affected App lifecycle/reopen** suite, CI=true with sandbox
  preload, `npm.cmd test -- --pool=threads src/session/cloud src/App.cloudLifecycle.test.tsx src/App.cloudReopenAsync.test.tsx`:
  **77 files / 789 tests PASS**, 249.19 s, exit 0. Final eight measurement rows
  exactly match the table above. All **119 captured session runtime hashes** match
  intake. No existing assertion was removed or relaxed.

No clinical/topic/binding/domain edits, dependency installs, network, commits,
live DB or release writes. Manager owns scoped review, test port, release and
GitHub checkpoint; this is local uncommitted work. No browser pass claimed.

Manager browser check: with the fresh disposable QA server, rerun
`tests/e2e/cloud-recovery.spec.ts --grep "automatic divergence resolution"` in
the normal projects (the corrected unrelated archived-slot seed), or the full
cloud-saves/cloud-recovery suite. No Playwright/codec-worker-reaching import was
added. Port these test corrections with the new guard; the guard always uses the
current default bank and asserts every current meaning has a history entry,
without freezing the catalog to a historical size. Owner launch/origin unchanged.
