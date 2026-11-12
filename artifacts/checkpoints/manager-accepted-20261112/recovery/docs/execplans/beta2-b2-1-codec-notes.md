# B2.1 codec and evidence contract

2026-10-17. Offline codec only; no runtime integration or upload. Cloud format,
evidence contract and request protocol are independently versioned at **1**.
The only supported mode is `baseline-import-only`. `liveEvidenceReady` is always
false. The manager must resolve the evidence-export and capacity gates below
before accepting an evolving cloud save implementation.

## Baseline and field ownership

`prepareCloudBaselineImport` takes one exact serialized game, explicit selected
campaign metadata and a caller-owned import operation ID. It never reads browser
storage, profiles, Auth, another campaign or the network. It returns unchanged
source-recovery text/hash/UTF-8 size, a complete original parsed import baseline,
a full migrated snapshot envelope, the immutable request bytes/digest, migration
field names and measured capacity results. The caller must durably retain the
original source bytes before enrollment; returning them is not a storage write.
An identical operation retry must send the saved `transport.text` unchanged.

The immutable baseline owns all available imported game facts, including data
that the existing public loader normalizes. Its `sourceStateSha256` identifies
the original device bytes and is provenance, not a server-recomputed JSONB hash.
`baseline.<sourceStateSha256>` is stable for those exact bytes. Whitespace edits
change the source identity. Baseline immutability and operation reuse must be
enforced by the later server; checksums alone do not enforce either rule.

The snapshot is a compatibility cache of the whole public migrated logical
state. Hydration verifies the baseline and snapshot separately and compares the
entire cache with the public migration of the immutable baseline. It rejects a
changed card, review, cash value, frozen case or any other changed field rather
than accepting competing authorities. There is no review replay by this codec.
Original source values survive in the baseline even where a public migration
changes their runtime projection. Version 1's existing domain migration rebuilds
cards/reviews from available intents: these projections are explicitly marked
`domain-v1-reconstruction-not-observed-evidence`, never promoted to observed
history. Every import has zero historical question-count credit.

`codecOwnership.ts` exhaustively maps `GameState`, `LocalCampaignRecord` and
`LocalPrototypeProfile` keys at compile time. Nested overrides identify frozen
episodes/choices, scored answers, immutable reviews, money views and inspection
reports; other descendants inherit their operational parent. This is the
normalized ownership contract, not an assertion that relational export exists:

| Canonical owner after evidence export | Identity and reconciliation |
| --- | --- |
| Campaign metadata/pins | Owned campaign ID, seed, clinical/balance/randomness/scheduler pins, lifecycle/name and campaign tutorial state. Copy only that campaign's guidance, dismissal, acknowledgments and temporary tutorial pause. |
| Frozen episodes/scored decisions | Existing encounter/discussion ID, exact frozen content and choice order; existing decision/review identities. Preserve available originals; never rebuild retired frozen cases from today's release. |
| Immutable reviews | Owned campaign + existing review ID, concept/episode/node/variant/choice references, review time and scheduler log. Review intent views are not a second review or count source. |
| Mutable card projection | Owned campaign + concept ID, supplied current card with the exact version pins and time representation. Reconcile with the same transaction's evidence; do not reschedule on load. |
| Money evidence | Opening baseline balance plus complete subsequent exact ledger deltas; reconcile cash cents, operating accrual/posting and expense projections. Settlements, income/operation receipts, events and retired totals alone are incomplete. |
| Inspection evidence | Existing run ID and exact frozen attempt/report versions. Latest/best/first reports are projections, not an attempt history. |
| Operational snapshot | All remaining facility, actor, queue, work, reservation, clock, seed/RNG-input and counter state, including retired summaries needed for runtime rules. |
| Device/account-local state | Selected campaign, naming counter, default tutorial setting, camera/layout and the existing opaque usage outbox. The codec does not ingest these. Existing Beta 1 receipt IDs remain in their existing deduplication path. |

## Hash and load boundary

Request snapshot and baseline hashes cover their exact UTF-8 JSON text. The
request digest covers every field of `CloudBaselineImportRequest`, including
protocol, operation ID, zero expected revision, campaign ID, both texts and
their hashes. Adding material RPC/lease/lifecycle/usage arguments requires an
extended/versioned complete-request contract; this digest cannot acknowledge
arguments outside it. Authentication ownership must come from `auth.uid()`.

B2.2 must verify request bytes, parse/store one JSONB value per record and compute
an independent stored hash from `convert_to(payload::text, 'UTF8')`. A load returns
that exact text/hash/byte count. `loadCloudBaselineImport` verifies both stored
texts before parsing, checks requested campaign/baseline/revision, then validates
the public-domain migration and full logical equality. Revisions are decimal
strings through PostgreSQL bigint maximum; they never pass through JS Number.
No second full stored text copy is required. Client validation is not a SQL
structural validator, authorization, consent, quota reservation or clinical
approval.

