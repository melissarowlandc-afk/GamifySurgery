# Beta 2: cross-device cloud saves - ExecPlan (2026-10-17)

Status: **planning only; proposed implementation and limits await manager review**.
Manager: Claude Code thread "GamifySurgery manager". Planning worker: GPT-6.1
Sol, max. This worker's only output is this document. No code, fixtures, existing
plans, handoff, configuration, database, browser storage or opening pathway was
changed. No Git commands, installations, network calls, agents or external
messages were used. Repository branch/dirty status and hosted state were not
independently verified; the tree is shared with clinical-content/game-domain
workers. Proposed lanes below are future assignments, not dispatched work.

## Goal and authority

The owner's request is: **"I would like the computer and phone saves and
campaigns to cross over."** An invited player should sign into the same account
on desktop or phone, select the same named campaign, and continue from its last
confirmed account save without losing another session's progress.

Read together with these binding records:

- [Accounts/playtime release plan](accounts-playtime-release-20261012.md),
  sections 2 and 5, the 2026-10-13 binding decisions and later Beta 1-first
  override: Beta 1 is live with local campaigns; Beta 2 adds explicit local
  import and safe cloud campaigns; automatic flag triage comes later.
- [ADR 0011](../adr/0011-versioned-hybrid-saves.md),
  [ADR 0017](../adr/0017-browser-authoritative-facility-simulation.md) and
  [ADR 0019](../adr/0019-hybrid-relational-and-jsonb-storage.md): versioned
  operational snapshots, immutable evidence, expected revisions, one fenced
  writer per campaign, explicit takeover, brief connection-loss recovery, no
  automatic merge or last-write-wins, browser-computed facility transitions.
- [ADR 0036](../adr/0036-multiple-resumable-clinics-and-staged-auth-shell.md):
  several resumable campaigns, separate selected campaign, recoverable archive,
  campaign-scoped FSRS, names unique across resumable and archived campaigns.
- [AGENTS.md](../../AGENTS.md), [privacy boundaries](../../SECURITY_AND_PRIVACY.md)
  and the later owner decisions in the accounts plan: preserve owner saves,
  keep clinical material `needs_clinician_review`, invite-only existing Auth,
  count-only owner reporting, no PHI, fingerprints or gameplay research.

The later decisions also retain the existing setup-link/password flow and the
manager's standing authority to publish tested updates. This plan does not
reopen login, introduce SMTP, request per-update approval, authorize a purchase
or execute a release. The manager settles the new design/budget choices below
with the owner before implementation and applies the standing release policy.

## 1. Current save model and measured sizes

### Live persistence

| Area / source | Observed behavior and implication |
| --- | --- |
| `apps/player/src/session/prototypeStorage.ts` | Profile schema **2**, stored under `gamify-surgery.prototype.profile.v1`; the historical single-save key is `gamify-surgery.prototype.save.v1`. A profile contains an array of named campaigns, selected campaign ID, naming counter, tutorial default and per-campaign guidance/dismissal/acknowledgment state. Signed-in profiles may also stage opaque pending question-count receipts. |
| `LocalCampaignRecord` | Stable string campaign ID (for example `campaign.local.<token>`, **not necessarily a UUID**), name, local creation/update milliseconds, `resumable` or `archived`, and complete `GameState`. There is no application campaign-count or serialized-byte ceiling in this local path; browser quota can fail a whole-profile write. |
| `savePrototypeProfileResult` | Serializes every campaign using `serializeGameState`, stores that JSON as a **string inside profile JSON**, then calls synchronous `localStorage.setItem` for the whole profile. Success is a local write result, not a server receipt or independently verified readback. String escaping increases the outer profile size. Failure reports character count, which is not UTF-8 bytes or guaranteed browser quota consumption. |
| `accountStorageKey.ts`, `accountStorage.test.ts` | A signed-in account uses `<base>.account.<encoded account ID>`; `null` retains the historical unowned key. Account A, account B and prototype campaigns stay separate. Sign-in does not claim the unowned profile or historical single save. Auth context remounts account-owned UI; departing writers retain their original account scope. |
| `prototypeAutosave.ts`, `usePrototypeSession.ts` | Meaningful commands save locally; facility ticks are coalesced every 15 facility ticks with idle scheduling. Visibility loss pauses; `pagehide` flushes local state. Client `updatedAtRealMs` is a display/local timestamp, **not a conflict revision**. Existing writes do not coordinate two devices. |
| `App.tsx`, `PrototypeShell.tsx`, `AppShell.tsx`, `mobile/MobileShell.tsx` | Shared session and local account profile feed desktop and phone shells. Campaign creation, selection, restart/archive and restore also write directly from entry/lifecycle paths. These must join the cloud coordinator; changing only the in-game autosave misses them. |
| `localCampaignRepository.ts` | An existing **unused by the live App/session** IndexedDB repository has global database `gamify-surgery.local.v1`, one `profile` key, campaign/revision stores, expected revisions, SHA-256, UTF-8 sizes, post-commit verification and recovery from **two prior local revisions**. It is exported, not an active cloud/account cache. Its global profile namespace and metadata must be adapted; pending usage staging is not part of its stored profile contract. |
| `facilityCameraPreference.ts` | Campaign-keyed camera settings are separate origin-local presentation data. Keep camera, layout and last-selected campaign per device; they should not move the desktop viewport onto the phone. Campaign tutorial progress should travel with its campaign. |

`packages/game-domain/src/persistence.ts:113` currently implements
`serializeGameState` as `JSON.stringify(state)`. `deserializeGameState` accepts
versions 1-9, applies compatibility/normalization and returns schema 9; an
unknown version throws. This is not yet a separate cloud envelope or an
immutable-evidence codec. Some existing readers normalize or bound collections;
do not infer byte-for-byte identity or complete audit retention from a
successful load. Prove intended logical fidelity and record allowed migrations.

The state includes facility/room/employee/task/queue/clock data; founder and
generated identities; frozen clinical encounters and displayed answer order;
campaign seed, randomness contract/state/counters; clinical/balance/scheduler
pins; FSRS cards and reviews; cash/accruals, settlements/income and operation
receipts; event/review intents, retired-history summaries and inspection/Level 5
state. Archives keep their state. Opening another campaign does not transfer
FSRS history, and restart creates a new campaign while archiving the previous
one. Local multiple-campaign support must survive cloud adoption, even where
only a bounded subset is enrolled in cloud storage.

### Read-only fixture measurement on 2026-10-17

Only repository synthetic fixtures were measured; no owner browser saves,
private inputs or live player data were read. The measurement was
`Buffer.byteLength(JSON.stringify(parsedState), "utf8")`, exactly the current
serializer body applied to the stored fixture object, **without loading or
normalizing it through the current deserializer**. Decimal MB = 1,000,000 bytes.

