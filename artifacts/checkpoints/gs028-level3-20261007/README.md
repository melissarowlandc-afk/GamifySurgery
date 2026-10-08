# GS-028 Level-3 twenty-group recovery checkpoint — October 7, 2026

The owner explicitly requested **Push to GitHub** after this batch was authored,
implemented and validated. This archive preserves the batch as a recoverable
checkpoint on `beta`. It is a backup, not a runnable integrated checkout, merge,
release, gameplay update or Pages publication. Pages deploys only from `main`.

## Contents and clinical status

`files/` contains15 byte-exact task-owned copies: eight dated clinical TypeScript
files, the new domain/browser tests and five dated documents. The batch adds20
objectives,80 questions,62 encounters including18 two-decision visits,248 adult
profiles,66 atomic claims and14 permitted sources. All start at Level3, the current
playable maximum. All clinical records remain `needs_clinician_review` with no
named clinician approval or public-release authorization. The copied receipt's
local-only wording describes acceptance before this later backup request.

`recovery/patches/` contains23 narrow patches: five runtime integration changes,
eight clinical historical-inventory isolations, six domain admission/inventory
updates and four completed-batch documentation sections. Changes preserve the
new stage3 guard, shuffled choices, separate clinical/progression/capability
fields and four specialist non-execution records. No scheduler/economy/FSRS,
artwork, save, CT timing, statistical/ethics wording or other authoring is included.

## Captures, inferred fixtures and recovery limits

11 patch baselines match byte-exact historically captured pre-edit files;
12 are explicitly inferred compatible counterparts obtained by removing only
the listed owned changes from current shared files. Concurrent statistics and
other edits remain in those local compatible baselines; their deltas are absent
from this archive. `recovery/SOURCE_HASHES.json` records each target, changed line,
hunk, baseline/target/patch hash and actual-capture versus inference distinction.
Full mixed baselines/current shared files are not included. The supplied
`.gitattributes` prevents newline conversion for exact archival bytes.
Patches use LF-normalized compatible fixtures; target hashes and exact replay
checks refer to those fixture bytes. Raw active-file hashes are recorded
separately. The fifteen copied task files retain their original raw bytes.

Earlier uncommitted clinical batches and other dirty runtime dependencies are
required separately for integration. This archive does not back them up or claim
the current dirty game can be recreated from this checkpoint alone. Recover the
matching prior checkpoints/compatible dependencies, inspect each narrow patch,
then rerun validation. Do not apply blindly to the live shared checkout.

From the repository root, verify archived hashes, exact inventory and safety:

```powershell
python artifacts/checkpoints/gs028-level3-20261007/verify-checkpoint.py
```

With separately retained compatible baseline fixtures, verify forward/reverse
byte-exact replay in a new ignored scratch directory:

```powershell
python artifacts/checkpoints/gs028-level3-20261007/verify-checkpoint.py --baseline-root .local-dev/gs028-20261007-level3/backup/compatible-baselines
```

The verifier preflights all fixture hashes before writing scratch. It never
modifies supplied baselines, active source, the Git index, refs or remote. It has
no active integration or commit/push mode. Historical validation is metadata, not
clinical approval. Raw private sheet data, patient records, source prose/PDFs,
proprietary texts/question banks, credentials, saves, dependencies/build output,
images and unrelated concurrent work are excluded.

## Accepted validation

Clinical69/69 and full clinical583/583; new gameplay258/258 and exact timing/order
inventory6/6; statistics inventory follow-up50/50; eight TypeScript configurations,
boundaries/launcher, balance66/66, isolated build and desktop/phone browser6/6 pass.
Full-domain snapshot3103/3106 preceded the50/50 inventory repair; two earlier CT
busy-reading queue expectations remain, as does a separate player pending-label
expectation. No full shared-tree green claim. Source restrictions and specific
SCORE retrieval limits remain explicit in the dated receipt and coverage audit.

The canonical owner playtest remains `START_GAME.cmd` →
`http://127.0.0.1:4173` in the usual persistent browser profile. The isolated QA4329
server was stopped; owner origin/profile/saves were untouched. GS-028 stays open
for future owner-requested batches. A push does not publish the live game.