The JSON boundary rejects duplicate decoded keys, unsafe/rounded numbers,
negative zero, NUL and unpaired surrogates. It retains distinct Unicode and
compares numeric value rather than exponent spelling/decimal scale. Engineering
processing bounds are 6,000,000 text bytes, depth 64, 300,000 value nodes, 50,000
entries/collection and 262,144 bytes/string. Campaign/operation IDs and topic IDs
are bounded at 256 UTF-8 bytes; campaign names at 160. No field is truncated.
Existing local sources outside these bounds stay untouched/exportable and need
an explicit eligibility result in the later import UI.

Four pinned JS/SQL golden vectors cover UTF-8 key order, composed/decomposed
Unicode, astral characters, escapes, whitespace, safe integer extremes,
fractional precision, expanded exponents and the smallest positive JS number.
The rollback-only SQL file uses built-in `sha256(bytea)`, requiring no pgcrypto.
**SQL has not run**: no psql command was available and this brief prohibited
database/network access. The unit-test reordering helper is deliberately labeled
a transport perturbation, not a PostgreSQL oracle. B2.2 must run
`apps/player/src/session/cloud/codecGoldenVectors.sql` on its approved disposable
PostgreSQL instance and supply the actual output before this SQL gate passes.

## Measurements and blocked work

All 11 plan checkpoints are compared in full, alongside existing pre-M9 Level
0-4 fixtures across schemas 5-9 and their next-120-minute states, synthetic
compatibility schemas 1-9, fresh levels 0-5, a recorded v1 review-intent case and
the concurrent domain worker's serialized garden/offsite regression fixture.
The legacy-behavior file contains states, not merely hash receipts. No fixture
was edited. Current source receipts and all measurements are in the plan's
**B2.1 handoff**. The integration fixture has changed since planning; the new
largest compact source is 1,828,472 bytes.

No compression is used. At the largest checkpoint, migrated game = **1,828,398**
bytes, snapshot envelope = **1,828,970**, immutable baseline = **1,828,965** and
the whole B2.1 request body = **4,003,116**. All plan snapshots fit the 2 MB target
and 3 MB ceiling, and all B2.1 bodies fit 6 MB. **Eight of 11 baselines exceed the
1 MB/campaign evidence allowance**. The largest repeated two-campaign account
would use 3,657,930 baseline bytes alone, exceeding the 2 MB/account evidence
budget. Count the duplication; this is an explicit capacity failure. Reordered
test text measures 1,945,481 snapshot / 1,945,462 baseline bytes at that checkpoint,
but is not physical PostgreSQL capacity evidence. B2.2 must remeasure actual RPC
wrappers/digests/escaping and canonical stored bytes; B2.5 owns physical DB,
retained/prior copies, transient reservations and transfer measurements.

**Domain gap: live evidence export is stopped.** Public serialization contains
bounded views: encounter retirement removes frozen cases; service retirement
reduces records to totals; reducer event/receipt histories are bounded; inspection
state keeps latest/best/first and current-run views. Serializing or diffing two
checkpoints cannot recover all intervening facts or replace a complete money
ledger. There is no public complete, ordered pre-retirement evidence-delta
contract to consume. This lane deliberately adds no live checkpoint encoder,
delta fabricator, relational exporter or history replay.

Next action for the manager: after the Level 5 worker hands back, assign an
explicit domain lane for complete pre-retirement evidence capture/export with
stable identities and exact money/card reconciliation. Then assign the codec's
new live-evidence mode/version and remeasure a lossless representation against
the approved budget. Do not enable the baseline-only codec as cloud gameplay.

## B2.1b amendment: separate evidence and verified compression

The preceding B2.1 limitation describes historical format 1. New work uses
**cloud format 2**, domain evidence version 1 and request protocol 2. Format 1
remains for compatibility and its original golden/round-trip tests.

### Public domain boundary

`createGameEvidenceCheckpoint`, `importGameEvidence`, `exportGameEvidence`,
`restoreGameEvidenceImportSource` and `applyGameEvidenceCommand` are exported from
game-domain. No persisted `GameState` field, serializer or deserializer changed.
The command wrapper is opt-in; existing local/prototype callers still use the
ordinary reducer. It returns the actual reducer state, a separate checkpoint
and only the newly appended immutable records for an atomic future save.

The immutable archive owns the complete original import source with evidence
references, historical limitations, opening finance/learning and version pins,
plus a dense append-only fact dictionary. Exact duplicate facts share a record.
Frozen cases, identities/decisions, answers, reviews, versioned card values,
review intents, income/settlement records, receipts/events and inspection
evidence live there. A current card is a mutable reference to an immutable card
version; two concepts can share identical card bytes without sharing mutable
history. No FSRS review is replayed to hydrate a snapshot.