| Fixture / checkpoint | Facility level | Compact serialized state bytes | MB |
| --- | ---: | ---: | ---: |
| `level-four-legacy-pre-m3.json` | 3 | 130,872 | 0.131 |
| Integration `integration-l4` | 4 | 795,214 | 0.795 |
| Integration `integration-build` | 5 | 803,955 | 0.804 |
| Integration `integration-preparing` | 5 | 1,366,094 | 1.366 |
| Integration `integration-running` | 5 | 1,408,713 | 1.409 |
| `level-five-economy-checkpoint-20261012.json` | 5 | 1,429,974 | 1.430 |
| Integration `integration-final` | 5 | 1,602,257 | 1.602 |
| Integration `integration-finish` | 5 | 1,587,292 | 1.587 |
| Integration `integration-repeat-final` | 5 | 1,730,730 | 1.731 |
| Integration `integration-repeat` | 5 | 1,631,468 | 1.631 |
| Integration `integration-lower-repeat` | 5 | **1,807,484** | **1.807** |

Integration rows are the nine states in
`tests/fixtures/level-five-integration-checkpoints-20261012.json`, not nine
campaigns to upload together. Its 12,733,417-byte file is a container, not one
save. The nine-state median is **1,587,292 bytes (1.587 MB)**; advanced fixture
play is commonly about **1.4-1.8 MB**. This is a fixture-based planning baseline,
not a measured player median. The **largest observed snapshot is 1,807,484
bytes; the true application maximum is unbounded by the serializer**. Continuing
after the final inspection can grow histories further. Early-level/fresh,
migrated, pathological and prolonged-play coverage remains B2.1/B2.5 work.

At that largest checkpoint, `learningHistories` alone is 520,406 bytes;
`encounters` 213,843; `reviewIntents` 185,655; `events` 167,016; and
`settlements` 145,493. `JSON.stringify(serializedState)` is **1,978,098 bytes**
before the rest of the profile wrapper, showing the current nested-string
overhead. Two equivalent campaigns need roughly twice that plus metadata.
Browser quotas and PostgreSQL JSONB/TOAST/index storage are different measures.
Do not extrapolate gzip sizes into database capacity.

Fixture SHA-256 receipts (the shared tree can change; remeasure before coding):

| File under `tests/fixtures/` | SHA-256 of file bytes |
| --- | --- |
| `level-four-legacy-pre-m3.json` | `9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3` |
| `level-five-economy-checkpoint-20261012.json` | `813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582` |
| `level-five-integration-checkpoints-20261012.json` | `3baf8e3d564893d432ca8a2e86c0093648b8ae804c94af922deab0047a2f28dd` |

Reproduce from the repository root with existing Node; no files are written:

```powershell
@'
const fs = require('node:fs');
const dir = 'tests/fixtures/';
for (const file of ['level-four-legacy-pre-m3.json',
  'level-five-economy-checkpoint-20261012.json',
  'level-five-integration-checkpoints-20261012.json']) {
  const value = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
  const states = value.schemaVersion ? [[file, value]] : Object.entries(value);
  for (const [name, state] of states) {
    const serialized = JSON.stringify(state);
    console.log(name, Buffer.byteLength(serialized, 'utf8'));
  }
}
'@ | node
```

The older accounts plan recorded slightly different integration sizes before
subsequent fixture updates. The receipts above describe this inspection; the
planning worker did not regenerate or edit those fixtures.

## 2. Goals and non-goals

Goals: account-owned, multiple named campaigns available from desktop and phone;
automatic verified checkpoints; safe handoff with a desktop tab left open;
explicit, retryable import of selected existing local campaigns; faithful
versioned game/learning/evidence recovery; owner-only player access; bounded
storage/requests; honest status, updated consent and complete deletion coverage.

Non-goals: unrestricted offline play; simultaneous writers or merging progress
within one campaign; a server that runs facilities; background/closed-tab
catch-up; anti-cheat, leaderboards or research analytics; sharing campaigns
between accounts; a new auth provider; moving all device preferences; importing
historical local question flags; changing clinical content, clinical approval,
concept IDs, game balance or FSRS meaning; enabling hosted auth on the owner's
prototype; provisioning, purchases or release execution in this planning task.

## 3. Sync choices and recommendation

| Option | Advantages | Offline / two-device consequences | Fit |
| --- | --- | --- | --- |
| **(a) Explicit Upload campaign / Download campaign** | Clear deliberate transfer, lower request volume, useful checked export/import recovery path. | Both devices can diverge between button presses. Upload still needs expected revision, identity/version checks and a conflict screen. Download must preserve unsent local work before replacing it. Manual habits determine freshness; a forgotten upload strands phone progress. | Useful recovery/import tools, insufficient as the main cross-device experience. Does not by itself meet the accepted single-writer design. |
| **(b) Automatic saves, last-write-wins per campaign plus a conflict prompt** | Smooth when only one device plays; smaller change than server simulation. | Long offline branches, skewed client clocks and an idle desktop's autosave can overwrite real phone progress. A prompt shown after replacement is too late. `updated_at` alone cannot prove both writers shared a base. | **Literal last-write-wins is prohibited** by ADR 0011 and the binding owner decision. Preserve the automatic UX, replace overwrite rules with transactional expected revisions and a fenced writer. |
| **(c) Server-authoritative simulation** | Server executes/validates each transition; stronger integrity and a single execution authority. | Requires an online command protocol, server runtime, latency handling and much larger migration/operations work; offline actions still need an explicit product design. | Not justified for this noncompetitive invited beta; reverses ADR 0017 and requires a new owner architecture decision. |

**Recommend automatic account checkpoints with optimistic revision checks,
one fenced writer per campaign, explicit takeover and conflict recovery.** This
provides option (b)'s convenient saving without its last-write-wins rule and
implements the already accepted direction. The browser computes game state;
the latest **server-accepted revision** is authoritative for continuation.
Manual export/import remains a recovery facility, not the ordinary handoff.

### Revision and writer protocol

Use a monotonic server `revision bigint` per campaign and a separate monotonic
`writer_generation`. Every state/lifecycle write names its exact base revision,
writer token/generation and unique operation ID. The server locks the campaign,
checks fresh account admission, consent, lease and revision, then accepts all
snapshot/evidence changes atomically or rejects all. A client cannot choose the
next revision. `updated_at` is generated by the server for human-readable status
and list freshness; never select a winner using client wall clocks, facility
ticks or timestamp comparison. Concurrent compare-and-swap rejects a stale
write even if its timestamp is newer. A fencing generation rejects an old
writer after takeover even when no later snapshot has yet been saved.

Starting engineering defaults, inherited from the prior plan and to be tested:
60-second lease, renewal every 15 seconds, ordinary dirty checkpoint every
60 seconds, and an early coalesced checkpoint after scored answers, important
purchases, pause/mode exit, campaign switch and Save & Close. Do not upload on
each tick, frame or localStorage autosave. Clean/read-only tabs never upload a
snapshot or automatically take a lease. One writer **per campaign** permits
different campaigns on different devices; it does not merge their histories.

Load only campaign summaries on sign-in, then the selected campaign's current
snapshot and required evidence. Verify/hydrate before acquiring a writer against
that revision. Acquisition/takeover must return the accepted revision; if it
changed during the fetch, refetch before enabling commands. Poll small metadata
on focus and at a bounded interval while waiting; Realtime is optional for quick
revocation notices and is never the safety mechanism. Never poll whole saves.

### A phone plays while the desktop tab remains open

