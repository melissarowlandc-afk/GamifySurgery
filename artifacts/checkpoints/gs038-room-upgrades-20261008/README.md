# GS-038 room upgrade recovery checkpoint

Prepared October 8, 2026 after the owner requested **Push to GitHub**. This
checkpoint preserves the accepted upgrade implementation in the shared dirty
working tree. It is a recovery archive, not a clean runnable aggregate checkout.
No merge, release, deployment or Pages publication is authorized by this backup.

All 22 current playable room ladders have four purchases, Level 1 through 5,
with the accepted prices and room-specific benefits. Examination upgrades add
two satisfaction points per purchase without increasing capacity. Reading
upgrades reduce onsite interpretation work by 10% per purchase. Nine future
room ladders remain inert metadata. Frozen fees, work and legacy-save contracts,
four Reading stations and hiring cap, ordinary room artwork and base capacity
are preserved. Build Mode shows benefits, current/next totals, next cost and MAX.

The payload contains 12 attributed milestone patches, 15 complete task-owned
new source/test files, the accepted plan and the GS-038-only handoff excerpt.
Patch headers are normalized to repository-relative paths and LF; hunk content
is unchanged from accepted ownership evidence. Full shared-file baselines and
combined postimages are deliberately excluded. Every one of the 80 per-file
contracts reconstructs the canonical LF postimage from its private captured
preimage; all available observed postimages match. The six concurrent
satisfaction-display rounding edits are excluded from the UI patch. Later
changes to shared view-model and facility-rendering files are excluded too.
Canonical hashes compare LF text, not original CRLF byte identity. Archive-local
.gitattributes preserves the stored bytes.

Recovery requires compatible versions of the surrounding game, including the
separately backed GS-034 diagnostic timing, GS-037 employee training, room/build
and roster integrations. Start with their recovery guides. See
recovery/PATCH_CONTRACTS.json for each comparator/target hash, path and scope.
Apply patches 01 through 12 in order in a separate recovery checkout, checking
each shared preimage first. These patches were captured at different milestones
of concurrent work; they are not a promise that all stages apply blindly to
current beta HEAD. Reconcile intervening changes while retaining each owned
hunk. Do not apply them to the active shared working tree. The files/ directory
contains final versions of the 15 wholly task-owned files and supplements the
patch history; do not install those files and then reapply their creation hunks.
The manifest inventories every payload except itself with byte count and SHA256.

Run the dependency-free archive audit from the repository root:

    node artifacts/checkpoints/gs038-room-upgrades-20261008/verify-checkpoint.mjs

If the original private comparison evidence is available, verify git forward,
reverse and reapply contracts in fresh isolated scratch:

    node artifacts/checkpoints/gs038-room-upgrades-20261008/verify-checkpoint.mjs --private-contracts .local-dev/gs038-room-upgrades/backup-private-contracts.json

The verifier never applies patches to active source, stages files, changes Git
refs or accesses browser saves. Fixture scratch stays beneath the private
contract file's directory. No private logs, save JSON, screenshots, traces,
owner data, clinical inputs, proprietary sources, credentials, compiled builds,
dependencies or unrelated implementations are packaged. No clinical content
was authored or promoted by GS-038.

Reviewed acceptance: balance 66/66, game-domain 3157/3157, all workspace types,
production build, upgrade desktop/phone browser 4/4, production diagnostic
browser 10/10, Reading-cap/reload 2/2, Management training 1/1 and private
clone/replay probes 5/5 passed. Full player was 844/845, with an inherited
outside-thyroid label assertion independently reproduced from the pre-UI source.
Existing Build Mode retired-Control and training actor-array-order assertions
remain documented limits; the complete order-normalized training replay passed.
Boundary and launcher rules passed with a private larger Git output buffer;
the ordinary invocation had ENOBUFS. These are historical implementation
acceptance results, not a fresh acceptance claim for later concurrent edits.

Sol upgrade_catalog implemented catalog/support/Reading and corrections; Sol
upgrade_runtime_map implemented revenue/experience/UI/browser checks. Bounded
Astra reading_upgrade_review reviewed the difficult final Reading corrections.
The parent inspected actual owned patches and independently validated acceptance
and backup contracts. Remote verification is recorded in the live handoff after
the push; documents copied here retain their historical local-only status.

Owner playtesting remains START_GAME.cmd -> http://127.0.0.1:4173 in the usual
persistent browser profile. This checkpoint does not update the remote game or
move existing saves between origins.