Each operational snapshot contains a version, campaign ID, game schema, current
operational patches relative to the immutable import source, and a transition
cursor. Patches preserve complete state and ordered arrays without event replay;
immutable fields contain references rather than copied payloads. Original import
data remains recoverable even after the current facility diverges and retires
records. Version 1 reconstructed review projections retain their explicit
provenance, and baseline history never mints question-count credit.

A small synchronous observation scope captures facts before encounter/service/
retail retirement and before event/operation-receipt trimming. It cannot be
installed by the ordinary persistence path and is cleared in `finally`. Terminal
records survive removal from live state. Inspection preparations, reports and
ended attempts survive later latest/best/first projections. The evidence journal
records the supplied command, observed before/after finance and an exact integer
cent delta, with a previous-entry link. It does not invent itemized historical
transactions. Hydration reconciles finance, full review/card projections and
immutable seed/version pins. Operation IDs are checked beyond the runtime's
bounded receipt view, and changed reuse rejects.

The only existing hashed domain inputs edited are **`reducer.ts`** (read-only
opt-in observations) and **`index.ts`** (public export). New modules contain the
implementation. `persistence.ts` is untouched. The manager must rebind the Level
5 recorded-input evidence after reviewing these additions; this worker does not.

### Compression and storage recommendation

`codecCompression.ts` uses browser-native `CompressionStream` and
`DecompressionStream` for gzip and deflate, with no installed dependency. Every
emitted compressed value is immediately decoded and SHA-256 checked against its
**uncompressed canonical UTF-8 bytes**. Loads verify those same bytes before
JSON parsing. Compressed output is not a stable cross-browser identity. Decoding
enforces declared and actual streamed byte counts, UTF-8, per-value and aggregate
6 MB bounds; reference expansion also has depth/node/text bounds. Missing APIs,
invalid base64, corrupt streams, false size headers and wrong hashes fail closed.

Format 2 packs the immutable import header separately from immutable rows.
Acknowledged saves send the header hash and only rows after the accepted
high-water mark. A prior snapshot hydrates from its exact immutable prefix;
neither a second evidence copy nor a full history upload is needed for it.
The current row transport is implemented and tested; it is not wired into play.

Measurements distinguish raw JSON, each separately gzipped/deflated row, and
whole-archive gzip/deflate. Whole-archive compression is useful for downloads but
cannot be counted as the cost of individually stored rows. Individual gzip rows
pass the imported fixtures, but continued play demonstrates that their repeated
headers/keys can exhaust the 1 MB evidence allowance.

**Recommended physical candidate: immutable sealed gzip pages in `bytea`, with
normalized ownership/identity metadata and a bounded trusted inflater/validator.**
`codecEvidencePages.ts` evaluates this candidate losslessly at a 64,000-byte
decoded page target. A larger individual fact gets its own bounded page. An
accepted partial page is sealed permanently; later saves append new pages and
never refill or rewrite it. Records keep their exact logical IDs/order, and
each canonical fact appears in exactly one page. Tests measure both encodings
and retain original sealed pages across six successive growth batches. This
candidate is separate from the existing row transport and is not an applied
database schema, deployed ingress or player coordinator.

PostgreSQL TOAST can compress large `jsonb`/`bytea` values, but short separately
normalized rows may not benefit. A `jsonb` + server TOAST/lz4 design keeps direct
SQL structural validation and indexing simpler; actual lz4 availability, column
settings, physical compression and overhead must be checked on the chosen
server. Client gzip gives reproducible measured payload/egress savings and can
compress across adjacent immutable records in pages. Already compressed gzip
bytes should not be budgeted for a second assumed TOAST saving. Base64 adds
transport overhead, which the body measurements include; `bytea`'s hex text
representation can cost more. Binary storage size is not wire JSON size.
RPC replies must use the agreed unwrapped base64 representation for the strict
decoder; a bytea hex representation or wrapped base64 is a different wire format.

Core PostgreSQL JSONB/TOAST does not itself establish a validated client-gzip
ingress. B2.2 needs a tested bounded trusted decompression route before it can
parse/check canonical content, hashes, sizes, pins, identities, evidence appends,
RLS and atomic money/card/count writes. Passing client hashes alone is
insufficient. If that route is unavailable, validated JSONB/TOAST remains an
alternative, but the uncompressed evidence allowance still needs resolution.

The plan's **B2.1b handoff** records the final exact sizes, six-hour growth result
and validation output. Compressed/page byte counts include payload metadata but
are not measurements of tuple/FK/index/TOAST/dead-row or backup/restore cost.
The 500 MB provider limit, 400 MB working ceiling and 50 MB shared-overhead
allowance are not changed. B2.5 still must measure physical steady/peak storage,
real ingress/egress and realistic long play. History remains unbounded: no finite
compression ratio promises indefinite free play or authorizes dropping evidence.
The continuation fixture runs 360 facility minutes (six simulated facility
hours), not six wall-clock hours of player activity. Its row/page comparison is
a growth sample, not the longer-play or physical-device acceptance required by
B2.5.