If desktop holds a valid lease, phone opens a read-only view:
"This campaign is open somewhere else. Continue here? Only progress saved to
your account can move here." **Continue on this device** atomically advances
the generation, revokes the desktop token and grants the phone a new token.
The phone loads/verifies the latest accepted state before playing. **Not now**
leaves it read-only. Do not silently revoke a live lease merely by opening a tab.

Desktop learns revocation on its next save/renewal or focus check, pauses
commands and ticks, and keeps unsent bytes: "You continued on another device.
Recent changes here have not replaced your account save." It may continue to
compute briefly before detection, but those writes cannot commit; the phone
warning must not promise immediate remote suspension. A hidden desktop already
pauses under the current lifecycle rule. On return it must revalidate before
Resume, not push its cached paused state. A visible but unattended tab can
retain its lease until an explicit takeover; it cannot block a phone indefinitely.

Save & Close pauses, awaits a confirmed checkpoint, then releases the lease
with the same generation. A delayed release from an old generation cannot
release the new phone writer. Lease expiry after a crash allows a new writer
to load the latest account save; expiry never authorizes stale queued work.

### Offline, lost responses and refresh

This remains an online-required campaign. A detected connection loss, failed
save or failed renewal starts a **30-second maximum grace**, also capped by
the conservatively calculated remaining server-confirmed lease validity.
Pause immediately if the lease is uncertain/expired, local durability fails or
the pending-size limit is reached. Stop all state-changing commands as well as
ticks; pause is not only an animation overlay. Viewing status, retry, export,
sign-in and deletion controls remains available. No offline sign-in or fresh
cloud campaign load, hidden-time progression or automatic catch-up.

Keep the last acknowledged account state and one bounded recovery record per
open campaign in account-scoped IndexedDB. That record contains an immutable
in-flight request/operation ID plus at most one coalesced following state and
new evidence tail. Preserve it across refresh; never mutate/reuse an in-flight
ID for different bytes. Proposed total cap: **7 MB** (up to 3 MB in-flight state,
3 MB following state and 1 MB evidence/receipts), separate from the confirmed
cache. Measure actual recovery-envelope bytes; escaping/metadata also count
toward the total. It is a bound, not seven MB promised by every browser.

Retry/query the identical operation after a lost acknowledgment before creating
a new write. A successful receipt acknowledges exactly the covered work, not a
newer coalesced candidate. Rebase the following candidate onto that receipt
without re-running answers or purchases. On reconnect, refresh admission and
server state first. An expired lease can be reacquired only if the base remains
unchanged; a new lease cannot bless a stale branch. Clock jumps, sleep and slow
responses must not extend grace or lease validity. Explicit Resume follows a
successful recovery; no surprise unpause.

If the server revision or generation has advanced, preserve local recovery and
offer **Use account save**, **Keep a recovery copy**, or **Not now** (paused).
Show campaign name/level and last confirmed time, plus "changes waiting here";
put revision details behind diagnostics. Never offer a destructive one-click
"force overwrite". Recovery as a separate campaign requires explicit naming,
quota and verified internal-reference migration; until that exists, retain or
download a checked recovery file. No merge of cash, FSRS, answers or patients.

## 4. Capacity for about 30 players

Use the requested **500 MB project database** as the planning limit. The accounts
plan's manager-verified 2026-10-13 facts also include **5 GB egress/month** and
possible Free-project inactivity pauses. No current provider terms, live usage
or physical storage were checked in this no-network task. Reconfirm limits and
available game-project space before enabling Beta 2; leave the ergonomics
project alone. No purchase is authorized.

Snapshots, evidence, Auth/app data, indexes, TOAST, retained/dead rows and other
Beta 1 tables share the project. A compression estimate is not a free-space
guarantee. Retain **current plus one verified prior cloud snapshot**, with
immutable evidence stored once and complete logical state reconstructed on
load. A full fidelity-preserving snapshot may temporarily duplicate evidence
for a first codec milestone, but that cost must be counted; a snapshot-only
implementation cannot silently drop the accepted immutable-evidence boundary.

For **two cloud campaigns/player, two snapshots/campaign**:

| Raw planning scenario | Per player snapshots | 30-player snapshots | Evidence allowance (1 MB/campaign) + other shared allowance (50 MB) | Planned total before measured variance |
| --- | ---: | ---: | ---: | ---: |
| Observed largest fixture, 1.807484 MB/copy | 7.230 MB | 216.898 MB | 60 + 50 MB | **326.898 MB** |
| Target 2 MB/copy | 8 MB | 240 MB | 60 + 50 MB | **350 MB** |
| Every copy at 3 MB acceptance ceiling | 12 MB | 360 MB | 60 + 50 MB | **470 MB** |

The 470 MB scenario leaves only 30 MB below the provider limit and exceeds the
prior plan's 400 MB working ceiling. **The earlier 25-player allowance cannot
simply be relabeled 30.** Evidence and the 50 MB shared allowance are hypotheses,
not measured maxima; old append-only financial/inspection history may need more.

Recommended starting policy, subject to B2.5 and owner question 1:

- Two enrolled cloud campaigns/account, counting resumable, archived and cloud
  recovery campaigns; additional existing campaigns remain local and intact.
  Archive/restart must disclose that an archive still occupies a cloud slot.
- Target <=2 MB per snapshot, hard candidate ceiling **3,000,000 bytes**;
  **8,000,000 aggregate retained snapshot bytes/account** and up to
  **2,000,000 immutable-evidence bytes/account**, with a 1 MB/campaign starting
  evidence allowance. These bounds include all enrolled campaigns, not per
  device. A 3 MB campaign can use six MB for current/prior; the other campaign
  has only the remaining snapshot budget. Never advertise two unrestricted
  3 MB campaigns under this policy.
- This reserves up to **10 MB/player, 300 MB for 30**, plus 50 MB for shared
  data/overhead = **350 MB**, leaving 50 MB below the **400 MB working ceiling**
  and a further 100 MB below the provider cap. Physical measurements may require
  stricter limits. Quotas must include metadata and all history rather than
  shifting data into an uncounted table.
- Warn on approaching per-account limits; owner operational alert at 300 MB
  actual database size. At 400 MB stop new enrollments/imports and optional
  growth. Every save needs a server-side reservation including new-copy,
  evidence, index and cleanup margin; pause existing play when safe commit
  capacity cannot be assured. Concurrent imports cannot each spend the same
  remaining space. Do not wait for provider read-only failure.

Do not truncate FSRS, accepted reviews, money records, frozen content or
inspection history to fit. Existing valid local saves over a proposed limit
remain local/exportable and clearly ineligible for enrollment, not "corrupt".
For a growing cloud campaign, warn early and preserve confirmed/pending state
if capacity is reached. Lossless normalization, revised limits after evidence,
or an owner-approved paid plan is the next step; silently removing a prior copy
or enabling unlimited local divergence is not a solution. Restart at the cloud
campaign limit must not destroy the archive; offer a new local campaign or an
explicit checked export/removal workflow only if separately implemented.

Measure `pg_database_size`, `pg_total_relation_size`, table/index/TOAST sizes,
dead tuples, cleanup/autovacuum behavior and peak transactional allocation via
the restricted owner route. Run repeated writes for hours with 30 synthetic
accounts and long/repeat-inspection fixtures, not just one insert. Demonstrate
both steady state and temporary third-copy/dead-row pressure. App-level JSON
bytes are a conservative allocation input, not a replacement for physical
measurements. If the evidence allowance or operating reserve fails, the Free
rollout does not pass merely because current fixtures fit.

Egress also matters: 30 players x one 2 MB download/day x 30 days = **1.8 GB**;
four 350 MB weekly exports = **1.4 GB**, total **3.2 GB** before overhead. Three
full downloads/player/day would instead total **6.8 GB with those exports**,
above the inherited 5 GB allowance. Desktop -> phone -> desktop is a realistic
source of extra opens. Measure real compressed transfer and evidence hydration,
cache by immutable hash/revision, download only the selected current campaign,
and return small write receipts. Do not assume compression, provider-pausing
avoidance or unlimited device switching; inadequate measured transfer is also
a capacity/plan gate. Do not create artificial keep-alive traffic.

## 5. Explicit migration and the owner's prototype

"First sign-in" here means the first cloud-capable session after Beta 2 is
enabled; existing Beta 1 players already have account-local campaigns. Do not
wait for a new registration and miss their saves.

1. Fetch account summaries after authentication and cloud-notice acceptance.
   Inspect only this account's local profile and any explicitly offered unowned
   legacy source **at this origin**. Never read another account's namespace.
   Preserve a raw source recovery copy before parsing/migrating; do not use the
   ordinary loader's fresh-profile fallback as permission to overwrite damage.
2. Show account and device-local lists separately, with names, levels, statuses,
   sizes and checkboxes. Offer **Copy selected local campaigns to my account**,
   **Use account campaigns**, and **Later**. Nothing uploads on sign-in alone.
   Copying unowned campaigns needs an explicit claim to the displayed account;
   existing account-local campaigns also require an explicit first enrollment.
3. Validate versions, IDs/references, pins, frozen content, FSRS/history,
   tutorial state, checksums and quota; show per-campaign eligibility. Imported
   local timestamps remain provenance, not cloud revisions or trusted dates.
4. Use a stable import operation/source digest per campaign. Create campaign,
   baseline evidence and initial snapshot in one transaction. Mark historical
   reviews as import baseline, never new answered-question counts. Preserve
   already minted Beta 1 count receipt IDs; finish them only through their
   existing deduplication path, without minting a second set from history.
5. Fetch and verify/hydrate the accepted cloud state, including logical round
   trip and identity/history comparison, before marking this campaign enrolled.
   Keep original local/legacy bytes; a marker is additive, not destructive.
   Partial multi-campaign success is reported individually and is retryable.
6. A proven identical import retry is a no-op; a later changed local branch is
   not. Same ID with different content, same normalized name with different ID,
   an existing newer cloud revision, oversize, unsupported or damaged data
   prompts a choice/rename or stays local. Never replace by name or ID match.
   Recovery copies need verified ID/reference migration and their own slot;
   preserving the original in-game ID is the normal import path.

During enrollment, freeze the selected source revision or pause it while a
checked snapshot is taken. Pending edits arriving during upload must remain
explicit pending work, not disappear behind an "import complete" marker.
Crash after server commit but before local marking must recover from the import
receipt. Do not automatically upload historical local flags, Auth credentials,
pending voluntary comments or unrelated browser keys with a campaign.

**Owner prototype: keep `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended persistent browser profile. Its prototype
mode has no account, makes no cloud-save calls and its campaigns stay local.**
`location.origin` there is `http://127.0.0.1:4173`. Pages cannot read that storage.
Do not configure local Auth, change launcher/host/port/profile, or claim that
enabling Beta 2 migrates the owner's existing local campaign.

For account campaigns, the intended cross-device opening path is the existing
**`https://melissarowlandc-afk.github.io/GamifySurgery/`** on both devices, with
the same invited account. Its `location.origin` is
`https://melissarowlandc-afk.github.io`; the `/GamifySurgery/` deployment path
must remain correct. Other origins/profiles keep separate local caches; only
deliberately authenticated builds using the same backend/account can share
accepted cloud data. The private phone prototype also remains separate.

An eventual owner-requested prototype-to-account copy should use an explicit
checked export at the canonical local origin and file import on Pages. This is
optional and not required for automatic Beta 1 account-local migration; it
must not silently enable an account on the prototype. Keep original local
bytes and stable IDs. Any future durable opening-path change belongs in the
manager's handoff before that task closes. Diagnose persistence with
`location.origin`, build/protocol version and account scope, without tokens or
full saves in support logs.

## 6. Schema, validated RPCs, RLS and privacy

### Logical schema sketch, not an executable migration

Use new additive migrations after the existing Beta 1 sequence. Do not alter
the historical SQL files or assume automatic Data API grants. Schema names are
proposals; the boundaries below are acceptance requirements.

| Record | Key fields and enforced contract |
| --- | --- |
| `public.campaigns` | PK `(owner_id uuid, campaign_id text)`, FK owner to Auth with deletion cascade; normalized unique campaign name per owner, resumable/archived status, immutable seed/version pins, increasing current revision/hash, server-created/updated times, import/restore provenance. Player reads own summaries only; lifecycle mutations through RPC. Store per-campaign tutorial/guidance metadata with campaign authority, not a competing global profile. |
| `public.campaign_snapshots` | PK `(owner_id, campaign_id, revision)`, composite FK to owned campaign; cloud envelope/codec version, game schema/version pins, validated operational `payload jsonb`, SHA-256, authoritative measured bytes, server accepted time and evidence high-water references. Retain current plus one verified prior; rows immutable while retained. Snapshot references exact frozen content/evidence versions. |
| Normalized campaign evidence | Owned composite campaign FK; immutable review/episode/scored-decision identities and frozen versions, current FSRS cards plus append-only reviews, auditable money/settlement records and inspection attempts. Unique evidence/operation IDs, parent revision and ordering. Each fact has one canonical owner; snapshots can cache totals only with reconciliation. Exact tables/field mapping are B2.1 deliverables under ADR 0019. |
| `gamify_private.campaign_writers` | One row per owned campaign: random opaque session token hash, generation, server expiry. Tokens are scoped to the account/campaign/session; no device name, hardware ID, fingerprint or user agent. Only fenced lease RPCs can update it. |
| `gamify_private.campaign_operations` | Owned campaign + operation ID, complete immutable request digest, expected/accepted revision and small result. Same ID/same request returns original receipt; changed reuse rejects. Bound ordinary receipts (proposed seven days), retaining import provenance/evidence dedup for campaign life. An expired unknown operation cannot be blindly replayed or mint new evidence. |
| Private cloud access/quota state | Separate account cloud-enabled capability, accepted cloud-notice version/time, protocol floor, size reservations and bounded rate counters. Reuse the existing membership/revocation/deletion authority and lock order; separate cloud consent from Beta 1 usage consent so rollout does not silently invalidate or expand it. No client-writable admission/role/quota fields. |

Cloud consent does not enable optional usage recording. The cloud guard reuses
the admission/deletion checks without requiring Beta 1 usage consent; only an
eligible count receipt under the player's existing usage acceptance can affect
the two-total report. Declining usage does not authorize counting indirectly
from uploaded learning history.

Use `auth.uid()` for ownership, not a browser-supplied owner ID. Enable RLS
before grants. Player SELECT policies require own `owner_id`, a live admitted
membership and appropriate cloud consent; child access also proves the owned
parent. Anonymous access and cross-player reads/writes are denied, even for a
guessed campaign/revision. Revoke direct INSERT/UPDATE/DELETE from players;
only constrained RPCs may mutate campaigns, snapshots or evidence. Neither a
usage-owner report role nor the question-flag reader gains campaign access.
Owner support/export is a separate restricted operational route, not a global
player-facing RLS exception.

Mirror the existing public **security-invoker wrapper -> private validated
helper** pattern. Private helpers that need definer rights use fixed empty
`search_path`, fully qualified objects and explicit authorization. Revoke
default/PUBLIC/anon EXECUTE, grant only named functions as needed, and keep
`gamify_private` out of exposed API schemas. Explicitly audit grants including
`service_role` and transitive validator execution; the Beta 1 owner-tool grant
fixes show why RLS alone or assumed defaults are insufficient. No owner secret
or database password goes into `VITE_*`, browser cache, a save or this document.

Fresh checks must use the latest setup-link rules: membership plus confirmed,
live, nonanonymous, nonbanned Auth identity admitted through provider invitation
**or the trusted `gamify_setup_admitted` app-metadata marker**. User-editable
metadata never admits a player. Check deletion/revocation at every read/write,
renewal, import and takeover, including with a stale valid-looking JWT.

### Save API and validation contract

Proposed small public RPC surface: get cloud capabilities/list summaries; load
one campaign/revision and required evidence; acquire/renew/release/take over
writer; save; import; archive/restore; query operation outcome. Archive/restore,
rename and restart obey revision/fencing rules too. Unsupported or retired
client protocols are rejected server-side; a frontend-only flag is insufficient.

For a save transaction, lock in a documented consistent order (membership,
account reservation, campaign/writer), then:

1. Require live admission, cloud consent/capability and a compatible protocol.
2. Check the full request digest against an existing operation receipt; identical
   retries return their original result even if the lease subsequently changed,
   but never bypass deletion/revocation. Reject conflicting ID reuse.
3. Validate writer token/generation and conservative server expiry, and compare
   `expected_revision` with current. No partial evidence or usage commit on
   revision/lease conflict. Serial transactions choose a winner, not timestamps.
4. Validate envelope/schema/pins/identity, JSON types, finite supported numeric
   ranges, nested collections/references, payload/evidence sizes, operation
   uniqueness and limits. Verify new evidence appends to the accepted baseline;
   reject removed/edited accepted reviews, money records or inspection evidence.
   Reconcile cash/cards/cached totals to canonical evidence as specified in the
   codec. SQL must perform real structural/basic-invariant checks; a client
   `deserializeGameState` call is not server validation or proof of gameplay.
5. Reserve capacity and atomically append evidence, write snapshot, advance
   revision, record any eligible opaque count receipt through **one existing
   deduplication path**, and store the save receipt. Imported history does not
   count. A Beta 2 scored transition must not be counted twice by both the
   local usage outbox and the cloud RPC; retain already issued Beta 1 IDs.
6. Commit and return only operation ID, accepted revision/hash/bytes/server time
   and relevant evidence high-water marks. Replace local confirmed state only
   for that receipt. Retire excess cloud snapshots only after the replacement
   and required prior are valid/durable; measure transient allocation.

Checksum proposal avoids comparing JS `JSON.stringify` to reordered JSONB:
send bounded UTF-8 payload text plus its request hash, have the server verify
and parse it into JSONB, and store **one** JSONB payload. The server computes a
separate stored hash over its canonical `payload::text` UTF-8 representation.
A load RPC returns that exact canonical text and stored hash; the client hashes
those bytes before parsing/hydration. Request digest covers every material
argument, including evidence and lifecycle metadata; do not confuse it with the
stored snapshot hash. Save receipts acknowledge the request digest as well as
the server hash. Golden vectors must prove Unicode, number precision, key order
and whitespace handling preserve logical state across JS/PostgreSQL. This is a
codec milestone gate, not a claim that the existing repository already supports
this protocol. Do not persist a second full text copy just to get a matching hash.

Proposed engineering limits (not clinical thresholds): <=3 MB decoded candidate
state, <=1 MB new evidence/recovery tail, and a **6 MB transport-body ceiling**
that includes JSON string escaping/metadata; cap collection counts/depth and
text lengths. Also enforce the 3 MB server-canonical snapshot ceiling and the
account aggregate budgets. Measure the real encoded body and reject before
expensive processing where the gateway permits; SQL checks cannot by themselves
stop an oversized request before HTTP parsing. Verify the actual hosted RPC
gateway limit with synthetic maximum-size requests; add a thin bounded ingress
only if direct RPC cannot satisfy the tested size/abuse contract. Never ship a
service secret or weaken authorization to get large saves through.

Initial rate proposals: <=6 newly accepted checkpoints/campaign/minute and <=12
per account/minute; <=30 total cloud mutation/lease calls/account/minute; <=6
full-snapshot loads/account/minute, with small metadata reads separately bounded.
Coalesce urgent bursts without dropping evidence. Use server-time counters and
membership/account locking, not client timers alone. Identical retries consume
request-abuse budget but no second snapshot/evidence allocation. Return retry
delay and preserve/possibly pause pending work; do not disguise throttling as
success. Validate the cadence with two campaigns, renewal, takeover, reconnect
and short bursts so quotas do not create routine false connection-loss pauses.

### Evidence fidelity before implementation acceptance

B2.1 must map every persisted field to operational state, canonical immutable
evidence, mutable card projection, campaign metadata or device-only preference.
Current retired encounters/service summaries and bounded event/receipt views
are **not a complete historical ledger**. Preserve all available imported data
as an immutable import baseline and mark its historical limitations; never
invent missing individual money/review/inspection events. Capture new evidence
before runtime retirement from cloud adoption onward. If current reducer
outputs cannot provide the required deltas, return that gap to the manager for
a separately owned domain lane rather than fabricate evidence or silently
weaken the ADR. Hydration must recreate the same supported full logical state,
not resolve old questions against today's mutable clinical release. No clinical
meaning, random stream, answer order or FSRS change is authorized by storage work.

### Notice, retention and delete-my-data

Before any enrollment/upload, show a versioned cloud notice explaining that
Supabase now stores the full functional campaign, including synthetic cases,
choices/learning history, facility and financial/inspection state. The owner's
routine usage report remains only total playtime and question counts; that must
not be misworded as "only counts are stored" after cloud saves. No clinical
research/analytics or bulk campaign access for the feedback pipeline. Publish
the verified region, access/support purpose and backup schedule in the notice.
Continue the no-real-patient-information and unapproved-clinical-content notices.

Cloud campaigns/evidence remain for account gameplay until explicitly removed
under the approved lifecycle or account deletion; **do not apply the 90-day
usage/feedback purge to campaigns or FSRS**. Ordinary operation/rate records
are bounded separately; deletion removes them too. Default sign-out preserves
account-scoped local recovery, with an explicit clear-this-device choice and
plain shared-device warning; no unconfirmed work is silently discarded.

The current Account menu says **Delete my usage data** and promises clinics
stay local. Beta 2 must provide a clearly scoped **Delete my data/account**
confirmation covering cloud campaigns and immutable evidence. Use a new
versioned full-deletion RPC with explicit scope/notice confirmation; do not
silently widen the destructive effect of the old usage-only endpoint behind
an old client's wording. For a cloud-enrolled account, the legacy endpoint
must reject with an update-required result and leave data intact until the
player uses the new confirmation. Non-enrolled Beta 1 accounts retain the
existing behavior. Test this mixed-client transition before rollout.

The full-deletion transaction extends the existing implementation pattern:
lock membership, set deletion blocker, invalidate writer generations, stop
queues and remove campaign snapshots, evidence/cards,
operations, reservations and cloud-consent data along with existing usage,
flags and feedback. Auth foreign-key cascades are a second deletion path, not
the entire procedure. Privileged deletion is the explicit exception to evidence
immutability; test both paths and that account B survives.

Once the request is confirmed, no stale/offline client may recreate rows or
restore notice/admission. If the request cannot reach the service, say deletion
is **not confirmed**, stop local uploads and let the player retry. Preserve the
existing owner administration/support completion target of seven days for
remaining Auth/invitation/private export cleanup; update the owner tool/runbook
so it cannot omit new cloud tables. Offer removal of only this account's local
cache/recovery/pending queues at this origin; never erase another account or
unowned prototype. Explain that other offline browser copies cannot be remotely
erased and must be cleared there. A minimal protected deletion ledger must
outlive the backup retention window so restoring a backup cannot resurrect a
deleted account; disclose its limited purpose/retention and remove unnecessary
identity details. No public logs or save payloads in error analytics.

## 7. Client work in both shells

Use one account-scoped coordinator above entry and both shells, not two sync
implementations. Extend the shared session/shell contract with asynchronous
save state and actions; the current synchronous `PrototypeSaveResult` and
"Safe to close" UI cannot imply a network acknowledgment. Prototype mode keeps
its existing local behavior and explicit **Local only** label.

| State | Player-facing behavior on desktop and phone |
| --- | --- |
| Checking account save / loading | Disable state-changing play until admission, version, snapshot and writer status are known; offer retry, no blank fresh replacement. |
| Saved to account | Persistent compact status plus last confirmed time; details identify campaign and separate local recovery from account confirmation. Announce meaningful changes accessibly without every heartbeat. |
| Saving / recent changes waiting | Clear pending status. Save & Close waits for confirmed checkpoint and lease release; local persistence alone says "Saved on this device; account save waiting." |
| Open elsewhere / takeover | Same explicit Continue here / Not now dialog and warning in both shells. Read-only cannot execute purchases, answers, restart, archive or Resume. |
| Offline / unavailable provider | Explain local recovery, pause by grace/lease rule and offer Retry; login expiry offers sign-in as the same account. Do not turn a failed request into a new empty campaign. |
| Newer save / lost writer | Pause and present account-save, recovery-copy and Not now choices. Preserve both branches until a verified choice. |
| Quota, storage blocked/full, throttled | Distinguish account capacity, browser durability and temporary rate failures. Preserve confirmed/pending data, give actionable retry/export/contact-owner state; no misleading cloud checkmark. |
| Unsupported/corrupt save / old client | Preserve bytes, offer update/recovery and owner support; never overwrite with fresh state or automatically restore a prior revision. |
| Revoked/deletion-requested | Immediately stop commands/uploads/renewal, invalidate in-memory ownership and show blocked/deletion state. Delayed callbacks cannot write for another signed-in account. |

Show a compact always-visible status in desktop chrome and the phone header,
with details/retry in Account/Save and campaign cards labeled **Account** or
**This device only**. Reuse dialog wording/state across desktop campaign manager,
phone adapters, opening flow and restart/restore. Keyboard focus, screen-reader
status, touch targets, long names, narrow screens and no reliance on color are
acceptance requirements. Keep protocol tokens/revision machinery out of the
normal player journey; expose redacted technical details only for support.

Use a backend+account+campaign namespace in the new IndexedDB cache, verified
transactions/readback and cross-tab coordination (Web Locks/BroadcastChannel
when available); server fencing remains authoritative when those APIs are
missing. Keep original unowned IndexedDB/database/localStorage data untouched
until explicit checked migration; do not adopt the existing global repository
as-is. Bind in-flight work and callbacks to their originating account. Never
store Auth/service secrets in snapshot or pending payload records. Do not rely
on `pagehide`, `beforeunload`, fetch keepalive or mobile shutdown to deliver a
multi-MB final upload; checkpoint while active and provide Save & Close.

## 8. Validation, rollout and rollback

### Unit and integration coverage

- Codec: all saved fields/pins, frozen encounters and exact randomized choice
  order, FSRS cards/reviews/timezone, money reconciliation, inspection history,
  RNG stream states/counters and retired summaries; old schemas, unsupported
  future schemas, migrations, Unicode and numeric hash vectors. Property/fixture
  round trips compare logical fidelity, not a weakened shallow shape assertion.
- Cache/coordinator: A/B/prototype/backend isolation; metadata + usage staging
  atomicity; verified local writes; quota/security/blocked IndexedDB failures;
  crash before/after local commit and server commit; lost ack with an unchanged
  in-flight ID; one coalesced tail; 7 MB cap; clock jump/sleep; stale callback,
  rapid account/campaign changes; reauth and incompatible protocol. Assert
  commands/ticks are stopped when paused for sync, not just disabled buttons.
- Import/lifecycle: opt-in and decline; existing Beta 1 accounts; legacy source
  preservation; archive/restart/restore; identical retry vs changed source;
  ID/name collision; partial batch; oversize/invalid; import concurrent edits;
  historical count baseline and one count-only receipt path. Hash original
  storage bytes before/after declined or failed imports.
- Real disposable SQL/Data API: A/B/anon grants and RLS; guessed child IDs;
  direct-write and private-helper denial; setup and legacy admission; false
  user metadata; expired/banned/revoked/deleted identities; server clocks;
  size/rate/account and global capacity races; schema checks; evidence mutation
  rejection; identical/conflicting operation reuse; all-or-nothing snapshot,
  evidence and count. Use two actual DB sessions for save/takeover/renewal and
  deletion races, not sequential mocks labeled concurrency.
- Operational: maximum request bodies through the real ingress, physical DB
  growth over repeated saves/cleanup, 30-account/60-campaign load and peak
  reservations, transfer volume, read-only/full/unavailable project behavior,
  private backup and isolated restore, deletion replay and old-client rejection.

### Two-context Playwright and physical phone

Add `tests/e2e/cloud-saves.spec.ts` with independently authenticated browser
contexts (desktop and phone viewport) sharing **only the disposable backend**,
not localStorage or a manually copied latest save. Include a two-tab/same-profile
case separately. Run repeatable transport-fault tests plus real Data API tests;
mocked HTTP success is not hosted/RLS acceptance. Synthetic users only.

1. Desktop imports/plays/saves; phone signs into the same account, sees all
   enrolled campaigns and continues the correct state. Return to desktop after
   phone Save & Close; compare exact saved progress/history/cash/order, with no
   extra FSRS review, purchase or count.
2. Leave desktop visible and then hidden in separate cases. Phone takes over;
   desktop cannot save or release the phone's lease, and cannot Resume without
   a fresh check. Race two takeovers and simultaneous saves; one generation and
   expected revision win. Read-only open never takes over by itself.
3. `context.setOffline(true)`: short outage within grace, outage past expiry,
   refresh offline, desktop offline while phone advances, return without change,
   lost save response after commit, slow/out-of-order response, server unavailable
   while browser reports online. Assert bounded recovery and explicit conflict,
   preserved branches and no catch-up/replayed answers.
4. Account switch/sign-out during an upload, account B isolation, deletion while
   another context holds a lease/pending save, and reconnect of the old context.
   No resurrected cloud rows or cross-account UI/callback contamination.
5. Oversize/unsupported/corrupt saves, blocked local storage, rate/capacity limits,
   server-disabled feature and old client. Status and Save & Close wording must
   match what is actually durable on both shells.

The manager must also verify a physical phone browser's suspend/resume/tab-close,
touch dialogs and keyboard, and a real desktop -> phone -> desktop handoff.
Chromium phone emulation alone does not establish mobile background behavior.

Run browser/DB work only in a manager-approved disposable environment with
synthetic accounts, separate caches and exact recorded URL/origin. For local
QA prefer dedicated `http://127.0.0.1:5184` with its disposable browser profile;
it has separate storage and does not move owner 4173 saves. Do not start an
auth-configured QA server over the owner's canonical port, change a launcher or
use owner storage as a test fixture. The workers' unelevated sandbox may block
browser launch; the manager owns reruns in a capable environment.

### Rollout

1. Manager accepts owner choices, field/evidence contract and capacity gates.
   Schedule future domain work after current clinical/game-domain lanes hand
   back; inspect actual shared changes before assigning overlapping files.
2. Prepare additive SQL, tested client and private recovery/backup runbook;
   rehearse on disposable data. No live secret or real save in Git/artifacts.
   Freeze and identify tested app, protocol, migration and release versions.
3. Apply reviewed additive schema through the authorized owner/manager route,
   with cloud capability **off by default**. Confirm grants/RLS and revocation.
   New notice/opt-in precedes first functional save, not a blanket backfill.
4. Enable for the owner account using a synthetic or deliberately selected
   account-local campaign, then a small consenting tester cohort (proposed 2-3),
   then the remaining invited accounts up to about 30 after handoff/error and
   storage/transfer evidence passes. Do not enroll the owner prototype by default.
5. Give testers one plain opening instruction: use the existing Pages URL on
   both devices and the same account; copy selected local campaigns; wait for
   "Saved to account" or Save & Close before changing devices. Explain takeover,
   brief-offline pause, local-only extras and recovery/support. The owner sends
   any tester messages; this plan/worker sends none.
6. Monitor essential redacted failures, aggregate capacity/transfer and backup
   health, without campaign/answer analytics. The manager reviews actual diffs,
   full logs and SQL/browser evidence before acceptance. A validated checkpoint
   is local-only until an authorized audited GitHub backup; manager owns the
   **"push to GitHub"** reminder/checkpoint and release under existing authority.

### Backup, recovery and rollback

Recommended private **weekly logical export**, two generations expiring within
**14 days**, encrypted and outside the public repository, includes campaigns,
retained snapshots, canonical evidence, version manifests and ownership mapping.
It supplements the one prior cloud revision; neither protects progress since
the last successful export against total project loss. State that recovery
point explicitly. Confirm Auth recovery/identity mapping separately; a gameplay
export does not recreate passwords or Auth configuration. Restore into an
isolated disposable database and reconcile deletion records before access.

Corrupt/incompatible current state pauses writes and preserves bytes. A verified
prior snapshot can seed an explicit recovery campaign after quota/identity
checks; it must not erase later accepted immutable evidence. Same-campaign
recovery requires owner-reviewed evidence reconciliation and a **new higher
revision**, never a revision rewind. Later progress remains preserved for
diagnosis; historical reviews do not become new usage counts.

For a bad release, disable new cloud enrollments and use a server protocol/
capability gate to pause incompatible writes/renewals while preserving data and
local pending records. Keep read/export/recovery available when safe; tell
players account saving is unavailable. Publish a tested compatible client under
the manager's existing release authority. Do not destructively roll migrations
back, overwrite cloud saves from old caches, or claim an old Beta 1 local-only
artifact will seamlessly continue a newer cloud campaign. A backend capability
off state must be distinguishable from prototype/local mode, so it cannot
silently authorize divergent local play. Restore/rollback drills must prove
that deleted accounts are not reintroduced and old tokens cannot resume writes.

## 9. Bounded milestones, ownership and acceptance

Normally one write-capable Sol worker at a time. The manager assigns explicit
files after reviewing the shared tree, does planning/integration/acceptance and
records the durable handoff. Workers preserve concurrent work and do not spawn
agents, commit, push, publish, install or contact anyone without an express new
brief. No milestone below authorizes clinical edits or clinician approval.

| Milestone / future lane | Bounded ownership and deliverables | Validation and acceptance |
| --- | --- | --- |
| **B2.1 Codec and evidence contract** | New `apps/player/src/session/cloud/codec*` and focused tests; field/evidence mapping and measured envelope. Read domain/persistence by default. Manager assigns a separate explicit domain evidence-export lane only if audit finds gaps and current domain workers have handed back. Define baseline import, normalized evidence/card ownership, hash/load contract and cloud-format version. | Run focused player codec tests and workspace typecheck; domain tests only for any approved domain change. Golden JS/SQL vectors and full logical round trips for all measured fixtures/old schemas; complete field ownership, no invented history or lost frozen/FSRS/money/RNG state. Remeasured <=target/ceiling or explicit capacity failure. No server/client rollout. |
| **B2.2 Transactional server** | New uniquely named `supabase/migrations/*_beta2_cloud_saves.sql`, `supabase/tests/beta2_cloud_saves.sql` and test instructions. Account/campaign/snapshot/evidence/operation/lease/notice/quota schema, constrained RPCs, additive deletion extension and protocol gate. | Real disposable SQL and Data API assertions, two-session concurrency/crash tests; A/B/anon isolation, fixed grants/search paths, stale generation/revision denial, atomic evidence/count/save, compatible baseline consent, limits and deletion. All prior Beta 1 SQL tests still pass. Migration is reviewed before any live application. |
| **B2.3 Shared cache/sync coordinator** | New `apps/player/src/session/cloud/*` transport/coordinator/cache tests; explicitly scoped adaptation of `localCampaignRepository.ts`, account namespaces and `usePrototypeSession.ts`. No shell redesign. Bind lifecycle/commands, versioned cache, bounded pending state, idempotency, grace and fencing. | Focused cloud/session/account tests and typecheck; fake IndexedDB and fault-injected transport prove durable boundary, one frozen request/tail, caps, reauth/switch/expiry, no stale commits, no silent local fallback and no duplicate usage/evidence. Prototype fixture behavior and original local keys preserved. |
| **B2.4 Entry/import and both shells** | `App.tsx`, shared shell contract, `AppShell.tsx`, `mobile/MobileShell.tsx`, phone adapters, campaign/opening/save/account UI and focused CSS/tests; cloud migration UI/markers only in owned cloud modules. Versioned cloud notice and safe deletion/sign-out wording. | Full player suite/typecheck plus focused two-context browser runs. Same state and statuses on desktop/phone; opt-in import with raw bytes retained; name/ID/size errors; account callbacks; takeover/recovery; async Save & Close; archive/restart slot behavior; keyboard/touch/accessibility. Manager checks actual phone. |
| **B2.5 Capacity, backup and integrated recovery** | Dedicated synthetic `tests/e2e/cloud-saves.spec.ts`, future read-only capacity/load harness and a private-backup/restore setup runbook; avoid editing current game evidence fixtures to make limits pass. | All unit/SQL suites, physical DB/egress measurements for 30 accounts and 60 campaigns plus long play, transient space/cleanup, ingress bounds, unavailable/read-only service, deletion-aware isolated restore and compatible rollback. Demonstrated <400 MB working budget with reserves; realistic transfer fits allowance. Otherwise manager escalates lossless storage/limits/plan before enablement. |
| **B2.6 Manager acceptance and staged enablement** | Manager owns final reviewed manifest/diffs, owner decisions, handoff, backup checkpoint, authorized SQL application, cloud capability cohort and release. Workers may get separate bounded validation briefs. | Required regression/build commands and live synthetic handoff/deletion smoke tests pass; notice/campaign/backup choices settled; rollout/rollback gates operational; no changed owner prototype pathway. Owner and small tester cohort demonstrate desktop -> phone -> desktop before broad enablement. |

Suggested exact command contract for future briefs (new files above must exist
first; none of these suites/builds/DB/browser commands was run by this planning
worker):

```powershell
# B2.1 / B2.3 focused player tests; use existing installed dependencies.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/accountStorage.test.ts src/session/accountSessionIntegration.test.tsx src/session/localCampaignRepository.test.ts

# B2.4 / integrated regression.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck

# B2.2 / B2.5: ONLY a previously provisioned disposable DB, using private env.
# Manager verifies target and migration order first; never print the env value.
psql --dbname "$env:GAMIFY_BETA2_TEST_DB_URL" --set ON_ERROR_STOP=1 --file supabase/tests/beta2_cloud_saves.sql

# Manager browser validation with the isolated QA server already running.
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/cloud-saves.spec.ts --project=desktop-chrome --project=phone-chrome

# Manager release regression in its authorized environment.
npm.cmd test
npm.cmd run build:pages
```

The new SQL test should follow the existing rollback-only synthetic test style
and print a precise PASS row only after all assertions; actual concurrent
sessions and Data API tests remain additional gates. Run all prior SQL files
from `supabase/tests/README.md` after the complete migration sequence. A local
PostgreSQL/Supabase installation is not assumed available; missing infrastructure
is an explicit manager validation dependency, not permission for a worker to
install or contact a live project. In this sandbox use `--pool=threads` and the
existing approved preload if needed; the manager reruns default-config tests
and browser checks independently. Record exact exit codes/test totals and
redacted logs, distinguish mocked, SQL, hosted and physical-device evidence,
and report unrelated concurrent regression failures rather than weaken tests.

## 10. Owner decisions needed

These are new choices; one writer, explicit takeover, no merges, existing
invite-only Auth and leaving the prototype local are already settled.

1. **How many campaigns should each player keep in the cloud at first?**
   Recommended default: **two**, including archives/recovery copies, within
   the tested account space budget (proposed 8 MB snapshots + 2 MB evidence).
   Keep extra existing campaigns local; do not delete them. Larger campaigns
   may use the available space sooner; explain limits before enrollment/restart.
2. **Are weekly private backups, keeping two copies for up to 14 days, enough?**
   Recommended default: **yes for this invited beta**, plus the prior cloud
   revision and a tested restore. A total-project failure could lose progress
   since the last weekly backup; shorter recovery requires a revised budget.
3. **Should Beta 2 stay on the free plan while tested usage fits?**
   Recommended default: **yes, with capacity warnings and a safe pause if
   limits are reached**; discuss a paid plan before any purchase or expanded
   promise. Do not automatically upgrade or discard history to stay free.
4. **Should signing out keep this account's recovery copy on that device?**
   Recommended default: **keep it**, with an explicit clear-this-device option
   and shared-device warning. Unsent progress must be confirmed/exported before
   intentional removal; signing out never uploads it to a different account.

## Progress, discoveries and next action

- [x] Read repository instructions, the prior Beta 2 design/binding owner
  decisions, current account/local persistence, both shell save boundaries,
  relevant accepted ADRs and existing Supabase grants/RPC/deletion patterns.
- [x] Measure synthetic serialized checkpoints read-only and record byte/hash
  receipts; distinguish sample maximum from an absent true maximum.
- [x] Draft options/recommendation, 30-player capacity correction, opt-in import,
  prototype/origin preservation, schema/security/privacy, UX, validation,
  rollout/rollback and bounded lanes.
- [x] Validate UTF-8/no BOM, LF-only lines, final newline, paired code fences,
  local document links, four owner questions, current fixture hash receipts and
  the 326.898 / 350 / 470 MB scenario calculations with a read-only Node check.
- [ ] Manager reviews this document and resolves the four owner choices; no
  implementation milestone has been accepted, started or delegated here.
- [ ] Manager schedules B2.1 after checking concurrent domain/content ownership,
  then assigns sequential bounded briefs and provisions disposable validation
  through its authorized route.

Key discoveries: the IndexedDB repository is not active/account-scoped; raw
local timestamps are not cloud revisions; local serialization has no maximum;
two 3 MB campaigns for each of 30 players overrun the conservative working
budget once prior copies/history/overhead are included; frequent cross-device
downloads also need an egress test; imports cannot reconstruct already retired
audit events; and existing usage-only deletion/consent must be extended without
claiming existing Beta 1 consent already covers full campaigns.

Next action: manager reviews the proposed budget and evidence contract, obtains
the owner choices, and issues the B2.1 brief. This document is **local only**;
no GitHub backup, implementation, cloud migration, provisioning or publication
was performed. The manager owns its checkpoint reminder and current-thread
handoff; this planning worker intentionally did not edit any other file.

## Owner decisions (2026-10-17)

Owner in chat: "Go with your recommendations." Binding:
1. Two cloud campaigns per player at first (including archives/recovery copies); extra campaigns stay local, never deleted.
2. Weekly private backups keeping two copies for up to 14 days, plus each campaign's prior cloud revision and a tested restore.
3. Stay on the Supabase free plan while measured usage fits; capacity warnings and a safe pause if limits approach; discuss any paid plan before purchase.
4. Signing out keeps that account's local recovery copy on the device, with an explicit "clear this device" option and a shared-device warning.
Manager: B2.1 dispatched 2026-10-17, concurrently with the game-domain Level 5 latent-bug worker (disjoint lanes; B2.1 reads domain only).
